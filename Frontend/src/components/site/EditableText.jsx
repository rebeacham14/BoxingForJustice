import { useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { updateBlock } from '../../utils/contentApi';
import { offsetStyle, readOffset } from '../../utils/moveOffset';

const FONT_SIZE_VAR = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  base: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  display: 'var(--font-size-display)',
};

const COLOR_VAR = {
  white: 'var(--color-white)',
  gold: 'var(--color-gold)',
  'body-text': 'var(--color-body-text)',
  'text-muted': 'var(--color-text-muted)',
  danger: 'var(--color-danger)',
};

const SPACE_VAR = {
  none: 'var(--space-none)',
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
};

const LINE_HEIGHT_VAR = {
  tight: 'var(--line-height-tight)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
  loose: 'var(--line-height-loose)',
};

// A single editable text node. `id` is a stable block id
// (`<pageSlug>.<sectionId>.<field>`) that must match a seeded block for
// persistence to work; if the backend has nothing for it yet, `defaultValue`
// is shown instead so the page never blanks out.
export default function EditableText({ id, as: Tag = 'span', defaultValue = '', className }) {
  const { isOwner, editMode, setActiveBlockId, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const [pendingValue, setPendingValue] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | error

  const block = blocks[id];
  const value = pendingValue ?? block?.content?.value ?? defaultValue;
  const isEmpty = !value;

  const style = {};
  if (block?.style?.fontSize && FONT_SIZE_VAR[block.style.fontSize]) {
    style.fontSize = FONT_SIZE_VAR[block.style.fontSize];
  }
  if (block?.style?.color && COLOR_VAR[block.style.color]) {
    style.color = COLOR_VAR[block.style.color];
  }
  if (block?.style?.spaceAbove && SPACE_VAR[block.style.spaceAbove]) {
    style.marginTop = SPACE_VAR[block.style.spaceAbove];
  }
  if (block?.style?.spaceBelow && SPACE_VAR[block.style.spaceBelow]) {
    style.marginBottom = SPACE_VAR[block.style.spaceBelow];
  }
  if (block?.style?.lineHeight && LINE_HEIGHT_VAR[block.style.lineHeight]) {
    style.lineHeight = LINE_HEIGHT_VAR[block.style.lineHeight];
  }
  // Vertical margins and a smaller line-height do nothing on a plain inline
  // <span> (most blocks render as one, inside the page's own <p>/<h2>), so
  // any spacing choice turns the span into an inline-block. Blocks with no
  // spacing set keep rendering exactly as before.
  const hasSpacing = style.marginTop || style.marginBottom || style.lineHeight;
  if (hasSpacing && Tag === 'span') {
    style.display = 'inline-block';
  }
  // Owner's drag-to-move offset (MoveHandle.jsx), stored next to `value`.
  const offset = readOffset(block?.content?.offset);
  Object.assign(style, offsetStyle(offset));
  const movedClass = offset ? ' bfj-moved' : '';

  const canEdit = isOwner && editMode;

  async function saveValue(newValue) {
    setSaveState('saving');

    try {
      await updateBlock(getToken, slug, id, { content: { value: newValue } });
      setBlockLocal(id, { content: { value: newValue } });
      setPendingValue(null);
      setSaveState('idle');
    } catch (error) {
      console.error(`Could not save block ${id}:`, error.message);
      setSaveState('error');
    }
  }

  function handleBlur(e) {
    const newValue = e.currentTarget.textContent;

    if (newValue !== value) {
      setPendingValue(newValue);
      saveValue(newValue);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && Tag !== 'p') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  function handleRetry() {
    if (pendingValue != null) {
      saveValue(pendingValue);
    }
  }

  if (!canEdit) {
    if (isEmpty) {
      return null;
    }

    return (
      <Tag className={`${className || ''}${movedClass}`.trim() || undefined} style={style}>
        {value}
      </Tag>
    );
  }

  return (
    <>
      <Tag
        className={`${className || ''} bfj-editable${isEmpty ? ' bfj-editable-empty' : ''}${movedClass}`.trim()}
        style={style}
        contentEditable
        suppressContentEditableWarning
        data-block-id={id}
        onFocus={() => setActiveBlockId(id)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {isEmpty ? 'Click to add text' : value}
      </Tag>
      {saveState === 'error' && (
        <button type="button" className="bfj-editable-retry" onClick={handleRetry}>
          Couldn&apos;t save — Retry
        </button>
      )}
    </>
  );
}
