const mongoose = require('mongoose');

// Mirrors the shape of the old static Frontend/src/data/navigation.js
// NAV_ITEMS array, seeded 1:1 from it. No nav CRUD yet - that's Phase 5,
// when creating a nav item also creates a blank linked Page.
const navSubmenuSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    hash: { type: String, required: true },
  },
  { _id: false }
);

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    to: { type: String, required: true },
    order: { type: Number, required: true },
    submenu: [navSubmenuSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('NavItem', navItemSchema);
