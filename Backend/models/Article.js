const mongoose = require('mongoose');

// Created/edited/deleted by the owner from /articles in edit mode (see
// Frontend/src/pages/site/ArticlesPage.jsx). `layoutTemplate` and `images`
// aren't exposed in that UI yet - articles are a title + plain-text body.
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
