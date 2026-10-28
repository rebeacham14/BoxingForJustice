import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ContactFormBand from './ContactFormBand';
import EditableRegion from './EditableRegion';

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.slice(1);
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="bfj-site">
      <Header />
      <main>
        <Outlet />
      </main>
      {/* Shared by every page, so its text saves to the site-wide "site"
          content page rather than any one page. */}
      <EditableRegion slug="site">
        <ContactFormBand />
        <Footer />
      </EditableRegion>
    </div>
  );
}
