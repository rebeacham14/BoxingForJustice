import { useState } from 'react';

export default function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordion-item${open ? ' accordion-item-open' : ''}`}>
      <button
        type="button"
        className="accordion-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span className="accordion-icon" aria-hidden="true">{open ? '×' : '+'}</span>
      </button>
      <div className="accordion-panel">
        <div className="accordion-panel-inner">{children}</div>
      </div>
    </div>
  );
}
