import { API_URL } from './api';

// These hit new Backend routes (POST /api/contact, /api/internship-apply,
// /api/donate) that are being added alongside the Mandrill email rewrite -
// see the plan's backend milestone. Until that lands, submissions here will
// 404 against the deployed API; callers should show a friendly fallback
// rather than a raw error.

export async function submitContact({ type, ...fields }) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...fields }),
  });
  if (!res.ok) {
    throw new Error('Could not send your message right now.');
  }
  return res.json();
}

export async function submitInternshipApplication(formData) {
  const res = await fetch(`${API_URL}/api/internship-apply`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Could not submit your application right now.');
  }
  return res.json();
}

export async function submitDonation(payload) {
  const res = await fetch(`${API_URL}/api/donate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Could not process your donation right now.');
  }
  return res.json();
}
