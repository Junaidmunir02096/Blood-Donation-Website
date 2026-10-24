/**
 * src/services/request.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches and manages blood requests via the backend API.
 */

import { apiClient } from '../api/client';

/** Fetch the blood requests (optionally filtered by userId) */
export const fetchRequests = async (userId) => {
  try {
    const endpoint = userId ? `/requests?userId=${userId}` : '/requests';
    const response = await apiClient.get(endpoint);
    const result = response.data;
    if (result && Array.isArray(result.requests)) {
      return result.requests;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to fetch requests:', err);
    return [];
  }
};

/** Create a new blood request (guest or authenticated) */
export const createRequest = async (data) => {
  try {
    const response = await apiClient.post('/requests', data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to create request.';
    return { ok: false, error: errorMessage, fields: err?.fields };
  }
};

/** Update a blood request */
export const updateRequest = async (id, data) => {
  try {
    const response = await apiClient.put(`/requests/${id}`, data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to update request.';
    return { ok: false, error: errorMessage, fields: err?.fields };
  }
};

/** Cancel a blood request */
export const deleteRequest = async (id) => {
  try {
    const response = await apiClient.delete(`/requests/${id}`);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to cancel request.';
    return { ok: false, error: errorMessage };
  }
};
