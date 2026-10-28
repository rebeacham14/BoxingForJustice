import { MAX_HEIGHT_PX, MAX_WIDTH_PCT, MIN_WIDTH_PCT, describeWidth } from '../../utils/layoutGrid';

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

// Edge strips + corner grips + live size tooltip for one resizable section.
// Props come from useSectionResize(). Side edges (and the top corners) set
// the width, the bottom edge sets the height, the bottom corners set both.
// Only the three edge strips are keyboard-focusable (arrow keys), so each
// section adds 3 tab stops rather than 7.
export default function ResizeHandles({ width, height, drag, handleProps, gridMode }) {
  const widthNow = Math.round(width ?? MAX_WIDTH_PCT);

  function widthEdgeProps(edge) {
    return {
      ...handleProps(edge),
      className: `bfj-resize-handle bfj-resize-handle-${edge}`,
      role: 'separator',
      tabIndex: 0,
      'aria-orientation': 'vertical',
      'aria-label': `Resize section width from the ${edge} edge${gridMode ? ' (snaps to 12-column grid)' : ''}`,
      'aria-valuenow': widthNow,
      'aria-valuemin': MIN_WIDTH_PCT,
      'aria-valuemax': MAX_WIDTH_PCT,
      'aria-valuetext': `${widthNow}% width`,
    };
  }

  return (
    <>
      <div {...widthEdgeProps('left')} />
      <div {...widthEdgeProps('right')} />
      <div
        {...handleProps('bottom')}
        className="bfj-resize-handle bfj-resize-handle-bottom"
        role="separator"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label="Resize section height (arrow keys, Shift for bigger steps)"
        aria-valuenow={height ?? undefined}
        aria-valuemin={0}
        aria-valuemax={MAX_HEIGHT_PX}
        aria-valuetext={height ? `${height}px minimum height` : 'Normal height'}
      />
      {CORNERS.map((corner) => (
        <div
          key={corner}
          {...handleProps(corner)}
          className={`bfj-resize-corner bfj-resize-corner-${corner}`}
          tabIndex={-1}
          aria-hidden="true"
        />
      ))}
      {drag && (
        <div className="bfj-resize-tooltip" role="status" style={{ left: drag.x, top: drag.y }}>
          {describeWidth(drag.widthPct, drag.containerPx)} · {drag.heightPx}px tall
          {drag.limit && <small>{drag.limit}</small>}
        </div>
      )}
    </>
  );
}
