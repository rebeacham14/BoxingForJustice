const express = require('express');
const mongoose = require('mongoose');

const Page = require('../models/Page');
const NavItem = require('../models/NavItem');
const Article = require('../models/Article');
const Policy = require('../models/Policy');
const { authMiddleware, requireOwner } = require('../middleware/authMiddleware');
const { imageBytesInPage, getImageStorageStats, PAGE_HARD_LIMIT_BYTES } = require('../utils/storageStats');

const router = express.Router();

const IMAGE_TOO_LARGE_MESSAGE =
  'That image is too large for this page — try a smaller one, or let your developer know if this keeps happening.';

// Shared by the PATCH and bulk-create routes below: rejects a save if adding
// this image would push the page's total embedded-image size over the hard
// cap (see Backend/utils/storageStats.js for why 10MB).
function wouldExceedPageImageLimit(page, incomingImage, excludeBlockId) {
  if (typeof incomingImage !== 'string' || !incomingImage.startsWith('data:')) {
    return false;
  }

  const existingBytes = imageBytesInPage(page, excludeBlockId);
  const incomingBytes = Buffer.byteLength(incomingImage, 'utf8');

  return existingBytes + incomingBytes > PAGE_HARD_LIMIT_BYTES;
}

/* =========================
   NAV (public read; Frontend/src/data/navigation.js is the in-memory
   fallback if this fetch fails - nav must never go blank)
========================= */

router.get('/nav', async (req, res) => {
  try {
    const navItems = await NavItem.find().sort({ order: 1 });
    return res.json(navItems);
  } catch (error) {
    console.error('Nav fetch error:', error);

    return res.status(500).json({
      message: 'Error getting nav',
      error: error.message,
    });
  }
});

/* =========================
   PAGES / BLOCKS (site editor - Phase 1: read a page's content, and
   owner-only patch a single block's content/style)
========================= */

router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    return res.json(page);
  } catch (error) {
    console.error('Page fetch error:', error);

    return res.status(500).json({
      message: 'Error getting page',
      error: error.message,
    });
  }
});

router.patch(
  '/pages/:slug/blocks/:blockId',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const { content, style } = req.body;

      if (content === undefined && style === undefined) {
        return res.status(400).json({ message: 'Nothing to update' });
      }

      if (
        style?.fontSize != null &&
        !Page.FONT_SIZE_TOKENS.includes(style.fontSize)
      ) {
        return res.status(400).json({
          message: `Invalid fontSize. Must be one of: ${Page.FONT_SIZE_TOKENS.join(', ')}`,
        });
      }

      if (
        style?.color != null &&
        !Page.TEXT_COLOR_TOKENS.includes(style.color)
      ) {
        return res.status(400).json({
          message: `Invalid color. Must be one of: ${Page.TEXT_COLOR_TOKENS.join(', ')}`,
        });
      }

      for (const field of ['spaceAbove', 'spaceBelow']) {
        if (style?.[field] != null && !Page.SPACE_TOKENS.includes(style[field])) {
          return res.status(400).json({
            message: `Invalid ${field}. Must be one of: ${Page.SPACE_TOKENS.join(', ')}`,
          });
        }
      }

      if (
        style?.lineHeight != null &&
        !Page.LINE_HEIGHT_TOKENS.includes(style.lineHeight)
      ) {
        return res.status(400).json({
          message: `Invalid lineHeight. Must be one of: ${Page.LINE_HEIGHT_TOKENS.join(', ')}`,
        });
      }

      const page = await Page.findOne({ slug: req.params.slug });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      let targetBlock = null;

      for (const section of page.sections) {
        const block = section.blocks.find((b) => b.blockId === req.params.blockId);

        if (block) {
          targetBlock = block;
          break;
        }
      }

      // Auto-create rather than 404: lets EditableText/EditableImage/etc.
      // save the very first edit to a blockId that was never seeded, the
      // same way Phase 2's bulk-create route auto-creates a missing
      // section. sectionId is derived from the blockId itself
      // (<pageSlug>.<sectionId>.<field>), matching the exact convention
      // Backend/seedData/pages.seed.js's buildPage() already uses.
      if (!targetBlock) {
        const sectionId = req.params.blockId.split('.')[1];

        if (!sectionId) {
          return res.status(400).json({
            message: 'Invalid blockId - expected <page>.<section>.<field>',
          });
        }

        let section = page.sections.find((s) => s.sectionId === sectionId);

        if (!section) {
          page.sections.push({ sectionId, layout: 'default', blocks: [] });
          section = page.sections[page.sections.length - 1];
        }

        section.blocks.push({ blockId: req.params.blockId, type: 'text', content: {}, style: {} });
        targetBlock = section.blocks[section.blocks.length - 1];
      }

      if (
        content?.image !== undefined &&
        wouldExceedPageImageLimit(page, content.image, req.params.blockId)
      ) {
        return res.status(400).json({ message: IMAGE_TOO_LARGE_MESSAGE });
      }

      if (content !== undefined) {
        targetBlock.content = { ...targetBlock.content, ...content };
      }

      if (style?.fontSize !== undefined) {
        targetBlock.style.fontSize = style.fontSize;
      }

      if (style?.color !== undefined) {
        targetBlock.style.color = style.color;
      }

      for (const field of ['spaceAbove', 'spaceBelow', 'lineHeight']) {
        if (style?.[field] !== undefined) {
          targetBlock.style[field] = style[field];
        }
      }

      page.updatedBy = req.auth.userId;
      page.markModified('sections');
      await page.save();

      return res.json({ page, block: targetBlock });
    } catch (error) {
      console.error('Block update error:', error);

      return res.status(500).json({
        message: 'Error updating block',
        error: error.message,
      });
    }
  }
);

