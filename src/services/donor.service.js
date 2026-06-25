/**
 * src/services/donor.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads donors from localStorage (ls_donors) — populated by AppDataContext.
 * Swap for real API calls when backend is ready.
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readDonors = () => {
  try {
    const raw = localStorage.getItem('ls_donors');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Fetch all registered donors (Search Blood page) */
export const fetchDonors = async () => {
  await delay(400);
  return readDonors();
};

/** Fetch a single donor by ID */
export const fetchDonorById = async (id) => {
  await delay(600);
  const donors = readDonors();
  return donors.find((d) => String(d.id) === String(id)) ?? null;
};
