const mongoose = require('mongoose');

// Reserved now so Phase 2+ (block library, hover-flip button, article/policy
// list blocks) can attach without a schema migration later - only 'text' and
// 'placeholder' are rendered/editable in Phase 1.
const BLOCK_TYPES = [
  'text',
  'richtext',
  'image',
  'button-flip',
  'article-list',
  'policy-list',
  'placeholder',
];

// Token names, not raw CSS values - the frontend resolves these against
// tokens.css so the editor can only ever pick colors/sizes already in the
// design system.
const FONT_SIZE_TOKENS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', 'display'];
const TEXT_COLOR_TOKENS = ['white', 'gold', 'navy', 'body-text', 'text-muted', 'danger'];
// Spacing presets for a text block: space above/below it and the spacing
// between its own lines. null = the site's normal styling for that spot.
const SPACE_TOKENS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const LINE_HEIGHT_TOKENS = ['tight', 'normal', 'relaxed', 'loose'];
const TEXT_ALIGN_TOKENS = ['left', 'center', 'right', 'justify'];

// Content shared by every page (bottom call-to-action, contact band, footer)
// lives in one page document per slug here. Unlike the 7 seeded pages,
// these are created on the owner's first edit (see the PATCH route).
const GLOBAL_PAGE_SLUGS = ['site'];

// Bounded presets, not free pixel values - same "pick from the design
// system, not raw CSS" philosophy as FONT_SIZE_TOKENS/TEXT_COLOR_TOKENS, so
// the owner can't produce a broken responsive layout by resizing a section.
const SECTION_SIZE_TOKENS = ['compact', 'default', 'tall'];

const blockSchema = new mongoose.Schema(
  {
    blockId: { type: String, required: true },
    type: { type: String, enum: BLOCK_TYPES, default: 'text' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    style: {
      fontSize: { type: String, enum: FONT_SIZE_TOKENS, default: null },
      color: { type: String, enum: TEXT_COLOR_TOKENS, default: null },
      spaceAbove: { type: String, enum: SPACE_TOKENS, default: null },
      spaceBelow: { type: String, enum: SPACE_TOKENS, default: null },
      lineHeight: { type: String, enum: LINE_HEIGHT_TOKENS, default: null },
      textAlign: { type: String, enum: TEXT_ALIGN_TOKENS, default: null },
    },
    editable: { type: Boolean, default: true },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    layout: { type: String, default: 'default' },
    // No migration needed for already-seeded pages: Mongoose applies these
    // defaults on read for any section stored before this field existed, and
    // since every legacy section ties at order 0, a stable sort (guaranteed
    // by JS since ES2019) preserves their original array order - which is
    // exactly each page's original visual order.
    order: { type: Number, default: 0 },
    size: { type: String, enum: SECTION_SIZE_TOKENS, default: 'default' },
    blocks: [blockSchema],
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    sections: [sectionSchema],
    updatedBy: { type: String },
  },
  { timestamps: true }
);

const Page = mongoose.model('Page', pageSchema);

Page.BLOCK_TYPES = BLOCK_TYPES;
Page.FONT_SIZE_TOKENS = FONT_SIZE_TOKENS;
Page.TEXT_COLOR_TOKENS = TEXT_COLOR_TOKENS;
Page.SPACE_TOKENS = SPACE_TOKENS;
Page.LINE_HEIGHT_TOKENS = LINE_HEIGHT_TOKENS;
Page.TEXT_ALIGN_TOKENS = TEXT_ALIGN_TOKENS;
Page.GLOBAL_PAGE_SLUGS = GLOBAL_PAGE_SLUGS;
Page.SECTION_SIZE_TOKENS = SECTION_SIZE_TOKENS;

module.exports = Page;
