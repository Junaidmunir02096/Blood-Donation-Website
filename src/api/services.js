
// When a real backend is available, swap `simulateApi(...)` for `apiClient.get(...)`

import { simulateApi } from './apiSimulator';

// ── Mock data sources ─────────────────────────────────────────────────────────
import { donorsData } from '../data/donors.data';
import { initConversations, autoReplies } from '../data/messages.data';
import { activeRequests, nearbyDonors } from '../data/dashboard.data';
import {
  lifestyleItems,
  timelineEvents,
  achievements,
  notifPrefs,
} from '../data/profile.data';
import { REQUESTS_DATA, DONORS_DATA, USERS_DATA } from '../data/admin.data';
import { donationData } from '../data/donations.data';
import { requests } from '../data/requests.data';

// ── Donors (Search Blood page) ────────────────────────────────────────────────
export const fetchDonors = () => simulateApi(donorsData);

// ── Messages ──────────────────────────────────────────────────────────────────
export const fetchConversations = () => simulateApi(initConversations);

export const getAutoReplies = (conversationId) =>
  autoReplies[conversationId] || ['Thanks for reaching out!'];

// ── Dashboard Overview ────────────────────────────────────────────────────────
export const fetchDashboardData = () =>
  simulateApi({ activeRequests, nearbyDonors });

// ── My Profile ────────────────────────────────────────────────────────────────
export const fetchProfileData = () =>
  simulateApi({ lifestyleItems, timelineEvents, achievements, notifPrefs });

// ── Admin Panel ───────────────────────────────────────────────────────────────
export const fetchAdminRequests = () => simulateApi(REQUESTS_DATA);
export const fetchAdminDonors   = () => simulateApi(DONORS_DATA);
export const fetchAdminUsers    = () => simulateApi(USERS_DATA);

// ── Donation History ──────────────────────────────────────────────────────────
export const fetchDonations = () => simulateApi(donationData);

// ── Active Requests ───────────────────────────────────────────────────────────
export const fetchRequests = () => simulateApi(requests);

// ── Public Donor Profile ──────────────────────────────────────────────────────
export const fetchDonorById = (id) => {
  const donor = donorsData.find((d) => d.id === Number(id));
  return simulateApi(donor ?? null, 600);
};
