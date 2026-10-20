/**
 * src/services/request.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches blood requests from the backend API.
 */

import { apiClient } from '../api/client';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Fetch the current user's blood requests */
export const fetchRequests = async (userId) => {
  try {
    const endpoint = userId ? `/requests?userId=${userId}` : '/requests';
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch requests:', err);
    return [];
  }
};

/** Create a new blood request */
export const createRequest = async (data) => {
  try {
    const response = await apiClient.post('/requests', data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create request.';
    return { ok: false, error: errorMessage };
  }
};

/** Update a blood request */
export const updateRequest = async (id, data) => {
  try {
    const response = await apiClient.put(`/requests/${id}`, data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update request.';
    return { ok: false, error: errorMessage };
  }
};

/** Delete a blood request */
export const deleteRequest = async (id) => {
  try {
    await apiClient.delete(`/requests/${id}`);
    return { ok: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete request.';
    return { ok: false, error: errorMessage };
  }
};