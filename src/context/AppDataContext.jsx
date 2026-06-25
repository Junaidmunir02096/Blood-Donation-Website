/**
 * src/context/AppDataContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global state management layer — uses localStorage as persistence (no backend).
 * Provides real CRUD operations for users, donors, requests, and donations.
 * Swap localStorage calls with real API calls when backend is ready.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── localStorage keys ──────────────────────────────────────── */
const KEYS = {
  users:     'ls_users',
  donors:    'ls_donors',
  requests:  'ls_requests',
  donations: 'ls_donations',
  seeded:    'ls_seeded_v2',
};

/* ── Seed data — shown until real data accumulates ──────────── */
const SEED_DONORS = [
  { id: 'dnr-seed-1', name: 'Marcus Chen',      bloodGroup: 'O+',  city: 'Seattle, WA',     miles: 2.4,  lastDonated: '4 months ago',  status: 'verified', avatar: 'MC', phone: '+1 (206) 555-0101', canContact: true,  userId: null, createdAt: '2025-02-10T09:00:00.000Z' },
  { id: 'dnr-seed-2', name: 'Sarah Jenkins',    bloodGroup: 'O+',  city: 'Bellevue, WA',    miles: 5.1,  lastDonated: '8 months ago',  status: 'verified', avatar: 'SJ', phone: '+1 (425) 555-0182', canContact: true,  userId: null, createdAt: '2025-01-15T10:00:00.000Z' },
  { id: 'dnr-seed-3', name: 'Amina Hassan',     bloodGroup: 'A+',  city: 'Renton, WA',      miles: 7.3,  lastDonated: '2 months ago',  status: 'verified', avatar: 'AH', phone: '+1 (425) 555-0211', canContact: true,  userId: null, createdAt: '2025-03-05T08:00:00.000Z' },
  { id: 'dnr-seed-4', name: 'Liu Wei',          bloodGroup: 'B+',  city: 'Kirkland, WA',    miles: 9.8,  lastDonated: '6 months ago',  status: 'verified', avatar: 'LW', phone: '+1 (425) 555-0177', canContact: true,  userId: null, createdAt: '2025-01-20T11:00:00.000Z' },
  { id: 'dnr-seed-5', name: 'Emma Thompson',    bloodGroup: 'AB+', city: 'Redmond, WA',     miles: 11.2, lastDonated: '3 months ago',  status: 'verified', avatar: 'ET', phone: '+1 (425) 555-0134', canContact: true,  userId: null, createdAt: '2025-02-28T12:00:00.000Z' },
  { id: 'dnr-seed-6', name: 'James Okafor',     bloodGroup: 'O-',  city: 'Everett, WA',     miles: 18.6, lastDonated: '5 months ago',  status: 'verified', avatar: 'JO', phone: '+1 (425) 555-0198', canContact: true,  userId: null, createdAt: '2025-01-01T07:00:00.000Z' },
  { id: 'dnr-seed-7', name: 'Carlos Mendez',    bloodGroup: 'B-',  city: 'Auburn, WA',      miles: 22.1, lastDonated: '7 months ago',  status: 'verified', avatar: 'CM', phone: '+1 (253) 555-0163', canContact: true,  userId: null, createdAt: '2024-12-20T09:00:00.000Z' },
  { id: 'dnr-seed-8', name: 'Fatima Al-Rashid', bloodGroup: 'AB-', city: 'Kent, WA',         miles: 16.5, lastDonated: '9 months ago',  status: 'verified', avatar: 'FA', phone: '+1 (253) 555-0145', canContact: true,  userId: null, createdAt: '2024-11-15T10:00:00.000Z' },
];

