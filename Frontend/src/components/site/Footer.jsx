import { Link } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import useNavItems from '../../hooks/useNavItems';
import { useEditMode } from '../../context/EditModeContext';
import { isClerkConfigured } from '../../utils/clerkConfig';
import EditableText from './EditableText';

export default function Footer() {
  const navItems = useNavItems();
  const { isSignedIn } = useEditMode();

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img className="brand-logo brand-logo-footer" src="/bfj-logo.png" alt="" aria-hidden="true" />
        <div>
          <strong><EditableText id="site.footer.brand" defaultValue="Boxing For Justice" /></strong>
          <p><EditableText id="site.footer.tagline" defaultValue="Restoring power. Igniting resilience. Building leaders." /></p>
        </div>
      </div>
      <div className="footer-location">
        <strong><EditableText id="site.footer.location-label" defaultValue="Service area" /></strong>
        <p><EditableText id="site.footer.location" defaultValue="Riverside County, California" /></p>
      </div>
      <div className="footer-contact">
        <strong><EditableText id="site.footer.contact-label" defaultValue="Start a conversation" /></strong>
        <p><a href="mailto:info@boxingforjustice.org">info@boxingforjustice.org</a></p>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
      <p className="footer-legal">
        © {new Date().getFullYear()}{' '}
        <EditableText id="site.footer.legal" defaultValue="Boxing For Justice. IRS-recognized 501(c)(3). EIN 99-3175496." />
        {isClerkConfigured && !isSignedIn && (
          <SignInButton mode="modal">
            <button type="button" className="footer-owner-signin">Site owner sign in</button>
          </SignInButton>
        )}
      </p>
    </footer>
  );
}
