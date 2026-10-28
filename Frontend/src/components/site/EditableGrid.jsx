import { Children, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { updateBlock } from '../../utils/contentApi';

// Presets only, same "pick from the design system" rule as the text
// toolbar. The px values live here (not in Mongo), so they can be retuned
// without touching saved content. null = the grid's normal styling.
const GAP_VALUES = { none: '0px', sm: '12px', md: '24px', lg: '40px', xl: '64px' };
const BOX_VALUES = { sm: '160px', md: '230px', lg: '300px', xl: '380px' };

const GAP_OPTIONS = [
  { token: null, label: 'Auto', title: 'Site default' },
  { token: 'none', label: '0', title: 'No space between boxes' },
  { token: 'sm', label: 'S', title: 'Small' },
  { token: 'md', label: 'M', title: 'Medium' },
  { token: 'lg', label: 'L', title: 'Large' },
  { token: 'xl', label: 'XL', title: 'Extra large' },
];

const BOX_OPTIONS = [
  { token: null, label: 'Auto', title: 'Site default' },
  { token: 'sm', label: 'S', title: 'Short boxes' },
  { token: 'md', label: 'M', title: 'Medium boxes' },
  { token: 'lg', label: 'L', title: 'Tall boxes' },
  { token: 'xl', label: 'XL', title: 'Extra tall boxes' },
];

// A grid of boxed items (e.g. About's 3 pillars) whose spacing and box
// height the owner can set in edit mode. Saved as `content.gap` /
// `content.boxSize` on one block (`id`), like every other editor setting.
// Exactly 3 boxes also gets `bfj-grid-3`, which site.css uses to lay them
// out in a single row on desktop. The controls bar renders as a sibling
// ABOVE the grid (never inside it), so it can't become a grid item or shift
// the grid's :nth-child/:last-child rules.
export default function EditableGrid(props) {
  const { id, as: Tag = 'div', className, style, children, ...rest } = props;
  const { isOwner, editMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const [error, setError] = useState('');

  const canEdit = isOwner && editMode;
  const content = blocks[id]?.content || {};
  const gap = GAP_VALUES[content.gap] ? content.gap : null;
  const boxSize = BOX_VALUES[content.boxSize] ? content.boxSize : null;
  const count = Children.toArray(children).length;

  const gridClassName = [
    className,
    count === 3 && 'bfj-grid-3',
    gap && 'bfj-grid-gap',
    boxSize && 'bfj-grid-box',
  ].filter(Boolean).join(' ');

  const gridStyle = { ...style };
  if (gap) gridStyle['--bfj-grid-gap'] = GAP_VALUES[gap];
  if (boxSize) gridStyle['--bfj-box-min'] = BOX_VALUES[boxSize];

  async function apply(patch) {
    const previous = { gap, boxSize };

    setBlockLocal(id, { content: patch });

    try {
      await updateBlock(getToken, slug, id, { content: patch });
      setError('');
    } catch (err) {
      setBlockLocal(id, { content: previous });
      setError(err.message);
    }
  }

  return (
    <>
      {canEdit && (
        <div className="bfj-grid-controls" contentEditable={false}>
          <OptionGroup label="Spacing" options={GAP_OPTIONS} current={gap} onPick={(token) => apply({ gap: token })} />
          <OptionGroup label="Box size" options={BOX_OPTIONS} current={boxSize} onPick={(token) => apply({ boxSize: token })} />
          {error && <span className="bfj-section-error">{error}</span>}
        </div>
      )}
      <Tag {...rest} className={gridClassName} style={gridStyle}>
        {children}
      </Tag>
    </>
  );
}

function OptionGroup({ label, options, current, onPick }) {
  return (
    <div className="bfj-edit-toolbar-group">
      <span className="bfj-edit-toolbar-label">{label}</span>
      {options.map(({ token, label: optionLabel, title }) => (
        <button
          key={token ?? 'auto'}
          type="button"
          title={title}
          className={`bfj-edit-toolbar-btn${current === token ? ' bfj-edit-toolbar-btn-active' : ''}`}
          onClick={() => onPick(token)}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  );
}
