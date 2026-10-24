/**
 * src/services/admin.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin management API calls (restricted to admin role).
 */

import { apiClient } from '../api/client';

/** Fetch platform aggregate stats for admin overview */
export const fetchAdminStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data || null;
  } catch (err) {
    console.error('Failed to fetch admin stats:', err);
    return null;
  }
};

/** Fetch all blood requests for admin review */
export const fetchAdminRequests = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.status && params.status !== 'All') searchParams.append('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiClient.get(`/admin/requests${query}`);
    const result = response.data;
    if (result && Array.isArray(result.requests)) {
      return result.requests;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to fetch admin requests:', err);
    return [];
  }
};

/** Update request status (Approved, Rejected, etc.) */
export const updateAdminRequestStatus = async (requestId, status) => {
  try {
    const response = await apiClient.put(`/admin/requests/${requestId}`, { status });
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to update request status.';
    return { ok: false, error: errorMessage };
  }
};

/** Delete blood request */
export const deleteAdminRequest = async (requestId) => {
  try {
    const response = await apiClient.delete(`/admin/requests/${requestId}`);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to delete blood request.';
    return { ok: false, error: errorMessage };
  }
};

/** Fetch all registered donors for admin management */
export const fetchAdminDonors = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.status && params.status !== 'All') searchParams.append('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiClient.get(`/admin/donors${query}`);
    const result = response.data;
    if (result && Array.isArray(result.donors)) {
      return result.donors;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to fetch admin donors:', err);
    return [];
  }
};

/** Update donor status (verified, pending, suspended) */
export const updateAdminDonorStatus = async (donorId, status, canContact) => {
  try {
    const payload = { status };
    if (canContact !== undefined) payload.canContact = canContact;
    const response = await apiClient.put(`/admin/donors/${donorId}`, payload);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to update donor status.';
    return { ok: false, error: errorMessage };
  }
};

/** Delete donor profile */
export const deleteAdminDonor = async (donorId) => {
  try {
    const response = await apiClient.delete(`/admin/donors/${donorId}`);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to delete donor.';
    return { ok: false, error: errorMessage };
  }
};

/** Fetch all registered users for admin management */
export const fetchAdminUsers = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.status && params.status !== 'All') searchParams.append('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiClient.get(`/admin/users${query}`);
    const result = response.data;
    if (result && Array.isArray(result.users)) {
      return result.users;
    }
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to fetch admin users:', err);
    return [];
  }
};

/** Update user role/status (admin only) */
export const updateAdminUser = async (userId, { role, status }) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, { role, status });
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to update user.';
    return { ok: false, error: errorMessage };
  }
};

/** Delete user account */
export const deleteAdminUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to delete user.';
    return { ok: false, error: errorMessage };
  }
};
