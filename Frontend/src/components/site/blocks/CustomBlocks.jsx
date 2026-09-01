import { useEffect, useState } from 'react';
import FlipButtonBlock from './FlipButtonBlock';
import { useEditMode } from '../../../context/EditModeContext';
import { usePageContent } from '../../../context/PageContentContext';
import { createBlocks, fetchStorageStats } from '../../../utils/contentApi';

// Renders the owner-addable block library for one section (currently just
// the flip-button block type - see FlipButtonBlock.jsx) plus, in edit mode,
// the "+ Add flip button" control and a storage warning banner. Placed once
// per site page (see e.g. HomePage.jsx) with sectionId="custom".
export default function CustomBlocks({ sectionId }) {
  const { isOwner, editMode, getToken } = useEditMode();
  const { slug, sections, addBlocksLocal } = usePageContent();
  const [isOverStorageThreshold, setIsOverStorageThreshold] = useState(false);
  const [addError, setAddError] = useState('');

  const canEdit = isOwner && editMode;

  useEffect(() => {
    if (!canEdit) return;

    fetchStorageStats(getToken)
      .then((stats) => setIsOverStorageThreshold(stats.isOverThreshold))
      .catch(() => {
        // Silent - this is an informational banner, not core functionality.
      });
  }, [canEdit, getToken]);

  const section = sections.find((s) => s.sectionId === sectionId);
  const groupIds = (section?.blocks || [])
    .filter((block) => block.type === 'button-flip')
    .map((block) => block.blockId);

  if (groupIds.length === 0 && !canEdit) {
    return null;
  }

  async function handleAddFlipButton() {
    const groupId = crypto.randomUUID();

    const newBlocks = [
      { blockId: groupId, type: 'button-flip', content: { image: null } },
      { blockId: `${groupId}.label`, type: 'text', content: { value: 'New button' } },
      { blockId: `${groupId}.hoverLabel`, type: 'text', content: { value: 'Learn more' } },
      { blockId: `${groupId}.overlayTitle`, type: 'text', content: { value: 'New button' } },
      { blockId: `${groupId}.overlayBody`, type: 'text', content: { value: '' } },
    ];

    try {
      await createBlocks(getToken, slug, sectionId, newBlocks);
      addBlocksLocal(sectionId, newBlocks);
      setAddError('');
    } catch (error) {
      setAddError(error.message);
    }
  }

  return (
    <section className="custom-blocks">
      {canEdit && isOverStorageThreshold && (
        <p className="custom-blocks-storage-warning">
          Your site&apos;s images are taking up a lot of space. Let your developer know so they can look into more storage.
        </p>
      )}
      {groupIds.length > 0 && (
        <div className="custom-blocks-grid">
          {groupIds.map((groupId) => (
            <FlipButtonBlock key={groupId} groupId={groupId} />
          ))}
        </div>
      )}
      {canEdit && (
        <>
          <button type="button" className="custom-blocks-add" onClick={handleAddFlipButton}>
            + Add flip button
          </button>
          {addError && <p className="flip-button-error">{addError}</p>}
        </>
      )}
    </section>
  );
}
