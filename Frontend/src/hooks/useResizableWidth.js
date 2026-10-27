import { useRef, useState } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { usePageContent } from '../context/PageContentContext';
import { updateBlock } from '../utils/contentApi';
import {
  COLUMN_PCT,
  FREE_STEP_PCT,
  MAX_WIDTH_PCT,
  constrainWidth,
  readStoredWidth,
} from '../utils/layoutGrid';

// Drag-to-resize width for one element (currently every EditableSection).
// The width is persisted as `content.widthPct` on one ordinary block
// (`blockId`, auto-created on first save like any other block), same generic
// PATCH route as EditableText/useEditableItemList. null/absent = full width.
//
// State is split on purpose:
// - `dragRef` (a ref) holds the per-gesture bookkeeping (start x, start
//   width, container width, last width that fit). Pointer events fire far
//   faster than React renders, and none of it needs to be drawn.
// - `drag` (state) is only what the UI draws while resizing: the live width
//   and the tooltip's position/limit note. `drag !== null` IS the
//   resizing/not-resizing flag.
// - The saved width lives in PageContentContext like every other block, and
//   is written once, on release - never on every pointermove.
export default function useResizableWidth(blockId) {
  const { isOwner, editMode, gridMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const elementRef = useRef(null);
  const dragRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [error, setError] = useState('');

  const canEdit = isOwner && editMode;
  const savedWidth = readStoredWidth(blocks[blockId]?.content?.widthPct);
  const isResizing = drag !== null;
  const width = isResizing ? drag.widthPct : savedWidth;

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

  async function saveWidth(pct) {
    const widthPct = pct >= MAX_WIDTH_PCT ? null : pct;
    const previous = savedWidth;

    setBlockLocal(blockId, { content: { widthPct } });

    try {
      await updateBlock(getToken, slug, blockId, { content: { widthPct } });
      setError('');
    } catch (err) {
      setBlockLocal(blockId, { content: { widthPct: previous } });
      setError(err.message);
    }
  }

  function cancelDrag() {
    // React re-renders with the saved width, which overwrites the DOM
    // writes tryWidth() made during the drag.
    dragRef.current = null;
    setDrag(null);
  }

  function handlePointerDown(edge, e) {
    if (e.button !== 0) return;

    const el = elementRef.current;
    const containerPx = getContainerWidth(el);

    if (!el || !containerPx) return;

    // preventDefault stops text selection mid-drag, but also stops the
    // handle taking focus - focus it explicitly so Escape can cancel.
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture(e.pointerId);

    const startPx = el.getBoundingClientRect().width;
    const startPct = (startPx / containerPx) * 100;

    dragRef.current = {
      pointerId: e.pointerId,
      edge,
      startX: e.clientX,
      startPx,
      startPct,
      containerPx,
      baselineOverflow: overflowOf(el),
      lastGoodPct: startPct,
    };

    setDrag({ widthPct: startPct, containerPx, x: e.clientX, y: e.clientY, limit: null });
  }

  function handlePointerMove(e) {
    const d = dragRef.current;
    const el = elementRef.current;

    if (!d || !el || e.pointerId !== d.pointerId) return;

    // Sections are centered, so an edge moving dx grows/shrinks the width by
    // 2*dx - the dragged edge stays under the pointer.
    const dx = e.clientX - d.startX;
    const delta = d.edge === 'right' ? dx * 2 : -dx * 2;
    const minPct = constrainWidth(0, d.containerPx, gridMode);
    let next = constrainWidth(((d.startPx + delta) / d.containerPx) * 100, d.containerPx, gridMode);
    let limit = null;

    if (next !== d.lastGoodPct) {
      if (tryWidth(el, next, d.baselineOverflow)) {
        d.lastGoodPct = next;
      } else {
        tryWidth(el, d.lastGoodPct, d.baselineOverflow);
        next = d.lastGoodPct;
        limit = 'content';
      }
    }

    if (!limit && next <= minPct) limit = 'min';
    if (!limit && next >= MAX_WIDTH_PCT) limit = 'max';

    setDrag({ widthPct: next, containerPx: d.containerPx, x: e.clientX, y: e.clientY, limit });
  }

  function handlePointerUp(e) {
    const d = dragRef.current;

    if (!d || e.pointerId !== d.pointerId) return;

    dragRef.current = null;
    setDrag(null);

    if (Math.abs(d.lastGoodPct - d.startPct) >= 0.01) {
      saveWidth(d.lastGoodPct);
    }
  }

  function handleKeyDown(edge, e) {
    if (e.key === 'Escape' && dragRef.current) {
      cancelDrag();
      return;
    }

    const growKey = edge === 'right' ? 'ArrowRight' : 'ArrowLeft';
    const shrinkKey = edge === 'right' ? 'ArrowLeft' : 'ArrowRight';

    if (e.key !== growKey && e.key !== shrinkKey) return;

    e.preventDefault();

    const el = elementRef.current;
    const containerPx = getContainerWidth(el);

    if (!el || !containerPx) return;

    const current = savedWidth ?? MAX_WIDTH_PCT;
    const step = gridMode ? COLUMN_PCT : FREE_STEP_PCT;
    const next = constrainWidth(current + (e.key === growKey ? step : -step), containerPx, gridMode);

    if (next === current) return;

    if (next < current && !tryWidth(el, next, overflowOf(el))) {
      tryWidth(el, current, Infinity);
      setError("This section's content can't fit any narrower.");
      return;
    }

    saveWidth(next);
  }

  // Spread onto each handle element (edge strips and corners).
  function handleProps(edge) {
    return {
      onPointerDown: (e) => handlePointerDown(edge, e),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: cancelDrag,
      onKeyDown: (e) => handleKeyDown(edge, e),
    };
  }

  return {
    elementRef,
    canEdit,
    width,
    savedWidth,
    isResizing,
    drag,
    error,
    handleProps,
    resetWidth: () => saveWidth(MAX_WIDTH_PCT),
  };
}
