import { useState } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { usePageContent } from '../context/PageContentContext';
import { updateBlock } from '../utils/contentApi';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

// Resolves one image blockId to its current value (owner-uploaded, or
// `defaultValue` if nothing's been uploaded yet - same "never blank"
// fallback EditableText uses) and exposes an upload handler. Deliberately a
// hook, not a wrapping component: the 4 places this gets used render an
// image completely differently (a background div, a real <img>, an inline
// style on an existing <Link>), so the caller owns the markup and this just
// owns the data + save logic - mirrors FlipButtonBlock.jsx's existing
// upload handler, generalized to any blockId.
export default function useEditableImage(id, defaultValue = null) {
  const { isOwner, editMode, getToken } = useEditMode();
  const { slug, blocks, setBlockLocal } = usePageContent();
  const [error, setError] = useState('');

  const canEdit = isOwner && editMode;
  const image = blocks[id]?.content?.image || defaultValue;

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setError('That photo is too large, please choose one under 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result;

      try {
        await updateBlock(getToken, slug, id, { content: { image: dataUrl } });
        setBlockLocal(id, { content: { image: dataUrl } });
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };

    reader.readAsDataURL(file);
  }

  return { image, canEdit, error, handleFile };
}
