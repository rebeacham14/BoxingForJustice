const express = require('express');

const Page = require('../models/Page');
const NavItem = require('../models/NavItem');
const Article = require('../models/Article');
const Policy = require('../models/Policy');
const { authMiddleware, requireOwner } = require('../middleware/authMiddleware');

const router = express.Router();

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

      if (!targetBlock) {
        return res.status(404).json({ message: 'Block not found' });
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

/* =========================
   ARTICLES / POLICIES (schema-ready for Phase 3/4 builders; public read
   of published items only - empty lists until those builders ship)
========================= */

router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' }).sort({ order: 1 });
    return res.json(articles);
  } catch (error) {
    console.error('Article fetch error:', error);

    return res.status(500).json({
      message: 'Error getting articles',
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
