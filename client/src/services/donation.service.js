/**
 * src/services/donation.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Donation history API calls.
 */

import { apiClient } from '../api/client';

/** Fetch the current user's donation history records */
export const fetchDonations = async (userId) => {
  try {
    const endpoint = userId ? `/donations?userId=${userId}` : '/donations';
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch donations:', err);
    return [];
  }
};

/** Create a new donation record */
export const createDonation = async (data) => {
  try {
    const response = await apiClient.post('/donations', data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create donation record.';
    return { ok: false, error: errorMessage };
  }
};