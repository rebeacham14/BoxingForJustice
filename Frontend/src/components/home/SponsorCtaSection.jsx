import SponsorBar from '../common/SponsorBar';

// TODO: replace with BFJ's real sponsorship/donation contact (or a donation
// platform link) before launch — these are placeholder addresses.
const SPONSOR_EMAIL = 'partnerships@boxingforjustice.org';
const DONATE_EMAIL = 'donate@boxingforjustice.org';

export default function SponsorCtaSection() {
  return (
    <section id="sponsor-cta" className="sponsor-cta-section">
      <h2>Fuel the Mission</h2>
      <p>
        Corporate sponsors, individual donors, and grant partners make our advocacy and youth
        programs possible. Join us in building safer, stronger communities.
      </p>

      <div className="sponsor-cta-actions">
        <a className="main-button" href={`mailto:${SPONSOR_EMAIL}`}>
          Become a Sponsor
        </a>
        <a className="secondary-button" href={`mailto:${DONATE_EMAIL}`}>
          Donate Now
        </a>
      </div>

      <SponsorBar />
    </section>
  );
}
