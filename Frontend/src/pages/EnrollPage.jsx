import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SEO from '../components/common/SEO';
import { API_URL, getAuthHeaders } from '../utils/api';

export default function EnrollPage() {
  const [values, setValues] = useState({ name: '', age: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  function updateField(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/enroll`, {
        method: 'POST',
        headers: await getAuthHeaders(getToken),
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Enrollment failed.');
      }

      setStatus('success');
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <div className="page enroll-page">
      <SEO title="Enroll | Boxing for Justice" description="Enroll in a Boxing for Justice program." robots="noindex, nofollow" />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Enroll a <span>Participant</span>
          </h1>
          <p>Tell us a little about the participant and we&apos;ll follow up with next steps.</p>
          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>
      </section>

      <section className="checkout-section">
        <div className="checkout-summary">
          {status === 'success' ? (
            <p>Thanks — you&apos;re enrolled. BFJ will follow up soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" required value={values.name} onChange={updateField('name')} />
              </label>
              <label>
                Age
                <input type="number" min="1" required value={values.age} onChange={updateField('age')} />
              </label>
              <label>
                Email
                <input type="email" required value={values.email} onChange={updateField('email')} />
              </label>
              <button className="main-button" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Enroll'}
              </button>
              {error && <p className="checkout-error">{error}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
