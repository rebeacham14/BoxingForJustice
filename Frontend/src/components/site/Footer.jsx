import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';

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
        <p><a href="mailto:info@boxingforjustice.org">info@boxingforjustice.org</a></p>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
      <p className="footer-legal">
        © {new Date().getFullYear()} Boxing For Justice. IRS-recognized 501(c)(3). EIN 99-3175496.
      </p>
    </footer>
  );
}
