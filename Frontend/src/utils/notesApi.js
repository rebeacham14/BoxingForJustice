const NOTES_API_URL = import.meta.env.VITE_NOTES_API_URL;
const NOTES_API_KEY = import.meta.env.VITE_NOTES_API_KEY;

/**
 * Sends notes pages to the Sched notes-analyzer API and returns the parsed
 * per-page results (classification, objectives, important dates,
 * things-to-know, and website change suggestions).
 */
export async function analyzeNotes(pages) {
  if (!NOTES_API_URL) {
    throw new Error('VITE_NOTES_API_URL is not configured.');
  }

  const res = await fetch(NOTES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': NOTES_API_KEY ?? '',
    },
    body: JSON.stringify({ pages, focusArea: 'website' }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Notes analysis failed (${res.status})`);
  }

  return data.results;
}