// Bulk-create: used by the block library (e.g. adding a flip-button, which
// is a group of 5 sibling blocks sharing a blockId prefix - see
// Frontend/src/components/site/blocks/CustomBlocks.jsx) so a group is
// created atomically rather than block-by-block. Auto-creates the section
// if it doesn't exist yet (e.g. the first time anyone adds a block to the
// "custom" section on a given page).
router.post(
  '/pages/:slug/sections/:sectionId/blocks',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const { blocks } = req.body;

      if (!Array.isArray(blocks) || blocks.length === 0) {
        return res.status(400).json({ message: 'No blocks to add' });
      }

      for (const block of blocks) {
        if (!block.blockId || !block.type) {
          return res.status(400).json({ message: 'Each block needs a blockId and type' });
        }
      }

      const page = await Page.findOne({ slug: req.params.slug });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      for (const block of blocks) {
        if (wouldExceedPageImageLimit(page, block.content?.image, null)) {
          return res.status(400).json({ message: IMAGE_TOO_LARGE_MESSAGE });
        }
      }

      let section = page.sections.find((s) => s.sectionId === req.params.sectionId);

      if (!section) {
        page.sections.push({ sectionId: req.params.sectionId, layout: 'default', blocks: [] });
        section = page.sections[page.sections.length - 1];
      }

      for (const block of blocks) {
        section.blocks.push({
          blockId: block.blockId,
          type: block.type,
          content: block.content || {},
          style: block.style || {},
        });
      }

      page.updatedBy = req.auth.userId;
      page.markModified('sections');
      await page.save();

      return res.status(201).json({ page });
    } catch (error) {
      console.error('Block create error:', error);

      return res.status(500).json({
        message: 'Error adding block',
        error: error.message,
      });
    }
  }
);

// Reorder: takes the FULL new ordered list of a page's section ids (not a
// partial diff) and rewrites order = array index for each. Rejecting on any
// mismatch against the page's current section set - rather than silently
// applying a partial reorder - avoids desync if e.g. Phase 2's block library
// auto-created a new section between the owner loading the page and
// submitting a reorder.
router.patch(
  '/pages/:slug/sections/reorder',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const { order } = req.body;

      if (!Array.isArray(order) || order.length === 0) {
        return res.status(400).json({ message: 'No section order provided' });
      }

      const page = await Page.findOne({ slug: req.params.slug });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      const currentIds = new Set(page.sections.map((s) => s.sectionId));
      const submittedIds = new Set(order);

      const setsMatch =
        currentIds.size === submittedIds.size &&
        [...currentIds].every((id) => submittedIds.has(id));

      if (!setsMatch) {
        return res.status(400).json({
          message: 'That section list is out of date - refresh the page and try again.',
        });
      }

      for (const section of page.sections) {
        section.order = order.indexOf(section.sectionId);
      }

      page.updatedBy = req.auth.userId;
      page.markModified('sections');
      await page.save();

      return res.json({ page });
    } catch (error) {
      console.error('Section reorder error:', error);

      return res.status(500).json({
        message: 'Error reordering sections',
        error: error.message,
      });
    }
  }
);

// Size preset: bounded tokens only (Page.SECTION_SIZE_TOKENS), same
// enum-validation convention as the block route's fontSize/color.
router.patch(
  '/pages/:slug/sections/:sectionId/size',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const { size } = req.body;

      if (!Page.SECTION_SIZE_TOKENS.includes(size)) {
        return res.status(400).json({
          message: `Invalid size. Must be one of: ${Page.SECTION_SIZE_TOKENS.join(', ')}`,
        });
      }

      const page = await Page.findOne({ slug: req.params.slug });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      const section = page.sections.find((s) => s.sectionId === req.params.sectionId);

      if (!section) {
        return res.status(404).json({ message: 'Section not found' });
      }

      section.size = size;
      page.updatedBy = req.auth.userId;
      page.markModified('sections');
      await page.save();

      return res.json({ page });
    } catch (error) {
      console.error('Section size error:', error);

      return res.status(500).json({
        message: 'Error resizing section',
        error: error.message,
      });
    }
  }
);

