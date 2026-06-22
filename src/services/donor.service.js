/**
 * src/services/donor.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Donor-related API calls.
 * Swap `simulateApi(...)` for `apiClient.get(...)` when the backend is ready.
 */

import { simulateApi } from '../api/apiSimulator';
import { donorsData } from '../data/donors.data';

/** Fetch all registered donors (Search Blood page) */
export const fetchDonors = () => simulateApi(donorsData);

/** Fetch a single donor by numeric ID (Public Donor Profile page) */
export const fetchDonorById = (id) => {
  const donor = donorsData.find((d) => d.id === Number(id));
  return simulateApi(donor ?? null, 600);
};
