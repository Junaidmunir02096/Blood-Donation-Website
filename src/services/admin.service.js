/**
 * src/services/admin.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin Panel API calls — blood requests, donors, and users management.
 * Swap `simulateApi(...)` for `apiClient.get/patch/delete(...)` when backend is ready.
 */

import { simulateApi } from '../api/apiSimulator';
import { REQUESTS_DATA, DONORS_DATA, USERS_DATA } from '../data/admin.data';

/** Fetch all blood requests for admin review */
export const fetchAdminRequests = () => simulateApi(REQUESTS_DATA);

/** Fetch all registered donors for admin management */
export const fetchAdminDonors = () => simulateApi(DONORS_DATA);

/** Fetch all registered users for admin management */
export const fetchAdminUsers = () => simulateApi(USERS_DATA);
