/**
 * src/services/admin.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin management API calls.
 */

import { apiClient } from '../api/client';

/** Fetch all blood requests for admin review */
export const fetchAdminRequests = async () => {
  try {
    const response = await apiClient.get('/admin/requests');
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch admin requests:', err);
    return [];
  }
};

/** Fetch all registered donors for admin management */
export const fetchAdminDonors = async () => {
  try {
    const response = await apiClient.get('/admin/donors');
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch admin donors:', err);
    return [];
  }
};

/** Fetch all registered users for admin management */
export const fetchAdminUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch admin users:', err);
    return [];
  }
};

/** Update user role/status (admin only) */
export const updateUserRole = async (userId, role, status) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, { role, status });
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update user.';
    return { ok: false, error: errorMessage };
  }
};