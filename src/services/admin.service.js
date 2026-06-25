/**
 * src/services/admin.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads all admin data from localStorage — populated by AppDataContext.
 * Swap for real API calls when backend is ready.
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Fetch all blood requests for admin review */
export const fetchAdminRequests = async () => {
  await delay(400);
  return readLS('ls_requests');
};

/** Fetch all registered donors for admin management */
export const fetchAdminDonors = async () => {
  await delay(400);
  return readLS('ls_donors');
};

/** Fetch all registered users for admin management */
export const fetchAdminUsers = async () => {
  await delay(400);
  return readLS('ls_users');
};
