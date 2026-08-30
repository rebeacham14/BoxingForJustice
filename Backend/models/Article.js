const mongoose = require('mongoose');

// Schema-ready in Phase 1 (GET /api/articles returns published docs) but
// there's no create/edit UI yet - that's the Phase 3 articles builder.
const articleImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, default: 'articles' },
    layoutTemplate: { type: String, default: 'standard' },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    images: [articleImageSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
