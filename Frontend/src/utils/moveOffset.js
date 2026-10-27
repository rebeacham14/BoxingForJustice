// Free-move offsets for the owner's drag-to-move (see MoveHandle.jsx).
// Stored as `content.offset = { x, y }` (px) on the moved element's OWN
// block (a text block's offset sits next to its `value`), so moving needs
// no new block ids. The element keeps its place in the page flow and is
// only shifted visually, so nothing around it reflows. Offsets only apply
// above the tablet breakpoint (see `.bfj-moved` in site.css) - below it the
// layout collapses to one column and a desktop offset would make no sense.

// Sanity cap for values read back from Mongo (block content is schemaless).
const MAX_OFFSET_PX = 4000;

// null = not moved.
export function readOffset(value) {
  const x = Number(value?.x);
  const y = Number(value?.y);

  if (!Number.isFinite(x) || !Number.isFinite(y) || (x === 0 && y === 0)) {
    return null;
  }

  const clamp = (n) => Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, Math.round(n)));
  return { x: clamp(x), y: clamp(y) };
}

export function offsetStyle(offset) {
  if (!offset) return {};

  return { '--bfj-move-x': `${offset.x}px`, '--bfj-move-y': `${offset.y}px` };
}
