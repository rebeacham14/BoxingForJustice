import { MAX_WIDTH_PCT, MIN_WIDTH_PCT, describeWidth } from '../../utils/layoutGrid';

const LIMIT_NOTES = {
  content: "Content can't fit narrower",
  min: 'Minimum width',
  max: 'Full width',
};

// Edge strips + corner grips + live width tooltip for one resizable element.
// Props come from useResizableWidth(). Width-only: the
// corners resize the same way as their side's edge (height stays governed
// by content and the S/M/L size presets). Only the two edge strips are
// keyboard-focusable, so each section adds 2 tab stops rather than 6.
export default function ResizeHandles({ width, drag, handleProps, gridMode }) {
  const valueNow = Math.round(width ?? MAX_WIDTH_PCT);

  function edgeProps(edge) {
    return {
      ...handleProps(edge),
      className: `bfj-resize-handle bfj-resize-handle-${edge}`,
      role: 'separator',
      tabIndex: 0,
      'aria-orientation': 'vertical',
      'aria-label': `Resize section width from the ${edge} edge${gridMode ? ' (snaps to 12-column grid)' : ''}`,
      'aria-valuenow': valueNow,
      'aria-valuemin': MIN_WIDTH_PCT,
      'aria-valuemax': MAX_WIDTH_PCT,
      'aria-valuetext': `${valueNow}% width`,
    };
  }

  function cornerProps(edge, vertical) {
    return {
      ...handleProps(edge),
      className: `bfj-resize-corner bfj-resize-corner-${vertical}-${edge}`,
      tabIndex: -1,
      'aria-hidden': true,
    };
  }

  return (
    <>
      <div {...edgeProps('left')} />
      <div {...edgeProps('right')} />
      <div {...cornerProps('left', 'top')} />
      <div {...cornerProps('right', 'top')} />
      <div {...cornerProps('left', 'bottom')} />
      <div {...cornerProps('right', 'bottom')} />
      {drag && (
        <div className="bfj-resize-tooltip" role="status" style={{ left: drag.x, top: drag.y }}>
          {describeWidth(drag.widthPct, drag.containerPx)}
          {drag.limit && <small>{LIMIT_NOTES[drag.limit]}</small>}
        </div>
      )}
    </>
  );
}