// Bulk-delete: removes every block whose id is in `blockIds`, wherever it
// lives in the page's sections. Used to remove an entire block-group (e.g.
// a flip-button's 5 sibling blocks) in one request.
router.delete(
  '/pages/:slug/blocks',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const { blockIds } = req.body;

      if (!Array.isArray(blockIds) || blockIds.length === 0) {
        return res.status(400).json({ message: 'No blocks to remove' });
      }

      const page = await Page.findOne({ slug: req.params.slug });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      const idsToRemove = new Set(blockIds);

      for (const section of page.sections) {
        section.blocks = section.blocks.filter((b) => !idsToRemove.has(b.blockId));
      }

      page.updatedBy = req.auth.userId;
      page.markModified('sections');
      await page.save();

      return res.json({ page });
    } catch (error) {
      console.error('Block delete error:', error);

      return res.status(500).json({
        message: 'Error removing block',
        error: error.message,
      });
    }
  }
);

/* =========================
   STORAGE STATS (owner-only - backs the plain "talk to your developer"
   warning banner in edit mode; raw byte counts never surface to the owner)
========================= */

router.get('/storage-stats', authMiddleware, requireOwner, async (req, res) => {
  try {
    const stats = await getImageStorageStats();
    return res.json(stats);
  } catch (error) {
    console.error('Storage stats error:', error);

    return res.status(500).json({
      message: 'Error getting storage stats',
      error: error.message,
    });
  }
});

/* =========================
   ARTICLES (public read of published items; owner-only create/edit/delete
   from the /articles pages in edit mode) / POLICIES (read-only until the
   policies builder ships)
========================= */

const ARTICLE_TITLE_MAX = 200;
const ARTICLE_BODY_MAX = 50000;

// Shared by create/edit: trims and length-checks the owner's input. Returns
// { error } or { fields } (only the fields actually sent, for PATCH).
function readArticleFields(body, { requireTitle }) {
  const fields = {};

  if (body.title !== undefined || requireTitle) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';

    if (!title) {
      return { error: 'Please give the article a title.' };
    }

    if (title.length > ARTICLE_TITLE_MAX) {
      return { error: `Titles can be at most ${ARTICLE_TITLE_MAX} characters.` };
    }

    fields.title = title;
  }

  if (body.body !== undefined) {
    if (typeof body.body !== 'string') {
      return { error: 'Invalid article text.' };
    }

    if (body.body.length > ARTICLE_BODY_MAX) {
      return { error: 'That article is too long.' };
    }

    fields.body = body.body;
  }

  return { fields };
}

// Newest first. Pre-existing docs without publishedAt fall back to createdAt.
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 });
    return res.json(articles);
  } catch (error) {
    console.error('Article fetch error:', error);

    return res.status(500).json({
      message: 'Error getting articles',
      error: error.message,
    });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = await Article.findOne({ _id: req.params.id, status: 'published' });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json(article);
  } catch (error) {
    console.error('Article fetch error:', error);

    return res.status(500).json({
      message: 'Error getting article',
      error: error.message,
    });
  }
});

// Owner-added articles publish immediately - there's no draft/review step
// in the UI yet, so a draft would just be invisible to everyone.
router.post('/articles', authMiddleware, requireOwner, async (req, res) => {
  try {
    const { error, fields } = readArticleFields(req.body, { requireTitle: true });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const article = await Article.create({
      ...fields,
      status: 'published',
      publishedAt: new Date(),
    });

    return res.status(201).json(article);
  } catch (error) {
    console.error('Article create error:', error);

    return res.status(500).json({
      message: 'Error creating article',
      error: error.message,
    });
  }
});

router.patch('/articles/:id', authMiddleware, requireOwner, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { error, fields } = readArticleFields(req.body, { requireTitle: false });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const article = await Article.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json(article);
  } catch (error) {
    console.error('Article update error:', error);

    return res.status(500).json({
      message: 'Error updating article',
      error: error.message,
    });
  }
});

router.delete('/articles/:id', authMiddleware, requireOwner, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json({ deleted: true });
  } catch (error) {
    console.error('Article delete error:', error);

    return res.status(500).json({
      message: 'Error deleting article',
      error: error.message,
    });
  }
});

router.get('/policies', async (req, res) => {
  try {
    const policies = await Policy.find({ status: 'published' }).sort({ order: 1 });
    return res.json(policies);
  } catch (error) {
    console.error('Policy fetch error:', error);

    return res.status(500).json({
      message: 'Error getting policies',
      error: error.message,
    });
  }
});

module.exports = router;
