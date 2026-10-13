/**
 * src/services/dashboard.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Dashboard overview widget data — fetches from backend API.
 */

import { apiClient } from '../api/client';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Fetch summary data shown on the Dashboard Overview widget */
export const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard/summary');
    return response.data || { activeRequests: [], nearbyDonors: [] };
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    return { activeRequests: [], nearbyDonors: [] };
  }
};

/** Fetch dashboard stats (counts, etc.) */
export const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return response.data || {};
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    return {};
  }
};