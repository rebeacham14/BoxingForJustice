import { useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { updateBlock } from '../../utils/contentApi';

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
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  return (
    <>
      <Tag
        className={`${className || ''} bfj-editable${isEmpty ? ' bfj-editable-empty' : ''}`.trim()}
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
