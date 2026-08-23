import { Link } from 'react-router-dom';

export default function Header() {
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
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/about">About</Link>
          <Link to="/our-work">Our work</Link>
          <Link to="/impact">Impact</Link>
          <Link to="/get-involved">Get involved</Link>
          <Link to="/mma-events">MMA Events</Link>
        </nav>
        <a
          className="button button-small button-dark"
          href="https://www.boxingforjustice.org/donationatetoday"
        >
          Donate
        </a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link to="/about">About</Link>
            <Link to="/our-work">Our work</Link>
            <Link to="/impact">Impact</Link>
            <Link to="/get-involved">Get involved</Link>
            <Link to="/mma-events">MMA Events</Link>
            <a href="https://www.boxingforjustice.org/donationatetoday">Donate</a>
          </nav>
        </details>
      </header>
    </>
  );
}
