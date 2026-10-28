import { useEffect, useRef, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { updateBlock } from '../../utils/contentApi';
import { readOffset } from '../../utils/moveOffset';

const NUDGE_PX = 1;
const BIG_NUDGE_PX = 10;

function findElement(blockId) {
  return document.querySelector(`[data-block-id="${CSS.escape(blockId)}"]`);
}

function clampTo(value, min, max, fallback) {
  // Element bigger than its section: there's no position that fits, so
  // don't let it move on that axis at all.
  if (max < min) return fallback;
  return Math.min(max, Math.max(min, value));
}

// Applies an offset straight to the DOM during a drag. Pointer events fire
// far faster than React renders; the saved offset is written once, on
// release, and React's next render takes over from there.
function applyLive(el, offset) {
  el.classList.add('bfj-moved');
  el.style.setProperty('--bfj-move-x', `${offset.x}px`);
  el.style.setProperty('--bfj-move-y', `${offset.y}px`);
}

// Drag grip + reset button floating at the selected element's top-left
// corner, plus a dashed outline around it. Works for any element carrying
// `data-block-id` - every EditableText in edit mode, and anything using
// useMovable(). Lives inside EditablePage next to EditToolbar, and finds the
// element in the DOM rather than wrapping it, so it adds no wrapper
// elements around the page's own markup (see the bare-`span` CSS gotchas
// noted in EditableText's history).
export default function MoveHandle() {
  const { isOwner, editMode, activeBlockId, activeBlockRegion } = useEditMode();
  const { regionId } = usePageContent();

  // Only the content region the selected element belongs to (see
  // activeBlockRegion in EditModeContext) - it saves to that region's page.
  if (!isOwner || !editMode || !activeBlockId || activeBlockRegion !== regionId) {
    return null;
  }

  return <MoveHandleControls key={activeBlockId} blockId={activeBlockId} />;
}

function MoveHandleControls({ blockId }) {
  const { getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const [rect, setRect] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);
  const [error, setError] = useState('');
  const dragRef = useRef(null);

  const savedOffset = readOffset(blocks[blockId]?.content?.offset);
  const shownOffset = dragOffset ?? savedOffset;

  // Follows the element through scrolling, typing, resizing and moving.
  // One getBoundingClientRect per frame, and only while something is
  // selected in edit mode.
  useEffect(() => {
    let frame;
    let last = '';

    function tick() {
      const r = findElement(blockId)?.getBoundingClientRect();
      const next = r && r.width + r.height > 0
        ? { top: r.top, left: r.left, width: r.width, height: r.height }
        : null;
      const key = JSON.stringify(next);

      if (key !== last) {
        last = key;
        setRect(next);
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [blockId]);

  async function saveOffset(next) {
    const offset = readOffset(next);
    const previous = savedOffset;

    setBlockLocal(blockId, { content: { offset } });

    try {
      await updateBlock(getToken, slug, blockId, { content: { offset } });
      setError('');
    } catch (err) {
      setBlockLocal(blockId, { content: { offset: previous } });
      setError(err.message);
    }
  }

  // Keeps the element inside its section, measured from where it sits now.
  function boundsFor(el, start) {
    const box = (el.closest('[data-section-id]') || el.parentElement).getBoundingClientRect();
    const r = el.getBoundingClientRect();

    return {
      minX: start.x + (box.left - r.left),
      maxX: start.x + (box.right - r.right),
      minY: start.y + (box.top - r.top),
      maxY: start.y + (box.bottom - r.bottom),
    };
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return;

    const el = findElement(blockId);
    if (!el) return;

    // Keeps focus (and the format toolbar) on the text being moved, and
    // stops text selection mid-drag.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const start = savedOffset || { x: 0, y: 0 };

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      start,
      bounds: boundsFor(el, start),
      snapshot: { cssText: el.style.cssText, className: el.className },
    };

    setDragOffset(start);
  }

  function handlePointerMove(e) {
    const d = dragRef.current;
    const el = findElement(blockId);

    if (!d || !el || e.pointerId !== d.pointerId) return;

    const next = {
      x: Math.round(clampTo(d.start.x + e.clientX - d.startX, d.bounds.minX, d.bounds.maxX, d.start.x)),
      y: Math.round(clampTo(d.start.y + e.clientY - d.startY, d.bounds.minY, d.bounds.maxY, d.start.y)),
    };

    d.last = next;
    applyLive(el, next);
    setDragOffset(next);
  }

  function handlePointerUp(e) {
    const d = dragRef.current;

    if (!d || e.pointerId !== d.pointerId) return;

    dragRef.current = null;
    setDragOffset(null);

    if (d.last && (d.last.x !== d.start.x || d.last.y !== d.start.y)) {
      saveOffset(d.last);
    }
  }

  function cancelDrag() {
    const d = dragRef.current;
    const el = findElement(blockId);

    if (d && el) {
      el.style.cssText = d.snapshot.cssText;
      el.className = d.snapshot.className;
    }

    dragRef.current = null;
    setDragOffset(null);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && dragRef.current) {
      cancelDrag();
      return;
    }

    const step = e.shiftKey ? BIG_NUDGE_PX : NUDGE_PX;
    const delta = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    }[e.key];

    if (!delta || dragRef.current) return;

    e.preventDefault();

    const el = findElement(blockId);
    if (!el) return;

    const start = savedOffset || { x: 0, y: 0 };
    const bounds = boundsFor(el, start);
    const next = {
      x: clampTo(start.x + delta.x, bounds.minX, bounds.maxX, start.x),
      y: clampTo(start.y + delta.y, bounds.minY, bounds.maxY, start.y),
    };

    if (next.x !== start.x || next.y !== start.y) {
      saveOffset(next);
    }
  }

  if (!rect) {
    return null;
  }

  // Above the element, unless that would put it off the top of the screen.
  const controlsTop = rect.top >= 44 ? rect.top - 38 : rect.top + rect.height + 6;

  return (
    <>
      <div
        className="bfj-move-outline"
        style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        aria-hidden="true"
      />
      <div className="bfj-move-controls" style={{ top: controlsTop, left: rect.left }}>
        <button
          type="button"
          className="bfj-move-grip"
          aria-label="Move: drag, or use the arrow keys (Shift for bigger steps)"
          title="Drag to move (arrow keys nudge, Shift for bigger steps, Esc cancels)"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={cancelDrag}
          onKeyDown={handleKeyDown}
        >
          ✥
        </button>
        <button
          type="button"
          className="bfj-section-controls-btn"
          aria-label="Put back in its original position"
          title="Put back in its original position"
          disabled={!savedOffset && !dragOffset}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => saveOffset(null)}
        >
          ↺
        </button>
        {shownOffset && (
          <span className="bfj-move-readout">
            {shownOffset.x}, {shownOffset.y}
          </span>
        )}
        {error && <span className="bfj-section-error">{error}</span>}
      </div>
    </>
  );
}
