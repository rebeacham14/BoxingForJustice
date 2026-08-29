import { useState } from 'react';
import { Link } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import DonateOverlay from './DonateOverlay';

export default function Header() {
  const [showDonate, setShowDonate] = useState(false);

  return (
    <>
      <div className="announcement">
        <span>Serving Riverside County, California</span>
        <Link to="/get-involved">
          Partner with us <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Boxing For Justice home">
          <span className="brand-mark" aria-hidden="true">BFJ</span>
          <span className="brand-name">Boxing <em>For</em> Justice</span>
        </Link>
        <DesktopNav />
        <button
          type="button"
          className="button button-small button-dark"
          onClick={() => setShowDonate(true)}
        >
          Donate
        </button>
        <MobileNav onDonateClick={() => setShowDonate(true)} />
      </header>
      {showDonate && <DonateOverlay onClose={() => setShowDonate(false)} />}
    </>
  );
}
