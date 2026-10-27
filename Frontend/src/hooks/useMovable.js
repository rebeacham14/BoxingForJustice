import { useEditMode } from '../context/EditModeContext';
import { usePageContent } from '../context/PageContentContext';
import { offsetStyle, readOffset } from '../utils/moveOffset';

// Makes a non-text element (e.g. a photo) selectable and movable in edit
// mode. EditableText handles its own offset; this is for everything else.
// The caller merges the returned className/style into its own and spreads
// `props` onto the same element - same "caller owns the markup" split as
// useEditableImage.js. `id` is the element's existing block id (for photos,
// the same id passed to useEditableImage).
export default function useMovable(id) {
  const { isOwner, editMode, setActiveBlockId } = useEditMode();
  const { blocks } = usePageContent();

  const canEdit = isOwner && editMode;
  const offset = readOffset(blocks[id]?.content?.offset);

  function handleClick(e) {
    // A click on editable text or a control inside this element selects
    // that instead (e.g. the hero photo's caption, or "Change image").
    if (e.target.closest('[contenteditable="true"], button, input, a')) return;
    setActiveBlockId(id, 'element');
  }

  return {
    className: [offset && 'bfj-moved', canEdit && 'bfj-movable'].filter(Boolean).join(' '),
    style: offsetStyle(offset),
    props: canEdit ? { 'data-block-id': id, onClick: handleClick } : {},
  };
}
