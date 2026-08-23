import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Registered successfully!');

        if (data.message === 'User registered successfully') {
          setUsername('');
          setEmail('');
          setPassword('');
          navigate('/mma-events/login');
        }
      })
      .catch((error) => {
        console.error('Register error:', error);
        alert('Something went wrong while registering.');
      });
  }

  return (
    <div className="page register-page">
      <section className="auth-box">
        <h1>
          Create an <span>Account</span>
        </h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
            Register
          </button>
        </form>

        <p>
          Already have an account? <Link to="/mma-events/login" className="text-button">Login</Link>
        </p>
      </section>
    </div>
  );
}
