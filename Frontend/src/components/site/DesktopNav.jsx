import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';

export default function DesktopNav() {
  const [openIndex, setOpenIndex] = useState(null);
  const closeTimer = useRef(null);

  function openMenu(index) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenIndex(index);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150);
  }

  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      {NAV_ITEMS.map((item, index) => (
        <div
          className="nav-item"
          key={item.label}
          onMouseEnter={() => item.submenu && openMenu(index)}
          onMouseLeave={() => item.submenu && scheduleClose()}
          onFocus={() => item.submenu && openMenu(index)}
          onBlur={(e) => {
            if (item.submenu && !e.currentTarget.contains(e.relatedTarget)) {
              setOpenIndex(null);
            }
          }}
        >
          <Link to={item.to}>{item.label}</Link>
          {item.submenu && (
            <div className={`nav-dropdown${openIndex === index ? ' nav-dropdown-open' : ''}`}>
              {item.submenu.map((sub) => (
                <Link key={sub.hash} to={`${item.to}#${sub.hash}`}>
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
