import { useEditMode } from '../../context/EditModeContext';

// Owner-only. Hidden entirely for every other visitor, including signed-in
// non-owner accounts (e.g. /mma-events participants).
export default function EditModeToggle() {
  const { isOwner, editMode, setEditMode, gridMode, setGridMode } = useEditMode();

  if (!isOwner) {
    return null;
  }

  return (
    <div className="bfj-edit-mode-buttons">
      {editMode && (
        <button
          type="button"
          className={`button button-small ${gridMode ? 'button-gold' : 'button-outline-light'}`}
          aria-pressed={gridMode}
          title="When on, dragging a section's edges snaps its width to a 12-column grid"
          onClick={() => setGridMode(!gridMode)}
        >
          Grid {gridMode ? 'on' : 'off'}
        </button>
      )}
      <button
        type="button"
        className={`button button-small ${editMode ? 'button-red' : 'button-dark'}`}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? 'Exit edit mode' : 'Edit mode'}
      </button>
    </div>
  );
}
