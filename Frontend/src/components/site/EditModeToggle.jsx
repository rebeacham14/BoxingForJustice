import { useEditMode } from '../../context/EditModeContext';

// Owner-only. Hidden entirely for every other visitor, including signed-in
// non-owner accounts (e.g. /mma-events participants).
export default function EditModeToggle() {
  const { isOwner, editMode, setEditMode } = useEditMode();

  if (!isOwner) {
    return null;
  }

  return (
    <button
      type="button"
      className={`button button-small ${editMode ? 'button-red' : 'button-dark'}`}
      onClick={() => setEditMode(!editMode)}
    >
      {editMode ? 'Exit edit mode' : 'Edit mode'}
    </button>
  );
}