const SEED_REQUESTS = [
  {
    id: 'req-seed-1',
    blood: 'O+',
    hospital: 'City General Hospital',
    patient: 'Sarah Jenkins',
    neededBy: 'Jul 10, 2025',
    units: 2,
    status: 'Pending',
    urgency: 'Critical',
    distance: '12.0 miles away',
    time: '2 hrs ago',
    note: 'Surgery Patient',
    location: 'Seattle, WA',
    contactNumber: '+1 (206) 555-0101',
    userId: null,
    createdAt: '2025-07-08T07:00:00.000Z',
  },
  {
    id: 'req-seed-2',
    blood: 'A-',
    hospital: "Metro Children's Clinic",
    patient: 'Michael Chang',
    neededBy: 'Jul 08, 2025',
    units: 1,
    status: 'Approved',
    urgency: 'Routine',
    distance: '4.0 miles away',
    time: '5 hrs ago',
    note: 'Routine Supply',
    location: 'Bellevue, WA',
    contactNumber: '+1 (425) 555-0182',
    userId: null,
    createdAt: '2025-07-07T05:00:00.000Z',
  },
  {
    id: 'req-seed-3',
    blood: 'AB+',
    hospital: "St. Jude's Children's",
    patient: 'Emily Davis',
    neededBy: 'Jul 15, 2025',
    units: 3,
    status: 'Rejected',
    urgency: 'Urgent',
    distance: '8.3 miles away',
    time: '1 day ago',
    note: 'Pediatric Case',
    location: 'Renton, WA',
    contactNumber: '+1 (425) 555-0211',
    userId: null,
    createdAt: '2025-07-06T08:00:00.000Z',
  },
  {
    id: 'req-seed-4',
    blood: 'B+',
    hospital: 'Metro Regional Blood Center',
    patient: 'Liam Torres',
    neededBy: 'Jul 20, 2025',
    units: 2,
    status: 'Pending',
    urgency: 'Urgent',
    distance: '6.5 miles away',
    time: '3 hrs ago',
    note: 'Post-op Recovery',
    location: 'Kirkland, WA',
    contactNumber: '+1 (425) 555-0177',
    userId: null,
    createdAt: '2025-07-08T04:00:00.000Z',
  },
];

const SEED_DONATIONS = [
  { id: 'don-seed-1', date: 'Aug 28, 2024', rawDate: '2024-08-28', location: 'Metro Regional Blood Center', type: 'Whole Blood', volume: '450ml', volumeMl: 450, status: 'Completed', userId: 'seed' },
  { id: 'don-seed-2', date: 'May 12, 2024', rawDate: '2024-05-12', location: 'City General Hospital',        type: 'Plasma',      volume: '800ml', volumeMl: 800, status: 'Completed', userId: 'seed' },
  { id: 'don-seed-3', date: 'Feb 05, 2024', rawDate: '2024-02-05', location: 'Community Drive - Westside',   type: 'Whole Blood', volume: '450ml', volumeMl: 450, status: 'Completed', userId: 'seed' },
  { id: 'don-seed-4', date: 'Oct 14, 2023', rawDate: '2023-10-14', location: 'Sunrise Donation Hub',         type: 'Platelets',   volume: '300ml', volumeMl: 300, status: 'Completed', userId: 'seed' },
  { id: 'don-seed-5', date: 'Jun 30, 2023', rawDate: '2023-06-30', location: 'Metro Regional Blood Center',  type: 'Whole Blood', volume: '450ml', volumeMl: 450, status: 'Completed', userId: 'seed' },
];

const SEED_USERS = [
  { id: 'usr-seed-1', fullName: 'Demo Admin',    email: 'admin@lifestream.com', password: 'Admin@1234', bloodGroup: 'O+', role: 'admin',  phone: '+1 (206) 555-0001', city: 'Seattle, WA',  createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'usr-seed-2', fullName: 'John Dawson',   email: 'john@example.com',     password: 'Test@1234',  bloodGroup: 'A+', role: 'donor',  phone: '+1 (206) 555-0111', city: 'Seattle, WA',  createdAt: '2025-01-10T00:00:00.000Z' },
  { id: 'usr-seed-3', fullName: 'Mia Nguyen',    email: 'mia@example.com',      password: 'Test@1234',  bloodGroup: 'B+', role: 'donor',  phone: '+1 (425) 555-0222', city: 'Bellevue, WA', createdAt: '2025-02-15T00:00:00.000Z' },
  { id: 'usr-seed-4', fullName: 'Ravi Patel',    email: 'ravi@example.com',     password: 'Test@1234',  bloodGroup: 'O-', role: 'recipient', phone: '+1 (253) 555-0333', city: 'Tacoma, WA', createdAt: '2025-03-20T00:00:00.000Z' },
];

/* ── Helper — read from localStorage ───────────────────────── */
const readLS = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/* ── Helper — write to localStorage ────────────────────────── */
const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded – silently ignore in portfolio context
  }
};

/* ── Seed on first load ─────────────────────────────────────── */
const seedIfNeeded = () => {
  if (localStorage.getItem(KEYS.seeded)) return;
  writeLS(KEYS.users,     SEED_USERS);
  writeLS(KEYS.donors,    SEED_DONORS);
  writeLS(KEYS.requests,  SEED_REQUESTS);
  writeLS(KEYS.donations, SEED_DONATIONS);
  localStorage.setItem(KEYS.seeded, 'true');
};

