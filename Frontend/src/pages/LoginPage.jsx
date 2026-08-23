import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          login(data.user, data.token);

          alert('Logged in successfully!');

          const redirectTo = location.state?.from?.pathname ?? '/mma-events/orders';
          navigate(redirectTo, { replace: true });
        } else {
          alert(data.message || 'Login failed.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Something went wrong while logging in.');
      });
  }

  return (
    <div className="page login-page">
      <section className="auth-box">
        <h1>
          Login to <span>Boxing for Justice</span>
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="main-button" type="submit">
            Login
          </button>
        </form>

        <p>
          Do not have an account? <Link to="/mma-events/register" className="text-button">Register</Link>
        </p>
      </section>
    </div>
  );
}
