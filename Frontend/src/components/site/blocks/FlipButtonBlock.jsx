import { useRef, useState } from 'react';
import Overlay from '../../common/Overlay';
import EditableText from '../EditableText';
import { useEditMode } from '../../../context/EditModeContext';
import { usePageContent } from '../../../context/PageContentContext';
import { updateBlock, deleteBlocks } from '../../../utils/contentApi';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

// One "flip button": a background-image button with a bold label that
// flips (pure CSS hover, reusing .flip-card's existing mechanic - see
// site.css) to a secondary caption, and opens a full-screen Overlay on
// click. Backed by 5 sibling blocks sharing the `groupId` prefix - see
// CustomBlocks.jsx for why (lets the 4 text fields reuse EditableText/the
// existing PATCH route unchanged).
export default function FlipButtonBlock({ groupId }) {
  const { isOwner, editMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal, removeBlocksLocal } = usePageContent();
  const [showOverlay, setShowOverlay] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  const canEdit = isOwner && editMode;
  const image = blocks[groupId]?.content?.image || null;
  const overlayTitle = blocks[`${groupId}.overlayTitle`]?.content?.value || 'New button';
  const overlayBody = blocks[`${groupId}.overlayBody`]?.content?.value || '';

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('That photo is too large, please choose one under 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result;

      try {
        await updateBlock(getToken, slug, groupId, { content: { image: dataUrl } });
        setBlockLocal(groupId, { content: { image: dataUrl } });
        setImageError('');
      } catch (error) {
        setImageError(error.message);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleRemove() {
    if (!window.confirm('Remove this button?')) return;

    const groupBlockIds = [
      groupId,
      `${groupId}.label`,
      `${groupId}.hoverLabel`,
      `${groupId}.overlayTitle`,
      `${groupId}.overlayBody`,
    ];

    try {
      await deleteBlocks(getToken, slug, groupBlockIds);
      removeBlocksLocal(groupBlockIds);
    } catch (error) {
      setImageError(error.message);
    }
  }

  const faceStyle = image
    ? { backgroundImage: `url(${image})` }
    : { backgroundColor: 'var(--color-gold)' };

  if (!canEdit) {
    return (
      <>
        {/* role="button" on a div, not a real <button> - matches FlipCard.jsx's
            approach, since .flip-card-inner/-front/-back rely on being block-level
            (div) children with an explicit width/height, which a real <button>
            can't contain per the HTML content model (phrasing content only). */}
        <div
          className="flip-button flip-card"
          tabIndex={0}
          role="button"
          onClick={() => setShowOverlay(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowOverlay(true);
            }
          }}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front flip-button-face" style={faceStyle}>
              <EditableText as="strong" id={`${groupId}.label`} defaultValue="New button" />
            </div>
            <div className="flip-card-back flip-button-face">
              <EditableText as="strong" id={`${groupId}.hoverLabel`} defaultValue="Learn more" />
            </div>
          </div>
        </div>
        {showOverlay && (
          <Overlay title={overlayTitle} onClose={() => setShowOverlay(false)}>
            <p>{overlayBody}</p>
          </Overlay>
        )}
      </>
    );
  }

  // Edit mode deliberately does NOT reuse .flip-card's absolute-stacked
  // front/back layout - that only ever shows one face at a time (the other
  // is hidden behind it until hovered), but she needs the label and hover
  // label editable at the same time. Both faces render in normal document
  // flow instead, one above the other; the hover-flip 3D effect is only
  // shown in view mode (hover the live site outside edit mode to see it).
  return (
    <div className="flip-button flip-button-editing">
      <div className="flip-button-controls">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Change image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFile}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={() => setShowOverlay(true)}>
          Preview
        </button>
        <button type="button" className="flip-button-remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
      {imageError && <p className="flip-button-error">{imageError}</p>}
      <div className="flip-button-edit-face" style={faceStyle}>
        <span className="flip-button-edit-face-label">Front label</span>
        <EditableText as="strong" id={`${groupId}.label`} defaultValue="New button" />
      </div>
      <div className="flip-button-edit-face flip-button-edit-face-alt">
        <span className="flip-button-edit-face-label">Label on hover</span>
        <EditableText as="strong" id={`${groupId}.hoverLabel`} defaultValue="Learn more" />
      </div>
      <div className="flip-button-overlay-fields">
        <label>
          Overlay title
          <EditableText as="span" id={`${groupId}.overlayTitle`} defaultValue="New button" />
        </label>
        <label>
          Overlay text
          <EditableText as="p" id={`${groupId}.overlayBody`} defaultValue="" />
        </label>
      </div>
      {showOverlay && (
        <Overlay title={overlayTitle} onClose={() => setShowOverlay(false)}>
          <p>{overlayBody}</p>
        </Overlay>
      )}
    </div>
  );
}