/* ── Context ────────────────────────────────────────────────── */
const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  // Run seed on first render (before state initialisation)
  seedIfNeeded();

  const [users,     setUsers]     = useState(() => readLS(KEYS.users,     []));
  const [donors,    setDonors]    = useState(() => readLS(KEYS.donors,    []));
  const [requests,  setRequests]  = useState(() => readLS(KEYS.requests,  []));
  const [donations, setDonations] = useState(() => readLS(KEYS.donations, []));

  /* Sync every state slice to localStorage whenever it changes */
  useEffect(() => { writeLS(KEYS.users,     users);     }, [users]);
  useEffect(() => { writeLS(KEYS.donors,    donors);    }, [donors]);
  useEffect(() => { writeLS(KEYS.requests,  requests);  }, [requests]);
  useEffect(() => { writeLS(KEYS.donations, donations); }, [donations]);

  /* ── Stats helpers ─────────────────────────────────────────── */
  const getStats = useCallback(() => {
    const totalBloodMl = donations.reduce((sum, d) => sum + (d.volumeMl || 0), 0);
    const totalLitres  = (totalBloodMl / 1000).toFixed(1);
    return {
      totalUsers:    users.filter(u => u.role !== 'admin').length,
      totalDonors:   donors.length,
      activeRequests: requests.filter(r => r.status === 'Pending').length,
      totalLitres:   parseFloat(totalLitres),
      totalDonations: donations.length,
    };
  }, [users, donors, requests, donations]);

  /* ── User CRUD ─────────────────────────────────────────────── */
  const addUser = useCallback((userData) => {
    const newUser = { id: `usr-${Date.now()}`, ...userData, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const deleteUser = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setUsers(prev => prev.filter(u => u.id !== id));
    return { ok: true };
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  /* ── Donor CRUD ────────────────────────────────────────────── */
  const addDonor = useCallback((donorData) => {
    const initials = (donorData.name || 'XX')
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const newDonor = {
      id: `dnr-${Date.now()}`,
      ...donorData,
      status: 'verified',
      avatar: initials,
      canContact: true,
      createdAt: new Date().toISOString(),
    };
    setDonors(prev => [...prev, newDonor]);
    return newDonor;
  }, []);

  const deleteDonor = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setDonors(prev => prev.filter(d => d.id !== id));
    return { ok: true };
  }, []);

  /* ── Request CRUD ──────────────────────────────────────────── */
  const addRequest = useCallback((requestData) => {
    const now  = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newRequest = {
      id: `req-${Date.now()}`,
      ...requestData,
      status: 'Pending',
      time:   'Just now',
      distance: '—',
      note:   requestData.note || requestData.urgency || 'Standard',
      neededBy: requestData.neededBy || date,
      createdAt: now.toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, []);

  const updateRequest = useCallback((id, updates) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRequest = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setRequests(prev => prev.filter(r => r.id !== id));
    return { ok: true };
  }, []);

  /* ── Donation CRUD ─────────────────────────────────────────── */
  const addDonation = useCallback((donationData) => {
    const now  = new Date();
    const volumeNum = parseInt(donationData.volume) || 450;
    const newDonation = {
      id: `don-${Date.now()}`,
      ...donationData,
      volumeMl: volumeNum,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: now.toISOString().split('T')[0],
      status: 'Completed',
      createdAt: now.toISOString(),
    };
    setDonations(prev => [...prev, newDonation]);
    return newDonation;
  }, []);

  /* ── Query helpers ─────────────────────────────────────────── */
  const getDonorsByUserId     = useCallback((uid) => donors.filter(d => d.userId === uid),    [donors]);
  const getRequestsByUserId   = useCallback((uid) => requests.filter(r => r.userId === uid),  [requests]);
  const getDonationsByUserId  = useCallback((uid) => donations.filter(d => d.userId === uid), [donations]);
  const getUserByEmail        = useCallback((email) => users.find(u => u.email?.toLowerCase() === email?.toLowerCase()), [users]);
  const getDonorById          = useCallback((id) => donors.find(d => d.id === String(id) || d.id === Number(id)), [donors]);

  const value = {
    /* State */
    users, donors, requests, donations,
    /* Stats */
    getStats,
    /* User */
    addUser, deleteUser, updateUser, getUserByEmail,
    /* Donor */
    addDonor, deleteDonor, getDonorsByUserId, getDonorById,
    /* Request */
    addRequest, updateRequest, deleteRequest, getRequestsByUserId,
    /* Donation */
    addDonation, getDonationsByUserId,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

/* ── useAppData hook ─────────────────────────────────────────── */
export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
};

export default AppDataContext;
