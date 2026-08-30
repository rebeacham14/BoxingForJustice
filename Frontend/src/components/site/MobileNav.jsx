import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useNavItems from '../../hooks/useNavItems';

export default function MobileNav({ onDonateClick }) {
  const navItems = useNavItems();
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleOutsideClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setExpandedIndex(null);
  }

  return (
    <div className="mobile-menu" ref={rootRef}>
      <button
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <div className="mobile-nav-item" key={item.label}>
              <div className="mobile-nav-row">
                <Link to={item.to} onClick={closeMenu}>
                  {item.label}
                </Link>
                {item.submenu && (
                  <button
                    type="button"
                    className="mobile-nav-toggle"
                    aria-label={`Toggle ${item.label} submenu`}
                    aria-expanded={expandedIndex === index}
                    onClick={() => setExpandedIndex((cur) => (cur === index ? null : index))}
                  >
                    {expandedIndex === index ? '−' : '+'}
                  </button>
                )}
              </div>
              {item.submenu && expandedIndex === index && (
                <div className="mobile-nav-submenu">
                  {item.submenu.map((sub) => (
                    <Link key={sub.hash} to={`${item.to}#${sub.hash}`} onClick={closeMenu}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mobile-nav-donate"
            onClick={() => {
              closeMenu();
              onDonateClick?.();
            }}
          >
            Donate
          </button>
        </nav>
      )}
    </div>
  );
}
