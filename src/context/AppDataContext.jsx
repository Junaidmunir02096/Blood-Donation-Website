/**
 * Global client-side store. Persistence is localStorage until a backend exists.
 * Bump KEYS.seeded when seed shape changes so demos pick up new Pakistan data.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { DONOR_STATUS, REQUEST_STATUS } from '../utils/status';
import { getInitials } from '../utils/avatar';

const KEYS = {
  users:     'ls_users',
  donors:    'ls_donors',
  requests:  'ls_requests',
  donations: 'ls_donations',
  seeded:    'ls_seeded_v4',
};

const SEED_DONORS = [
  { id: 'dnr-seed-1', name: 'Ahmed Khan',         bloodGroup: 'O+',  city: 'Lahore',      km: 2.4,  lastDonated: '4 months ago',  status: 'verified', avatar: 'AK', phone: '0300-1112233', canContact: true,  userId: 'usr-seed-2', donations: 14, lives: 42, streak: 5,  joined: 'March 2022', createdAt: '2025-02-10T09:00:00.000Z' },
  { id: 'dnr-seed-2', name: 'Fatima Noor',        bloodGroup: 'O+',  city: 'Lahore',      km: 5.1,  lastDonated: '8 months ago',  status: 'verified', avatar: 'FN', phone: '0321-4455667', canContact: true,  userId: null,        donations: 8,  lives: 24, streak: 3,  joined: 'July 2022',  createdAt: '2025-01-15T10:00:00.000Z' },
  { id: 'dnr-seed-3', name: 'Hassan Ali',         bloodGroup: 'A+',  city: 'Karachi',     km: 7.3,  lastDonated: '2 months ago',  status: 'verified', avatar: 'HA', phone: '0333-7788990', canContact: true,  userId: null,        donations: 11, lives: 33, streak: 4,  joined: 'April 2022', createdAt: '2025-03-05T08:00:00.000Z' },
  { id: 'dnr-seed-4', name: 'Ayesha Siddiqui',    bloodGroup: 'B+',  city: 'Islamabad',   km: 9.8,  lastDonated: '6 months ago',  status: 'verified', avatar: 'AS', phone: '0345-1122334', canContact: true,  userId: null,        donations: 6,  lives: 18, streak: 2,  joined: 'January 2023', createdAt: '2025-01-20T11:00:00.000Z' },
  { id: 'dnr-seed-5', name: 'Usman Tariq',        bloodGroup: 'AB+', city: 'Rawalpindi',  km: 4.2,  lastDonated: '3 months ago',  status: 'verified', avatar: 'UT', phone: '0312-5566778', canContact: true,  userId: null,        donations: 17, lives: 51, streak: 6,  joined: 'December 2021', createdAt: '2025-02-28T12:00:00.000Z' },
  { id: 'dnr-seed-6', name: 'Zainab Malik',       bloodGroup: 'O-',  city: 'Faisalabad',  km: 12.6, lastDonated: '5 months ago',  status: 'verified', avatar: 'ZM', phone: '0308-9988776', canContact: true,  userId: null,        donations: 9,  lives: 27, streak: 3,  joined: 'June 2022', createdAt: '2025-01-01T07:00:00.000Z' },
  { id: 'dnr-seed-7', name: 'Bilal Hussain',      bloodGroup: 'B-',  city: 'Peshawar',    km: 18.1, lastDonated: '7 months ago',  status: 'pending',  avatar: 'BH', phone: '0331-2233445', canContact: false, userId: null,        donations: 2,  lives: 6,  streak: 1,  joined: 'March 2024', createdAt: '2024-12-20T09:00:00.000Z' },
  { id: 'dnr-seed-8', name: 'Sana Qureshi',       bloodGroup: 'AB-', city: 'Multan',      km: 14.5, lastDonated: '9 months ago',  status: 'verified', avatar: 'SQ', phone: '0301-6677889', canContact: true,  userId: null,        donations: 12, lives: 36, streak: 5,  joined: 'November 2021', createdAt: '2024-11-15T10:00:00.000Z' },
];

const SEED_REQUESTS = [
  {
    id: 'req-seed-1',
    bloodGroup: 'O+',
    hospital: 'Mayo Hospital, Lahore',
    patient: 'Sara Ahmed',
    neededBy: '18 Aug 2026',
    units: 2,
    component: 'Whole Blood',
    status: REQUEST_STATUS.Pending,
    urgency: 'Critical',
    distance: '4.0 km away',
    time: '2 hrs ago',
    note: 'Emergency surgery',
    location: 'Lahore',
    contactNumber: '0300-5550101',
    email: 'john@example.com',
    userId: 'usr-seed-2',
    createdAt: '2026-08-16T07:00:00.000Z',
  },
  {
    id: 'req-seed-2',
    bloodGroup: 'A-',
    hospital: 'Aga Khan University Hospital, Karachi',
    patient: 'Imran Sheikh',
    neededBy: '20 Aug 2026',
    units: 1,
    component: 'Whole Blood',
    status: REQUEST_STATUS.Approved,
    urgency: 'Routine',
    distance: '6.5 km away',
    time: '5 hrs ago',
    note: 'Scheduled procedure',
    location: 'Karachi',
    contactNumber: '0321-5550182',
    userId: 'usr-seed-4',
    createdAt: '2026-08-15T05:00:00.000Z',
  },
  {
    id: 'req-seed-3',
    bloodGroup: 'AB+',
    hospital: 'PIMS, Islamabad',
    patient: 'Hina Raza',
    neededBy: '22 Aug 2026',
    units: 3,
    component: 'Platelets',
    status: REQUEST_STATUS.Rejected,
    urgency: 'Urgent',
    distance: '8.3 km away',
    time: '1 day ago',
    note: 'Pediatric case',
    location: 'Islamabad',
    contactNumber: '0333-5550211',
    userId: null,
    createdAt: '2026-08-14T08:00:00.000Z',
  },
  {
    id: 'req-seed-4',
    bloodGroup: 'B+',
    hospital: 'Holy Family Hospital, Rawalpindi',
    patient: 'Ali Hassan',
    neededBy: '21 Aug 2026',
    units: 2,
    component: 'Whole Blood',
    status: REQUEST_STATUS.Pending,
    urgency: 'Urgent',
    distance: '5.2 km away',
    time: '3 hrs ago',
    note: 'Post-op recovery',
    location: 'Rawalpindi',
    contactNumber: '0345-5550177',
    userId: null,
    createdAt: '2026-08-16T04:00:00.000Z',
  },
];

const SEED_DONATIONS = [
  { id: 'don-seed-1', date: '12 May 2026', rawDate: '2026-05-12', location: 'Mayo Hospital, Lahore', type: 'Whole Blood', volume: '450ml', volumeMl: 450, status: 'Completed', userId: 'usr-seed-2' },
  { id: 'don-seed-2', date: '18 Jan 2026', rawDate: '2026-01-18', location: 'Shaukat Khanum Memorial Hospital, Lahore', type: 'Plasma', volume: '800ml', volumeMl: 800, status: 'Completed', userId: 'usr-seed-2' },
  { id: 'don-seed-3', date: '05 Feb 2026', rawDate: '2026-02-05', location: 'Aga Khan University Hospital, Karachi', type: 'Whole Blood', volume: '450ml', volumeMl: 450, status: 'Completed', userId: 'usr-seed-3' },
  { id: 'don-seed-4', date: '14 Oct 2025', rawDate: '2025-10-14', location: 'PIMS, Islamabad', type: 'Platelets', volume: '300ml', volumeMl: 300, status: 'Completed', userId: 'usr-seed-3' },
];

const SEED_USERS = [
  { id: 'usr-seed-1', fullName: 'Demo Admin',   email: 'admin@lifestream.com', password: 'Admin@1234', bloodGroup: 'O+', role: 'admin',  phone: '0300-0000001', city: 'Lahore',      createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'usr-seed-2', fullName: 'Ahmed Khan',   email: 'john@example.com',     password: 'Test@1234',  bloodGroup: 'O+', role: 'donor',  phone: '0300-1112233', city: 'Lahore',      createdAt: '2025-01-10T00:00:00.000Z' },
  { id: 'usr-seed-3', fullName: 'Mia Hassan',   email: 'mia@example.com',      password: 'Test@1234',  bloodGroup: 'B+', role: 'donor',  phone: '0321-2223344', city: 'Karachi',     createdAt: '2025-02-15T00:00:00.000Z' },
  { id: 'usr-seed-4', fullName: 'Ravi Patel',   email: 'ravi@example.com',     password: 'Test@1234',  bloodGroup: 'O-', role: 'donor',  phone: '0333-3334455', city: 'Islamabad',   createdAt: '2025-03-20T00:00:00.000Z' },
];

const readLS = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota — ignore in demo */
  }
};

