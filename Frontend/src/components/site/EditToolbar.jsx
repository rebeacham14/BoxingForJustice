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
  { token: 'navy', label: 'Navy', swatch: 'var(--ink)' },
  { token: 'body-text', label: 'Body', swatch: 'var(--color-body-text)' },
  { token: 'text-muted', label: 'Muted', swatch: 'var(--color-text-muted)' },
  { token: 'danger', label: 'Danger', swatch: 'var(--color-danger)' },
];

// `null` = "Auto": clears the override so the site's normal styling for
// that spot applies again.
const SPACE_OPTIONS = [
  { token: null, label: 'Auto', title: 'Site default' },
  { token: 'none', label: '0', title: 'No space' },
  { token: 'xs', label: 'XS', title: 'Extra small' },
  { token: 'sm', label: 'S', title: 'Small' },
  { token: 'md', label: 'M', title: 'Medium' },
  { token: 'lg', label: 'L', title: 'Large' },
  { token: 'xl', label: 'XL', title: 'Extra large' },
];

const ALIGN_OPTIONS = [
  { token: null, label: 'Auto', title: 'Site default' },
  { token: 'left', label: '⇤', title: 'Align left' },
  { token: 'center', label: '↔', title: 'Center' },
  { token: 'right', label: '⇥', title: 'Align right' },
  { token: 'justify', label: '☰', title: 'Justify (stretch lines to both edges)' },
];

const LINE_HEIGHT_OPTIONS = [
  { token: null, label: 'Auto', title: 'Site default' },
  { token: 'tight', label: 'Tight', title: 'Tight line spacing' },
  { token: 'normal', label: 'Normal', title: 'Normal line spacing' },
  { token: 'relaxed', label: 'Relaxed', title: 'Relaxed line spacing' },
  { token: 'loose', label: 'Loose', title: 'Loose line spacing' },
];

// Floating format bar shown while a block is focused in edit mode. Lives
// inside EditablePage (see EditablePage.jsx) so it shares that page's
// PageContentContext.
export default function EditToolbar() {
  const { isOwner, editMode, activeBlockId, activeBlockKind, activeBlockRegion } = useEditMode();
  const { regionId, blocks } = usePageContent();

  // Photos etc. can be selected (to move them) but have no text to format.
  // A block from another content region (e.g. site-wide footer text while
  // this is a page's toolbar) belongs to that region's own toolbar.
  if (!isOwner || !editMode || !activeBlockId || activeBlockKind !== 'text' || activeBlockRegion !== regionId) {
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
      <TokenGroup label="Above" field="spaceAbove" options={SPACE_OPTIONS} block={block} onApply={applyStyle} />
      <TokenGroup label="Below" field="spaceBelow" options={SPACE_OPTIONS} block={block} onApply={applyStyle} />
      <TokenGroup label="Lines" field="lineHeight" options={LINE_HEIGHT_OPTIONS} block={block} onApply={applyStyle} />
      <TokenGroup label="Align" field="textAlign" options={ALIGN_OPTIONS} block={block} onApply={applyStyle} />
    </div>
  );
}

function TokenGroup({ label, field, options, block, onApply }) {
  const current = block?.style?.[field] || null;

  return (
    <div className="bfj-edit-toolbar-group">
      <span className="bfj-edit-toolbar-label">{label}</span>
      {options.map(({ token, label: optionLabel, title }) => (
        <button
          key={token ?? 'auto'}
          type="button"
          title={title}
          className={`bfj-edit-toolbar-btn${current === token ? ' bfj-edit-toolbar-btn-active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onApply({ [field]: token })}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  );
}
