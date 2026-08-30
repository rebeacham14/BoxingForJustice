// One-off migration script: node scripts/seedPages.js
//
// Upserts (not deleteMany+insertMany) so re-running this after the owner has
// already made live edits through the site editor won't clobber her work -
// it only fills in pages/nav items that don't exist yet.
require('dotenv').config();
const mongoose = require('mongoose');

const Page = require('../models/Page');
const NavItem = require('../models/NavItem');
const pagesSeed = require('../seedData/pages.seed');
const navSeed = require('../seedData/nav.seed');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  for (const page of pagesSeed) {
    const existing = await Page.findOne({ slug: page.slug });

    if (existing) {
      console.log(`Skipping existing page "${page.slug}" (already seeded or edited).`);
      continue;
    }

    await Page.create(page);
    console.log(`Seeded page "${page.slug}" (${page.sections.length} sections).`);
  }

  for (const navItem of navSeed) {
    await NavItem.findOneAndUpdate(
      { label: navItem.label },
      navItem,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Seeded nav item "${navItem.label}".`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
