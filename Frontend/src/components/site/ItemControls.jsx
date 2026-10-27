// Small floating per-item control cluster (move earlier/later + remove),
// visual language matches EditableSection's controls. One list's owning
// page decides where to place it relative to that item's own markup, since
// the 13 lists this backs (cards, circles, flip-cards, accordion rows...)
// all lay out differently.
export default function ItemControls({ onMoveUp, onMoveDown, onRemove, isFirst, isLast, canRemove }) {
  return (
    <div className="bfj-item-controls" contentEditable={false}>
      <button
        type="button"
        className="bfj-section-controls-btn"
        onClick={onMoveUp}
        disabled={isFirst}
        aria-label="Move item earlier"
      >
        ↑
      </button>
      <button
        type="button"
        className="bfj-section-controls-btn"
        onClick={onMoveDown}
        disabled={isLast}
        aria-label="Move item later"
      >
        ↓
      </button>
      <button
        type="button"
        className="bfj-section-controls-btn"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
