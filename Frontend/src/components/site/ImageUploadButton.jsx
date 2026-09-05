import { useRef } from 'react';

// Small shared "Change image" control - a file-input trigger + error
// message, styled to match EditableSection's floating controls. Placed by
// the caller whereever makes sense for that image's layout (see
// useEditableImage.js for why this isn't a single wrapping component).
export default function ImageUploadButton({ onFile, error, label = 'Change image' }) {
  const fileInputRef = useRef(null);

  return (
    <div className="bfj-image-upload" contentEditable={false}>
      <button
        type="button"
        className="bfj-section-controls-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        style={{ display: 'none' }}
      />
      {error && <span className="bfj-section-error">{error}</span>}
    </div>
  );
}
