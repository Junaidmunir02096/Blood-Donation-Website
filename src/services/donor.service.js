/**
 * src/services/donor.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches donors from the backend API.
 */

import { apiClient } from '../api/client';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Fetch all registered donors (Search Blood page) */
export const fetchDonors = async () => {
  try {
    const response = await apiClient.get('/donors');
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch donors:', err);
    // Fallback to empty array
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

/** Search donors by blood group and city */
export const searchDonors = async ({ bloodGroup, city }) => {
  try {
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (city) params.append('city', city);
    
    const response = await apiClient.get(`/donors/search?${params.toString()}`);
    return response.data || [];
  } catch (err) {
    console.error('Failed to search donors:', err);
    return [];
  }
};