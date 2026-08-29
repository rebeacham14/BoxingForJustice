import { useState } from 'react';
import { Link } from 'react-router-dom';
import DonateOverlay from './DonateOverlay';

export default function BottomCta() {
  const [showDonate, setShowDonate] = useState(false);

  return (
    <section className="bottom-cta">
      <p className="eyebrow eyebrow-light"><span /> Stand in their corner</p>
      <h2>Help turn pain<br />into <strong>purpose.</strong></h2>
      <div className="button-row">
        <Link className="button button-red" to="/get-involved">Find your role</Link>
        <button type="button" className="text-link text-link-light" onClick={() => setShowDonate(true)}>
          Make a donation <span aria-hidden="true">↗</span>
        </button>
      </div>
      {showDonate && <DonateOverlay onClose={() => setShowDonate(false)} />}
    </section>
  );
}
