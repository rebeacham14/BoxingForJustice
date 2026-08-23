import { Link } from 'react-router-dom';

export default function BottomCta() {
  return (
    <section className="bottom-cta">
      <p className="eyebrow eyebrow-light"><span /> Stand in their corner</p>
      <h2>Help turn pain<br />into <strong>purpose.</strong></h2>
      <div className="button-row">
        <Link className="button button-red" to="/get-involved">Find your role</Link>
        <a className="text-link text-link-light" href="https://www.boxingforjustice.org/donationatetoday">
          Make a donation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
