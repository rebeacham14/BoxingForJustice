import { useState } from 'react';

export default function FlipCard({ front, back, className = '' }) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
  }

  return (
    <div
      className={`flip-card${flipped ? ' is-flipped' : ''}${className ? ` ${className}` : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
}
