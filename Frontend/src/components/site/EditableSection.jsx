import { useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { usePageContent } from '../../context/PageContentContext';
import { reorderSections, setSectionSize } from '../../utils/contentApi';
import useSectionResize from '../../hooks/useSectionResize';
import ResizeHandles from './ResizeHandles';

const SIZE_OPTIONS = [
  { token: 'compact', label: 'S' },
  { token: 'default', label: 'M' },
  { token: 'tall', label: 'L' },
];

// Wraps one top-level page section so the owner can move it up/down among
// its siblings, pick a bounded height preset, and drag its edges to set its
// width and height (see useSectionResize.js), in edit mode. `sectionId`
// must match the Mongo section this content already belongs to (same id
// used as the 2nd dot-segment of that section's EditableText blockIds - see
// Backend/seedData/pages.seed.js). Mirrors EditableText's
// owner/editMode-gating and optimistic-update-then-PATCH structure.
export default function EditableSection(props) {
  const { sectionId, as: Tag = 'section', className, style, children, ...rest } = props;
  const { isOwner, editMode, gridMode, getToken } = useEditMode();
  const { slug, sections, reorderSectionsLocal, setSectionSizeLocal } = usePageContent();
  const [error, setError] = useState('');
  const {
    elementRef,
    width,
    height,
    savedWidth,
    savedHeight,
    isResizing,
    drag,
    error: resizeError,
    handleProps,
    resetWidth,
    resetHeight,
  } = useSectionResize(`${slug}.${sectionId}.layout`);

  const section = sections.find((s) => s.sectionId === sectionId);
  const order = section?.order ?? 0;
  const size = section?.size || 'default';
  const canEdit = isOwner && editMode;

  const sortedIds = [...sections]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => s.sectionId);
  const currentIndex = sortedIds.indexOf(sectionId);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === -1 || currentIndex === sortedIds.length - 1;

  async function move(direction) {
    const newIndex = currentIndex + direction;

    if (currentIndex === -1 || newIndex < 0 || newIndex >= sortedIds.length) {
      return;
    }

    const newOrder = [...sortedIds];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    reorderSectionsLocal(newOrder);

    try {
      await reorderSections(getToken, slug, newOrder);
      setError('');
    } catch (err) {
      setError(`${err.message} Refresh the page and try again.`);
    }
  }

  async function handleSizeChange(newSize) {
    setSectionSizeLocal(sectionId, newSize);

    try {
      await setSectionSize(getToken, slug, sectionId, newSize);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  const sectionClassName = [
    className,
    'bfj-editable-section',
    `bfj-section-size-${size}`,
    width != null && 'bfj-resizable',
    height != null && 'bfj-resizable-h',
    canEdit && 'bfj-resize-target',
    isResizing && 'bfj-resizing',
  ].filter(Boolean).join(' ');

  const sectionStyle = { ...style, order };
  if (width != null) {
    sectionStyle['--bfj-width'] = `${width}%`;
  }
  if (height != null) {
    sectionStyle['--bfj-min-height'] = `${height}px`;
  }

  return (
    <Tag
      {...rest}
      ref={elementRef}
      className={sectionClassName}
      style={sectionStyle}
      data-section-id={sectionId}
    >
      {children}
      {canEdit && (
        <ResizeHandles width={width} height={height} drag={drag} handleProps={handleProps} gridMode={gridMode} />
      )}
      {canEdit && (
        <div className="bfj-section-controls" contentEditable={false}>
          <button
            type="button"
            className="bfj-section-controls-btn"
            onClick={() => move(-1)}
            disabled={isFirst}
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            className="bfj-section-controls-btn"
            onClick={() => move(1)}
            disabled={isLast}
            aria-label="Move section down"
          >
            ↓
          </button>
          <div className="bfj-section-size-picker">
            {SIZE_OPTIONS.map(({ token, label }) => (
              <button
                key={token}
                type="button"
                className={`bfj-section-controls-btn${size === token ? ' bfj-section-controls-btn-active' : ''}`}
                aria-label={`Size: ${token}`}
                title={`Size: ${token}`}
                onClick={() => handleSizeChange(token)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="bfj-section-controls-btn"
            onClick={resetWidth}
            disabled={savedWidth == null}
            aria-label="Reset to full width"
            title="Reset to full width"
          >
            ↔
          </button>
          <button
            type="button"
            className="bfj-section-controls-btn"
            onClick={resetHeight}
            disabled={savedHeight == null}
            aria-label="Reset to normal height"
            title="Reset to normal height"
          >
            ↕
          </button>
          {(error || resizeError) && <span className="bfj-section-error">{error || resizeError}</span>}
        </div>
      )}
    </Tag>
  );
}
