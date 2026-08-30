import { API_URL, getAuthHeaders } from './api';

export async function fetchNav() {
  const res = await fetch(`${API_URL}/api/nav`);

  if (!res.ok) {
    throw new Error('Could not load navigation.');
  }

  return res.json();
}

export async function fetchPage(slug) {
  const res = await fetch(`${API_URL}/api/pages/${slug}`);

  if (!res.ok) {
    throw new Error('Could not load page content.');
  }

  return res.json();
}

// getToken is Clerk's useAuth().getToken, threaded through from EditModeContext
// so this file never has to import a Clerk hook directly.
export async function updateBlock(getToken, slug, blockId, patch) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/pages/${slug}/blocks/${blockId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Couldn't save your change.");
  }

  return res.json();
}
