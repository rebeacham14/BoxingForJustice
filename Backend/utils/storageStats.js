const Page = require('../models/Page');

// Soft warning threshold - shown to the owner as a plain "talk to your
// developer" banner once combined embedded-image storage crosses this, well
// before it becomes a real problem (e.g. Atlas M0's 512MB total cluster cap).
const WARN_THRESHOLD_BYTES = 50 * 1024 * 1024;

// Hard per-page cap - safety margin under MongoDB's 16MB/doc BSON limit,
// since a Page document embeds every block (including images) for that page.
const PAGE_HARD_LIMIT_BYTES = 10 * 1024 * 1024;

function imageBytesInPage(page, excludeBlockId) {
  let bytes = 0;

  for (const section of page.sections) {
    for (const block of section.blocks) {
      if (block.blockId === excludeBlockId) continue;

      const image = block.content?.image;

      if (typeof image === 'string' && image.startsWith('data:')) {
        bytes += Buffer.byteLength(image, 'utf8');
      }
    }
  }

  return bytes;
}

async function getImageStorageStats() {
  const pages = await Page.find({}, 'slug sections');
  let totalBytes = 0;
  const perPage = [];

  for (const page of pages) {
    const bytes = imageBytesInPage(page, null);
    perPage.push({ slug: page.slug, bytes });
    totalBytes += bytes;
  }

  return {
    totalBytes,
    perPage,
    warnThresholdBytes: WARN_THRESHOLD_BYTES,
    isOverThreshold: totalBytes > WARN_THRESHOLD_BYTES,
  };
}

module.exports = {
  imageBytesInPage,
  getImageStorageStats,
  WARN_THRESHOLD_BYTES,
  PAGE_HARD_LIMIT_BYTES,
};
