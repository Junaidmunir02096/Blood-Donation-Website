/**
 * src/services/profile.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * User profile data API calls.
 */

import { apiClient } from '../api/client';

/** Fetch the current user's full profile data */
export const fetchProfileData = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data || {};
  } catch (err) {
    console.error('Failed to fetch profile data:', err);
    return {};
  }
};

/** Update user profile */
export const updateProfile = async (data) => {
  try {
    const response = await apiClient.put('/users/profile', data);
    return { ok: true, data: response.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update profile.';
    return { ok: false, error: errorMessage };
  }
};

/** Upload avatar */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${apiClient.baseURL}/users/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    return { ok: true, data: data.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar.';
    return { ok: false, error: errorMessage };
  }
};