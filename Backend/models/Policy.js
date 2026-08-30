const mongoose = require('mongoose');

// Schema-ready in Phase 1 (GET /api/policies returns published docs) but
// there's no create/edit UI yet - that's the Phase 4 policies builder.
const policyImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  {
    section: { type: String, required: true, default: 'policies' },
    layoutTemplate: { type: String, default: 'standard' },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    images: [policyImageSchema],
    stateCode: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
