// Width guardrails for the owner's drag-to-resize (see useResizableWidth.js).
// Widths are stored as a percentage of the section's parent container, never
// raw pixels, so a width chosen on one desktop still makes sense on another.
// Below the mobile breakpoint the stored width is ignored entirely and every
// section goes back to 100% (see `.bfj-resizable` in site.css).

export const GRID_COLUMNS = 12;
export const COLUMN_PCT = 100 / GRID_COLUMNS;

// Never narrower than a typical phone's content width, and never narrower
// than 3 of 12 columns - whichever is bigger at the current container size.
export const MIN_WIDTH_PX = 320;
export const MIN_WIDTH_PCT = 25;
export const MAX_WIDTH_PCT = 100;

// Keyboard nudge step when grid mode is off.
export const FREE_STEP_PCT = 5;

function minPctFor(containerWidthPx) {
  const pxFloor = containerWidthPx > 0 ? (MIN_WIDTH_PX / containerWidthPx) * 100 : MAX_WIDTH_PCT;
  return Math.min(MAX_WIDTH_PCT, Math.max(MIN_WIDTH_PCT, pxFloor));
}

// Snaps (grid mode: whole columns, otherwise whole percents) and clamps a
// raw drag width. In grid mode the minimum is rounded UP to a whole column
// so a clamped value still lands on the grid.
export function constrainWidth(rawPct, containerWidthPx, gridMode) {
  let minPct = minPctFor(containerWidthPx);

  if (gridMode) {
    minPct = Math.min(MAX_WIDTH_PCT, Math.ceil(minPct / COLUMN_PCT - 1e-9) * COLUMN_PCT);
    const snapped = Math.round(rawPct / COLUMN_PCT) * COLUMN_PCT;
    return Math.min(MAX_WIDTH_PCT, Math.max(minPct, snapped));
  }

  return Math.min(MAX_WIDTH_PCT, Math.max(minPct, Math.round(rawPct)));
}

// Sanitizes a width read back from Mongo (block content is schemaless), so a
// bad stored value can never produce a broken layout. null = full width.
export function readStoredWidth(value) {
  const pct = Number(value);

  if (!Number.isFinite(pct) || pct >= MAX_WIDTH_PCT) {
    return null;
  }

  return Math.max(MIN_WIDTH_PCT, pct);
}

export function describeWidth(pct, containerWidthPx) {
  const columns = pct / COLUMN_PCT;
  const onGrid = Math.abs(columns - Math.round(columns)) < 0.01;
  const px = Math.round((pct / 100) * containerWidthPx);
  const parts = [`${Math.round(pct)}%`];

  if (onGrid) {
    parts.unshift(`${Math.round(columns)} / ${GRID_COLUMNS} cols`);
  }

  parts.push(`${px}px`);
  return parts.join(' · ');
}
