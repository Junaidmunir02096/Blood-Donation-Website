/**
 * src/services/donation.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads donation records from localStorage (ls_donations) — populated by AppDataContext.
 * Swap for real API calls when backend is ready.
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readDonations = () => {
  try {
    const raw = localStorage.getItem('ls_donations');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Fetch the current user's donation history records */
export const fetchDonations = async (userId) => {
  await delay(400);
  const all = readDonations();
  // If userId provided, return only that user's donations; otherwise return all (seed data)
  if (userId) return all.filter((d) => d.userId === userId || d.userId === 'seed');
  return all;
};
