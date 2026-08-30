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
const TEXT_COLOR_TOKENS = ['white', 'gold', 'body-text', 'text-muted', 'danger'];

const blockSchema = new mongoose.Schema(
  {
    blockId: { type: String, required: true },
    type: { type: String, enum: BLOCK_TYPES, default: 'text' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    style: {
      fontSize: { type: String, enum: FONT_SIZE_TOKENS, default: null },
      color: { type: String, enum: TEXT_COLOR_TOKENS, default: null },
    },
    editable: { type: Boolean, default: true },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    layout: { type: String, default: 'default' },
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

module.exports = Page;
