/**
 * src/services/dashboard.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Dashboard overview widget data.
 * Swap `simulateApi(...)` for `apiClient.get(...)` when backend is ready.
 */

import { simulateApi } from '../api/apiSimulator';
import { activeRequests, nearbyDonors } from '../data/dashboard.data';

/** Fetch summary data shown on the Dashboard Overview widget */
export const fetchDashboardData = () =>
  simulateApi({ activeRequests, nearbyDonors });
