import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-mark brand-mark-footer" aria-hidden="true">BFJ</span>
        <div>
          <strong>Boxing For Justice</strong>
          <p>Restoring power. Igniting resilience. Building leaders.</p>
        </div>
      </div>
      <div className="footer-location">
        <strong>Service area</strong>
        <p>Riverside County, California</p>
      </div>
      <div className="footer-contact">
        <strong>Start a conversation</strong>
        <p><a href="mailto:boxingforjustice@gmail.com">boxingforjustice@gmail.com</a></p>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/our-work">Our work</Link>
        <Link to="/impact">Impact</Link>
        <Link to="/get-involved">Get involved</Link>
        <Link to="/mma-events">MMA Events</Link>
      </nav>
      <p className="footer-legal">
        © {new Date().getFullYear()} Boxing For Justice. IRS-recognized 501(c)(3). EIN 99-3175496.
      </p>
    </footer>
  );
}
