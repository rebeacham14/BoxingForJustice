import { useState } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { usePageContent } from '../context/PageContentContext';
import { updateBlock } from '../utils/contentApi';

// Lets the owner add/remove/reorder items inside a section (e.g. the home
// page's 3 focus-area cards) without a backend change beyond Phase 4's
// auto-create-on-save: item order/existence lives as `content.itemIds` on
// one ordinary block (id = `listId`), the same generic PATCH route every
// other block already uses. Adding an item just appends a new id - its
// per-field text blocks (e.g. `${listId}.${newId}.title`) don't need to be
// pre-created; they're auto-created the first time the owner types into
// them (Phase 4), same as any other new EditableText usage. Removing an
// item only drops its id from this array - its now-orphaned text blocks
// stay in Mongo, harmless, matching the plan's stated trade-off.
//
// `defaultItemIds` should match the page's original hardcoded array
// (e.g. ['0','1','2'] for a 3-item list) so nothing changes until the
// owner's first add/remove/reorder - same fallback philosophy as every
// other Phase 1-5 feature in this codebase.
export default function useEditableItemList({ listId, defaultItemIds }) {
  const { isOwner, editMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const [error, setError] = useState('');

  const canEdit = isOwner && editMode;
  const itemIds = blocks[listId]?.content?.itemIds || defaultItemIds;

  async function persist(newItemIds) {
    setBlockLocal(listId, { content: { itemIds: newItemIds } });

    try {
      await updateBlock(getToken, slug, listId, { content: { itemIds: newItemIds } });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function addItem() {
    const newId = crypto.randomUUID().slice(0, 8);
    return persist([...itemIds, newId]);
  }

  function removeItem(itemId) {
    if (itemIds.length <= 1) {
      // Never allow the last item to be removed - a section with a list but
      // zero items in it would break every one of these layouts.
      return Promise.resolve();
    }

    return persist(itemIds.filter((id) => id !== itemId));
  }

  function moveItem(itemId, direction) {
    const index = itemIds.indexOf(itemId);
    const newIndex = index + direction;

    if (index === -1 || newIndex < 0 || newIndex >= itemIds.length) {
      return Promise.resolve();
    }

    const newItemIds = [...itemIds];
    [newItemIds[index], newItemIds[newIndex]] = [newItemIds[newIndex], newItemIds[index]];

    return persist(newItemIds);
  }

  return { itemIds, canEdit, error, addItem, removeItem, moveItem };
}
