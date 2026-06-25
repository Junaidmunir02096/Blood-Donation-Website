/**
 * src/services/request.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads blood requests from localStorage (ls_requests) — populated by AppDataContext.
 * Swap for real API calls when backend is ready.
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readRequests = () => {
  try {
    const raw = localStorage.getItem('ls_requests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Fetch the current user's blood requests (Active Requests dashboard tab) */
export const fetchRequests = async (userId) => {
  await delay(400);
  const all = readRequests();
  // If userId provided, return only that user's requests; otherwise return all
  if (userId) return all.filter((r) => r.userId === userId);
  return all;
};
