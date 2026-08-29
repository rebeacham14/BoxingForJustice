import { useEffect } from 'react';

export default function Overlay({ title, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overlay-header">
          <h3>{title}</h3>
          <button type="button" className="overlay-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="overlay-body">{children}</div>
      </div>
    </div>
  );
}
