import { useRef, useState } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { usePageContent } from '../context/PageContentContext';
import { updateBlock } from '../utils/contentApi';
import {
  BIG_HEIGHT_STEP_PX,
  COLUMN_PCT,
  FREE_STEP_PCT,
  HEIGHT_STEP_PX,
  MAX_HEIGHT_PX,
  MAX_WIDTH_PCT,
  constrainWidth,
  readStoredHeight,
  readStoredWidth,
} from '../utils/layoutGrid';

// Which axes each handle drives. Side edges (and the top corners) set the
// width; the bottom edge sets the height; the bottom corners set both.
const HANDLE_AXES = {
  left: { x: 'left', y: false },
  right: { x: 'right', y: false },
  'top-left': { x: 'left', y: false },
  'top-right': { x: 'right', y: false },
  bottom: { x: null, y: true },
  'bottom-left': { x: 'left', y: true },
  'bottom-right': { x: 'right', y: true },
};

// Drag-to-resize width and height for one element (every EditableSection).
// Both are persisted on one ordinary block (`blockId`, auto-created on
// first save like any other block), same generic PATCH route as
// EditableText: `content.widthPct` (% of the parent, null = full width) and
// `content.minHeightPx` (null = the section's normal height).
//
// State is split on purpose:
// - `dragRef` (a ref) holds the per-gesture bookkeeping (start pointer,
//   start size, container width, last size that fit). Pointer events fire
//   far faster than React renders, and none of it needs to be drawn.
// - `drag` (state) is only what the UI draws while resizing: the live size
//   and the tooltip's position/limit note. `drag !== null` IS the
//   resizing/not-resizing flag.
// - The saved size lives in PageContentContext like every other block, and
//   is written once, on release - never on every pointermove.
export default function useSectionResize(blockId) {
  const { isOwner, editMode, gridMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const elementRef = useRef(null);
  const dragRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [error, setError] = useState('');

  const canEdit = isOwner && editMode;
  const savedWidth = readStoredWidth(blocks[blockId]?.content?.widthPct);
  const savedHeight = readStoredHeight(blocks[blockId]?.content?.minHeightPx);
  const isResizing = drag !== null;
  const width = isResizing ? drag.widthPct : savedWidth;
  const height = isResizing ? drag.heightPx : savedHeight;

  function getContainerWidth(el) {
    return el?.parentElement?.getBoundingClientRect().width || 0;
  }

  function overflowOf(el) {
    return el.scrollWidth - el.clientWidth;
  }

  // Applies a width straight to the DOM so the result can be measured in the
  // same event, and returns whether the section's content still fits (i.e.
  // didn't start overflowing more than it already did at the start). This is
  // what stops e.g. the home hero's 420px photo column from being squeezed
  // out of a too-narrow section - the px/% floors alone can't know that.
  function tryWidth(el, pct, baselineOverflow) {
    el.classList.add('bfj-resizable');
    el.style.setProperty('--bfj-width', `${pct}%`);
    return overflowOf(el) <= baselineOverflow + 1;
  }

  // Same idea for height: a min-height can't shrink a section below its
  // content, so the height actually shown is whatever the browser lays out.
  // Returns that real height, which is what gets saved.
  function tryHeight(el, px) {
    el.classList.add('bfj-resizable-h');
    el.style.setProperty('--bfj-min-height', `${px}px`);
    return Math.round(el.getBoundingClientRect().height);
  }

  async function saveSize(patch) {
    const content = {};

    if ('widthPct' in patch) {
      content.widthPct = patch.widthPct >= MAX_WIDTH_PCT ? null : patch.widthPct;
    }
    if ('minHeightPx' in patch) {
      content.minHeightPx = patch.minHeightPx;
    }

    const previous = { widthPct: savedWidth, minHeightPx: savedHeight };

    setBlockLocal(blockId, { content });

    try {
      await updateBlock(getToken, slug, blockId, { content });
      setError('');
    } catch (err) {
      setBlockLocal(blockId, { content: previous });
      setError(err.message);
    }
  }

  function cancelDrag() {
    // React re-renders with the saved size, which overwrites the DOM writes
    // tryWidth()/tryHeight() made during the drag.
    dragRef.current = null;
    setDrag(null);
  }

  function handlePointerDown(handle, e) {
    if (e.button !== 0) return;

    const el = elementRef.current;
    const containerPx = getContainerWidth(el);

    if (!el || !containerPx) return;

    // preventDefault stops text selection mid-drag, but also stops the
    // handle taking focus - focus it explicitly so Escape can cancel.
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const startPct = (rect.width / containerPx) * 100;
    const startHeight = Math.round(rect.height);

    dragRef.current = {
      pointerId: e.pointerId,
      axes: HANDLE_AXES[handle],
      startX: e.clientX,
      startY: e.clientY,
      startPx: rect.width,
      startPct,
      startHeight,
      containerPx,
      baselineOverflow: overflowOf(el),
      lastGoodPct: startPct,
      lastHeight: startHeight,
    };

    setDrag({ widthPct: startPct, heightPx: startHeight, containerPx, x: e.clientX, y: e.clientY, limit: null });
  }

  function handlePointerMove(e) {
    const d = dragRef.current;
    const el = elementRef.current;

    if (!d || !el || e.pointerId !== d.pointerId) return;

    let limit = null;

    if (d.axes.x) {
      // Sections are centered, so an edge moving dx grows/shrinks the width
      // by 2*dx - the dragged edge stays under the pointer.
      const dx = e.clientX - d.startX;
      const delta = d.axes.x === 'right' ? dx * 2 : -dx * 2;
      const minPct = constrainWidth(0, d.containerPx, gridMode);
      let next = constrainWidth(((d.startPx + delta) / d.containerPx) * 100, d.containerPx, gridMode);

      if (next !== d.lastGoodPct) {
        if (tryWidth(el, next, d.baselineOverflow)) {
          d.lastGoodPct = next;
        } else {
          tryWidth(el, d.lastGoodPct, d.baselineOverflow);
          next = d.lastGoodPct;
          limit = "Content can't fit narrower";
        }
      }

      if (!limit && next <= minPct) limit = 'Minimum width';
      if (!limit && next >= MAX_WIDTH_PCT && !d.axes.y) limit = 'Full width';
    }

    if (d.axes.y) {
      const requested = Math.min(MAX_HEIGHT_PX, Math.max(0, d.startHeight + e.clientY - d.startY));
      d.lastHeight = tryHeight(el, requested);

      if (!limit && d.lastHeight > requested + 1) limit = "Content can't fit shorter";
      if (!limit && requested >= MAX_HEIGHT_PX) limit = 'Maximum height';
    }

    setDrag({
      widthPct: d.lastGoodPct,
      heightPx: d.lastHeight,
      containerPx: d.containerPx,
      x: e.clientX,
      y: e.clientY,
      limit,
    });
  }

  function handlePointerUp(e) {
    const d = dragRef.current;

    if (!d || e.pointerId !== d.pointerId) return;

    dragRef.current = null;
    setDrag(null);

    const patch = {};

    if (d.axes.x && Math.abs(d.lastGoodPct - d.startPct) >= 0.01) {
      patch.widthPct = d.lastGoodPct;
    }
    if (d.axes.y && d.lastHeight !== d.startHeight) {
      patch.minHeightPx = d.lastHeight;
    }

    if (Object.keys(patch).length > 0) {
      saveSize(patch);
    }
  }

  function nudgeWidth(edge, key) {
    const el = elementRef.current;
    const containerPx = getContainerWidth(el);
    const growKey = edge === 'right' ? 'ArrowRight' : 'ArrowLeft';

    if (!el || !containerPx) return;

    const current = savedWidth ?? MAX_WIDTH_PCT;
    const step = gridMode ? COLUMN_PCT : FREE_STEP_PCT;
    const next = constrainWidth(current + (key === growKey ? step : -step), containerPx, gridMode);

    if (next === current) return;

    if (next < current && !tryWidth(el, next, overflowOf(el))) {
      tryWidth(el, current, Infinity);
      setError("This section's content can't fit any narrower.");
      return;
    }

    saveSize({ widthPct: next });
  }

  function nudgeHeight(key, big) {
    const el = elementRef.current;
    if (!el) return;

    const step = big ? BIG_HEIGHT_STEP_PX : HEIGHT_STEP_PX;
    const current = Math.round(el.getBoundingClientRect().height);
    const requested = Math.min(MAX_HEIGHT_PX, Math.max(0, current + (key === 'ArrowDown' ? step : -step)));
    const shown = tryHeight(el, requested);

    if (shown !== current) {
      saveSize({ minHeightPx: shown });
    } else if (key === 'ArrowUp') {
      setError("This section's content can't fit any shorter.");
    }
  }

  function handleKeyDown(handle, e) {
    if (e.key === 'Escape' && dragRef.current) {
      cancelDrag();
      return;
    }

    if (dragRef.current) return;

    if ((handle === 'left' || handle === 'right') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      nudgeWidth(handle, e.key);
    } else if (handle === 'bottom' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      nudgeHeight(e.key, e.shiftKey);
    }
  }

  // Spread onto each handle element (edge strips and corners).
  function handleProps(handle) {
    return {
      onPointerDown: (e) => handlePointerDown(handle, e),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: cancelDrag,
      onKeyDown: (e) => handleKeyDown(handle, e),
    };
  }

  return {
    elementRef,
    canEdit,
    width,
    height,
    savedWidth,
    savedHeight,
    isResizing,
    drag,
    error,
    handleProps,
    resetWidth: () => saveSize({ widthPct: MAX_WIDTH_PCT }),
    resetHeight: () => saveSize({ minHeightPx: null }),
  };
}
