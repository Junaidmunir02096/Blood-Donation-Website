/**
 * src/services/donor.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches and manages donors via the backend API.
 */

import { apiClient } from '../api/client';

/** Fetch all registered/verified donors (Search Blood page) */
export const fetchDonors = async () => {
  try {
    const response = await apiClient.get('/donors');
    const result = response.data;
    if (result && Array.isArray(result.donors)) {
      return result.donors;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to fetch donors:', err);
    return [];
  }
};

/** Fetch a single donor by ID */
export const fetchDonorById = async (id) => {
  try {
    const response = await apiClient.get(`/donors/${id}`);
    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch donor ${id}:`, err);
    return null;
  }
};

/** Search donors by blood group, city, or keyword */
export const searchDonors = async ({ bloodGroup, city, q }) => {
  try {
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (city) params.append('city', city);
    if (q) params.append('q', q);

    const endpoint = `/donors${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(endpoint);
    const result = response.data;
    if (result && Array.isArray(result.donors)) {
      return result.donors;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to search donors:', err);
    return [];
  }
};

/** Register authenticated user as a donor */
export const registerDonor = async (data) => {
  try {
    const response = await apiClient.post('/donors', data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to register as donor.';
    return { ok: false, error: errorMessage, fields: err?.fields };
  }
};

/** Update existing donor profile */
export const updateDonorProfile = async (id, data) => {
  try {
    const response = await apiClient.put(`/donors/${id}`, data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to update donor profile.';
    return { ok: false, error: errorMessage, fields: err?.fields };
  }
};
