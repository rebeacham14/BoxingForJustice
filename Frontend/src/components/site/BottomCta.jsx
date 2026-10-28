import { useState } from 'react';
import { Link } from 'react-router-dom';
import DonateOverlay from './DonateOverlay';
import EditableRegion from './EditableRegion';
import EditableText from './EditableText';
import Movable from './Movable';

// Same call-to-action on several pages, so its text is site-wide (one edit
// updates every page) - saved under the shared "site" content page.
export default function BottomCta() {
  return (
    <EditableRegion slug="site">
      <BottomCtaContent />
    </EditableRegion>
  );
}

function BottomCtaContent() {
  const [showDonate, setShowDonate] = useState(false);

  return (
    <section className="bottom-cta">
      <p className="eyebrow eyebrow-light">
        <Movable id="site.bottom-cta.eyebrow-tick" /> <EditableText id="site.bottom-cta.eyebrow" defaultValue="Stand in their corner" />
      </p>
      <h2>
        <EditableText id="site.bottom-cta.title-line1" defaultValue="Help turn pain" /><br />
        <EditableText id="site.bottom-cta.title-line2" defaultValue="into" />{' '}
        <strong><EditableText id="site.bottom-cta.title-accent" defaultValue="purpose." /></strong>
      </h2>
      <div className="button-row">
        <Link className="button button-red" to="/get-involved">
          <EditableText id="site.bottom-cta.cta-primary" defaultValue="Find your role" />
        </Link>
        <button type="button" className="text-link text-link-light" onClick={() => setShowDonate(true)}>
          <EditableText id="site.bottom-cta.cta-donate" defaultValue="Make a donation" /> <span aria-hidden="true">↗</span>
        </button>
      </div>
      {showDonate && <DonateOverlay onClose={() => setShowDonate(false)} />}
    </section>
  );
}
