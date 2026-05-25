/**
 * src/data/admin.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data for the Admin Panel — blood requests, registered donors, and users.
 * Consumed by: AdminPanel.jsx
 * Next step  : wrap these in src/services/admin.service.js with fake async API.
 */

export const REQUESTS_DATA = [
  {
    id: 'REQ-7829',
    hospital: 'St. Jude Medical Center',
    patient: 'Sarah Jenkins',
    bloodGroup: 'O-',
    units: 4,
    urgency: 'Critical',
    date: 'Oct 24, 09:30 AM',
    status: 'pending',
  },
  {
    id: 'REQ-7828',
    hospital: 'Mercy General Hospital',
    patient: 'Michael Chang',
    bloodGroup: 'A+',
    units: 2,
    urgency: 'Standard',
    date: 'Oct 24, 08:15 AM',
    status: 'pending',
  },
  {
    id: 'REQ-7827',
    hospital: 'City Health Clinic',
    patient: 'Elena Rodriguez',
    bloodGroup: 'B-',
    units: 1,
    urgency: 'High',
    date: 'Oct 23, 11:45 PM',
    status: 'pending',
  },
  {
    id: 'REQ-7826',
    hospital: 'Sunrise Medical Hub',
    patient: 'Daniel Osei',
    bloodGroup: 'AB+',
    units: 3,
    urgency: 'Standard',
    date: 'Oct 23, 04:00 PM',
    status: 'approved',
  },
  {
    id: 'REQ-7825',
    hospital: 'Northern Health Center',
    patient: 'Fatima Al-Rashid',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'High',
    date: 'Oct 23, 01:30 PM',
    status: 'rejected',
  },
];

export const DONORS_DATA = [
  {
    id: 'DNR-1021',
    name: 'Ahmed Al-Farouq',
    bloodGroup: 'O+',
    city: 'Karachi',
    phone: '+92-300-1234567',
    lastDonation: 'Oct 10, 2025',
    status: 'active',
  },
  {
    id: 'DNR-1020',
    name: 'Hina Zafar',
    bloodGroup: 'A-',
    city: 'Lahore',
    phone: '+92-321-9876543',
    lastDonation: 'Sep 18, 2025',
    status: 'pending',
  },
  {
    id: 'DNR-1019',
    name: 'Marcus Williams',
    bloodGroup: 'B+',
    city: 'Islamabad',
    phone: '+92-333-5554433',
    lastDonation: 'Aug 30, 2025',
    status: 'active',
  },
  {
    id: 'DNR-1018',
    name: 'Priya Sharma',
    bloodGroup: 'AB-',
    city: 'Rawalpindi',
    phone: '+92-311-7778899',
    lastDonation: 'Oct 01, 2025',
    status: 'pending',
  },
  {
    id: 'DNR-1017',
    name: 'Lucas Müller',
    bloodGroup: 'O-',
    city: 'Faisalabad',
    phone: '+92-346-2221110',
    lastDonation: 'Jul 15, 2025',
    status: 'inactive',
  },
];

export const USERS_DATA = [
  {
    id: 'USR-3041',
    name: 'Sophia Carter',
    email: 'sophia.c@email.com',
    role: 'Recipient',
    joined: 'Oct 20, 2025',
    status: 'active',
  },
  {
    id: 'USR-3040',
    name: 'James Okonkwo',
    email: 'james.ok@email.com',
    role: 'Donor',
    joined: 'Oct 18, 2025',
    status: 'pending',
  },
  {
    id: 'USR-3039',
    name: 'Aisha Patel',
    email: 'aisha.p@email.com',
    role: 'Recipient',
    joined: 'Oct 15, 2025',
    status: 'active',
  },
  {
    id: 'USR-3038',
    name: 'Benjamin Osei',
    email: 'benny.o@email.com',
    role: 'Donor',
    joined: 'Oct 12, 2025',
    status: 'pending',
  },
  {
    id: 'USR-3037',
    name: 'Lena Schreiber',
    email: 'lena.s@email.com',
    role: 'Admin',
    joined: 'Sep 28, 2025',
    status: 'active',
  },
];
