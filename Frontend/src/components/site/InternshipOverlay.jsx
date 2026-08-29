import { useState } from 'react';
import Overlay from '../common/Overlay';
import { internshipOpportunities } from '../../data/internshipOpportunities';
import { submitInternshipApplication } from '../../utils/contactApi';

const initialValues = { name: '', email: '', phone: '' };

export default function InternshipOverlay({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [status, setStatus] = useState('idle');

  function updateField(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const formData = new FormData();
      formData.append('position', selected.title);
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      if (resume) formData.append('resume', resume);
      if (coverLetter) formData.append('coverLetter', coverLetter);
      await submitInternshipApplication(formData);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (!selected) {
    return (
      <Overlay title="Internship opportunities" onClose={onClose}>
        <ul className="opportunity-list">
          {internshipOpportunities.map((opp) => (
            <li key={opp.id}>
              <button type="button" onClick={() => setSelected(opp)}>
                {opp.title}
              </button>
            </li>
          ))}
        </ul>
      </Overlay>
    );
  }

  if (status === 'success') {
    return (
      <Overlay title={selected.title} onClose={onClose}>
        <p className="form-status form-status-success">
          Thank you for your interest in {selected.title}. BFJ will get back to you as soon as we can.
        </p>
      </Overlay>
    );
  }

  return (
    <Overlay title={selected.title} onClose={onClose}>
      <p className="opportunity-description">{selected.description}</p>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Name</span>
          <input type="text" required value={values.name} onChange={updateField('name')} />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input type="email" required value={values.email} onChange={updateField('email')} />
        </label>
        <label className="form-field">
          <span>Phone</span>
          <input type="tel" value={values.phone} onChange={updateField('phone')} />
        </label>
        <label className="form-field">
          <span>Resume</span>
          <input type="file" required accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
        </label>
        <label className="form-field">
          <span>Cover letter</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCoverLetter(e.target.files[0])} />
        </label>
        <button type="submit" className="form-submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit application'}
        </button>
        {status === 'error' && (
          <p className="form-status form-status-error">
            Something went wrong. Please email us directly at{' '}
            <a href="mailto:info@boxingforjustice.org">info@boxingforjustice.org</a>.
          </p>
        )}
      </form>
    </Overlay>
  );
}
