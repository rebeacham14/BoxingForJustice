import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { updateBlock } from '../../utils/contentApi';

const FONT_SIZE_OPTIONS = [
  { token: 'xs', label: 'XS' },
  { token: 'sm', label: 'S' },
  { token: 'base', label: 'M' },
  { token: 'lg', label: 'L' },
  { token: 'xl', label: 'XL' },
  { token: '2xl', label: 'XXL' },
  { token: 'display', label: 'Display' },
];

const COLOR_OPTIONS = [
  { token: 'white', label: 'White', swatch: 'var(--color-white)' },
  { token: 'gold', label: 'Gold', swatch: 'var(--color-gold)' },
  { token: 'body-text', label: 'Body', swatch: 'var(--color-body-text)' },
  { token: 'text-muted', label: 'Muted', swatch: 'var(--color-text-muted)' },
  { token: 'danger', label: 'Danger', swatch: 'var(--color-danger)' },
];

// Floating format bar shown while a block is focused in edit mode. Lives
// inside EditablePage (see EditablePage.jsx) so it shares that page's
// PageContentContext.
export default function EditToolbar() {
  const { isOwner, editMode, activeBlockId } = useEditMode();
  const { blocks } = usePageContent();

  if (!isOwner || !editMode || !activeBlockId) {
    return null;
  }

  return <EditToolbarControls activeBlockId={activeBlockId} block={blocks[activeBlockId]} />;
}

function EditToolbarControls({ activeBlockId, block }) {
  const { getToken } = useEditMode();
  const { slug, setBlockLocal } = usePageContent();
  const currentFontSize = block?.style?.fontSize || null;
  const currentColor = block?.style?.color || null;

  async function applyStyle(styleChange) {
    try {
      await updateBlock(getToken, slug, activeBlockId, { style: styleChange });
      setBlockLocal(activeBlockId, { style: styleChange });
    } catch (error) {
      console.error('Could not save style change:', error.message);
    }
  }

  return (
    <div className="bfj-edit-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="bfj-edit-toolbar-group">
        <span className="bfj-edit-toolbar-label">Size</span>
        {FONT_SIZE_OPTIONS.map(({ token, label }) => (
          <button
            key={token}
            type="button"
            className={`bfj-edit-toolbar-btn${currentFontSize === token ? ' bfj-edit-toolbar-btn-active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyStyle({ fontSize: token })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="bfj-edit-toolbar-group">
        <span className="bfj-edit-toolbar-label">Color</span>
        {COLOR_OPTIONS.map(({ token, label, swatch }) => (
          <button
            key={token}
            type="button"
            aria-label={label}
            title={label}
            className={`bfj-edit-toolbar-swatch${currentColor === token ? ' bfj-edit-toolbar-swatch-active' : ''}`}
            style={{ backgroundColor: swatch }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyStyle({ color: token })}
          />
        ))}
      </div>
    </div>
  );
}
