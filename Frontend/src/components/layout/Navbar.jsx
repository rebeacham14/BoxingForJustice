import { Link, NavLink } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <div className="navbar">
      <Link to="/mma-events" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src="/bfj-logo.png"
          alt="Boxing for Justice"
          style={{ height: 52, width: 52, borderRadius: '50%', objectFit: 'cover' }}
        />
        <h2 className="logo" style={{ margin: 0 }}>
          Boxing <span>for Justice</span>
        </h2>
      </Link>

      <div className="nav-links">
        <NavLink to="/mma-events" end>Home</NavLink>
        <NavLink to="/mma-events/resources">Resources</NavLink>
        <NavLink to="/mma-events/about">About</NavLink>
        <NavLink to="/mma-events/tickets">Events &amp; Tickets</NavLink>
        <NavLink to="/mma-events/enroll">Enroll</NavLink>

        <Link to="/mma-events#sponsor-cta" className="secondary-button" style={{ padding: '10px 20px', marginBottom: 0 }}>
          Support Us
        </Link>

        {!isSignedIn && <NavLink to="/mma-events/login">Login</NavLink>}
        {!isSignedIn && <NavLink to="/mma-events/register">Register</NavLink>}

        {isSignedIn && (
          <>
            <NavLink to="/mma-events/orders">Orders</NavLink>
            <NavLink to="/mma-events/account">Account</NavLink>
            <NavLink to="/mma-events/notes-analyzer">Notes Analyzer</NavLink>
            <UserButton />
          </>
        )}
      </div>
    </div>
  );
}
