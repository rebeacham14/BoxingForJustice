import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

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
        <NavLink to="/mma-events/veteran-support">Veteran Support</NavLink>
        <NavLink to="/mma-events/about">About</NavLink>
        <NavLink to="/mma-events/tickets">Events &amp; Tickets</NavLink>

        <Link to="/mma-events#sponsor-cta" className="secondary-button" style={{ padding: '10px 20px', marginBottom: 0 }}>
          Support Us
        </Link>

        {!user && <NavLink to="/mma-events/login">Login</NavLink>}
        {!user && <NavLink to="/mma-events/register">Register</NavLink>}

        {user && (
          <>
            <NavLink to="/mma-events/orders">Orders</NavLink>
            <span className="user-name">Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
