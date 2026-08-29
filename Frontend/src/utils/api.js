export const API_URL = 'https://boxforjuice.onrender.com';

// Clerk tokens are short-lived and fetched async via `getToken()` from
// Clerk's useAuth() hook - callers must pass that function in (it can't be
// imported statically the way the old localStorage-based token could).
export async function getAuthHeaders(getToken) {
  const token = await getToken();

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
