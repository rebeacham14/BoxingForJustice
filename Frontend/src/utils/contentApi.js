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

// Bulk-creates a group of sibling blocks (e.g. a flip-button's 5 blocks) in
// one section, atomically.
export async function createBlocks(getToken, slug, sectionId, blocks) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/pages/${slug}/sections/${sectionId}/blocks`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Couldn't add that.");
  }

  return res.json();
}

// Bulk-deletes blocks by id, wherever they live on the page.
export async function deleteBlocks(getToken, slug, blockIds) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/pages/${slug}/blocks`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ blockIds }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Couldn't remove that.");
  }

  return res.json();
}

// Full new ordered list of a page's section ids (not a partial diff) - see
// Backend/routes/content.js's reorder route for why.
export async function reorderSections(getToken, slug, order) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/pages/${slug}/sections/reorder`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ order }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Couldn't reorder that.");
  }

  return res.json();
}

export async function setSectionSize(getToken, slug, sectionId, size) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/pages/${slug}/sections/${sectionId}/size`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ size }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Couldn't resize that.");
  }

  return res.json();
}

// Backs the plain-language "your images are taking up a lot of space"
// banner - the byte counts in the response are for the threshold check only
// and should never be shown to the owner directly.
export async function fetchStorageStats(getToken) {
  const headers = await getAuthHeaders(getToken);

  const res = await fetch(`${API_URL}/api/storage-stats`, { headers });

  if (!res.ok) {
    throw new Error('Could not load storage stats.');
  }

  return res.json();
}