const seedIfNeeded = () => {
  if (localStorage.getItem(KEYS.seeded)) return;
  writeLS(KEYS.users,     SEED_USERS);
  writeLS(KEYS.donors,    SEED_DONORS);
  writeLS(KEYS.requests,  SEED_REQUESTS);
  writeLS(KEYS.donations, SEED_DONATIONS);
  localStorage.setItem(KEYS.seeded, 'true');
};

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  seedIfNeeded();

  const [users,     setUsers]     = useState(() => readLS(KEYS.users,     []));
  const [donors,    setDonors]    = useState(() => readLS(KEYS.donors,    []));
  const [requests,  setRequests]  = useState(() => readLS(KEYS.requests,  []));
  const [donations, setDonations] = useState(() => readLS(KEYS.donations, []));

  useEffect(() => { writeLS(KEYS.users,     users);     }, [users]);
  useEffect(() => { writeLS(KEYS.donors,    donors);    }, [donors]);
  useEffect(() => { writeLS(KEYS.requests,  requests);  }, [requests]);
  useEffect(() => { writeLS(KEYS.donations, donations); }, [donations]);

  const getStats = useCallback(() => {
    const totalBloodMl = donations.reduce((sum, d) => sum + (d.volumeMl || 0), 0);
    const totalLitres  = (totalBloodMl / 1000).toFixed(1);
    return {
      totalUsers:     users.filter((u) => u.role !== 'admin').length,
      totalDonors:    donors.filter((d) => d.status === DONOR_STATUS.verified).length,
      pendingDonors:  donors.filter((d) => d.status === DONOR_STATUS.pending).length,
      activeRequests: requests.filter((r) => r.status === REQUEST_STATUS.Pending).length,
      totalLitres:    parseFloat(totalLitres),
      totalDonations: donations.length,
    };
  }, [users, donors, requests, donations]);

  const addUser = useCallback((userData) => {
    const newUser = { id: `usr-${Date.now()}`, ...userData, createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const deleteUser = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return { ok: true };
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const addDonor = useCallback((donorData) => {
    const initials = getInitials(donorData.name || 'XX');
    const newDonor = {
      id: `dnr-${Date.now()}`,
      donations: 0,
      lives: 0,
      streak: 0,
      joined: new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }),
      km: donorData.km ?? null,
      ...donorData,
      status: DONOR_STATUS.pending,
      avatar: initials,
      canContact: false,
      createdAt: new Date().toISOString(),
    };
    setDonors((prev) => [...prev, newDonor]);
    return newDonor;
  }, []);

  const updateDonor = useCallback((id, updates) => {
    setDonors((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const next = { ...d, ...updates };
      if (next.status === DONOR_STATUS.verified) next.canContact = true;
      if (next.status === DONOR_STATUS.pending) next.canContact = false;
      return next;
    }));
  }, []);

  const deleteDonor = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setDonors((prev) => prev.filter((d) => d.id !== id));
    return { ok: true };
  }, []);

  const addRequest = useCallback((requestData) => {
    const now  = new Date();
    const date = now.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    const newRequest = {
      id: `req-${Date.now()}`,
      ...requestData,
      bloodGroup: requestData.bloodGroup || requestData.blood,
      status: REQUEST_STATUS.Pending,
      time:   'Just now',
      distance: requestData.distance || '—',
      note:   requestData.note || requestData.urgency || 'Standard',
      neededBy: requestData.neededBy || date,
      createdAt: now.toISOString(),
    };
    setRequests((prev) => [...prev, newRequest]);
    return newRequest;
  }, []);

  const updateRequest = useCallback((id, updates) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteRequest = useCallback((id, currentUser) => {
    if (currentUser?.role !== 'admin') return { ok: false, error: 'Unauthorized' };
    setRequests((prev) => prev.filter((r) => r.id !== id));
    return { ok: true };
  }, []);

  const addDonation = useCallback((donationData) => {
    const now  = new Date();
    const volumeNum = parseInt(donationData.volume, 10) || 450;
    const newDonation = {
      id: `don-${Date.now()}`,
      ...donationData,
      volumeMl: volumeNum,
      date: donationData.date || now.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      rawDate: donationData.rawDate || now.toISOString().split('T')[0],
      status: 'Completed',
      createdAt: now.toISOString(),
    };
    setDonations((prev) => [...prev, newDonation]);
    return newDonation;
  }, []);

  const getDonorsByUserId    = useCallback((uid) => donors.filter((d) => d.userId === uid), [donors]);
  const getRequestsByUserId  = useCallback((uid) => requests.filter((r) => r.userId === uid), [requests]);
  const getDonationsByUserId = useCallback((uid) => donations.filter((d) => d.userId === uid), [donations]);
  const getUserByEmail       = useCallback((email) => users.find((u) => u.email?.toLowerCase() === email?.toLowerCase()), [users]);
  const getDonorById         = useCallback((id) => donors.find((d) => String(d.id) === String(id)), [donors]);

  const value = {
    users, donors, requests, donations,
    getStats,
    addUser, deleteUser, updateUser, getUserByEmail,
    addDonor, updateDonor, deleteDonor, getDonorsByUserId, getDonorById,
    addRequest, updateRequest, deleteRequest, getRequestsByUserId,
    addDonation, getDonationsByUserId,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataContext;
