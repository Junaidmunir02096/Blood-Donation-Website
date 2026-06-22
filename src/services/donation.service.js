/**
 * src/services/donation.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Donation history API calls.
 * Swap `simulateApi(...)` for `apiClient.get(...)` when backend is ready.
 */

import { simulateApi } from '../api/apiSimulator';
import { donationData } from '../data/donations.data';

/** Fetch the current user's donation history records */
export const fetchDonations = () => simulateApi(donationData);
