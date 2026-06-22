/**
 * src/services/request.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Blood-request API calls (user-side active requests).
 * Swap `simulateApi(...)` for `apiClient.get/post(...)` when backend is ready.
 */

import { simulateApi } from '../api/apiSimulator';
import { requests } from '../data/requests.data';

/** Fetch the current user's blood requests (Active Requests dashboard tab) */
export const fetchRequests = () => simulateApi(requests);
