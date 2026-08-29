import { useState } from 'react';
import { submitContact } from '../../utils/contactApi';

const initialValues = { name: '', email: '', org: '', phone: '', comment: '' };

export default function ContactForm({ type, showOrg = false, submitLabel = 'Send', onSuccess }) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState('idle');

  function updateField(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitContact({ type, ...values });
      setStatus('success');
      setValues(initialValues);
      onSuccess?.();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="form-status form-status-success">
        Thanks — an associate from BFJ will get back to you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Name</span>
        <input type="text" required value={values.name} onChange={updateField('name')} />
      </label>
      <label className="form-field">
        <span>Email</span>
        <input type="email" required value={values.email} onChange={updateField('email')} />
      </label>
      {showOrg && (
        <label className="form-field">
          <span>Organization</span>
          <input type="text" value={values.org} onChange={updateField('org')} />
        </label>
      )}
      <label className="form-field">
        <span>Phone</span>
        <input type="tel" value={values.phone} onChange={updateField('phone')} />
      </label>
      <label className="form-field">
        <span>Comment</span>
        <textarea rows={4} value={values.comment} onChange={updateField('comment')} />
      </label>
      <button type="submit" className="form-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : submitLabel}
      </button>
      {status === 'error' && (
        <p className="form-status form-status-error">
          Something went wrong. Please email us directly at{' '}
          <a href="mailto:info@boxingforjustice.org">info@boxingforjustice.org</a>.
        </p>
      )}
    </form>
  );
}
