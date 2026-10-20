/**
 * LifeStream CRM — mock network snapshot.
 *
 * This file is the frontend stand-in for MongoDB aggregations that a future
 * `/api/crm/overview` endpoint would return. Keep the shape stable:
 *   fetchCrmOverview(filters) → { kpis, donationTrend, bloodGroupAvailability, ... }
 *
 * Swap path (backend ready):
 *   1. Stop importing this module from crm.service.js
 *   2. GET /api/crm/overview?period=&city=&bloodGroup=
 *   3. Keep the same DTO so CrmDashboard does not change
 */

export const CRM_PERIODS = [
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
];

/** Palette aligned with LifeStream tokens — used by Recharts */
export const CRM_CHART_COLORS = {
  primary: '#c0392b',
  primaryDark: '#922b21',
  accent: '#e74c3c',
  navy: '#1a1a2e',
  muted: '#5c5c6a',
  teal: '#0f766e',
  amber: '#d97706',
  green: '#16a34a',
  grid: '#e8e0df',
  track: '#fdf2f0',
  groups: {
    'O+': '#c0392b',
    'O-': '#922b21',
    'A+': '#e74c3c',
    'A-': '#f1948a',
    'B+': '#1a1a2e',
    'B-': '#4a4a5a',
    'AB+': '#0f766e',
    'AB-': '#5c5c6a',
  },
  status: {
    stable: '#16a34a',
    low: '#d97706',
    critical: '#c0392b',
  },
};

/**
 * City share of the national network — used to scale KPIs when a city filter
 * is applied (mirrors a Mongo `$match: { city }` + `$group` pipeline).
 */
export const CRM_CITY_SHARE = {
  all: 1,
  Lahore: 0.24,
  Karachi: 0.26,
  Islamabad: 0.1,
  Rawalpindi: 0.07,
  Faisalabad: 0.06,
  Peshawar: 0.06,
  Multan: 0.05,
  Quetta: 0.05,
  Hyderabad: 0.04,
  Gujranwala: 0.03,
  Sialkot: 0.02,
  Bahawalpur: 0.02,
};

export const CRM_GROUP_SHARE = {
  all: 1,
  'O+': 0.32,
  'O-': 0.07,
  'A+': 0.22,
  'A-': 0.06,
  'B+': 0.2,
  'B-': 0.05,
  'AB+': 0.05,
  'AB-': 0.03,
};

/** KPI snapshots by reporting period (would be date-range aggregations). */
export const CRM_KPIS_BY_PERIOD = {
  week: {
    totalDonors: 18420,
    totalDonorsTrend: 1.1,
    availableDonors: 986,
    availableDonorsTrend: 2.4,
    pendingRequests: 28,
    pendingRequestsTrend: -6.1,
    pendingMeta: 'Avg response 4.8h',
    emergencies: 5,
    emergenciesTrend: 12.0,
    emergenciesMeta: 'O- pressure in Karachi',
  },
  month: {
    totalDonors: 18420,
    totalDonorsTrend: 4.2,
    availableDonors: 4286,
    availableDonorsTrend: 3.1,
    pendingRequests: 64,
    pendingRequestsTrend: -8.4,
    pendingMeta: 'Avg response 3.6h',
    emergencies: 9,
    emergenciesTrend: 18.0,
    emergenciesMeta: 'O- shortage in Karachi',
  },
  year: {
    totalDonors: 18420,
    totalDonorsTrend: 22.6,
    availableDonors: 4286,
    availableDonorsTrend: 14.8,
    pendingRequests: 64,
    pendingRequestsTrend: -11.2,
    pendingMeta: 'YTD fulfillment 81%',
    emergencies: 9,
    emergenciesTrend: -4.0,
    emergenciesMeta: 'Critical cases trending down',
  },
};

export const CRM_DONATION_TREND = {
  week: [
    { label: 'Mon', donations: 42, requests: 38 },
    { label: 'Tue', donations: 51, requests: 44 },
    { label: 'Wed', donations: 48, requests: 52 },
    { label: 'Thu', donations: 63, requests: 47 },
    { label: 'Fri', donations: 71, requests: 58 },
    { label: 'Sat', donations: 88, requests: 61 },
    { label: 'Sun', donations: 54, requests: 40 },
  ],
  month: [
    { label: 'Week 1', donations: 312, requests: 268 },
    { label: 'Week 2', donations: 348, requests: 291 },
    { label: 'Week 3', donations: 401, requests: 334 },
    { label: 'Week 4', donations: 376, requests: 318 },
  ],
  year: [
    { label: 'Jan', donations: 980, requests: 1120 },
    { label: 'Feb', donations: 1040, requests: 980 },
    { label: 'Mar', donations: 1180, requests: 1210 },
    { label: 'Apr', donations: 1260, requests: 1090 },
    { label: 'May', donations: 1410, requests: 1320 },
    { label: 'Jun', donations: 1330, requests: 1408 },
    { label: 'Jul', donations: 1520, requests: 1380 },
    { label: 'Aug', donations: 1680, requests: 1490 },
    { label: 'Sep', donations: 1590, requests: 1510 },
    { label: 'Oct', donations: 1740, requests: 1602 },
    { label: 'Nov', donations: 1810, requests: 1575 },
    { label: 'Dec', donations: 1920, requests: 1640 },
  ],
};

export const CRM_BLOOD_GROUP_AVAILABILITY = [
  { group: 'O+', donors: 5894, requests: 210, status: 'stable' },
  { group: 'O-', donors: 1289, requests: 186, status: 'critical' },
  { group: 'A+', donors: 4052, requests: 142, status: 'stable' },
  { group: 'A-', donors: 1105, requests: 98, status: 'low' },
  { group: 'B+', donors: 3684, requests: 121, status: 'stable' },
  { group: 'B-', donors: 921, requests: 74, status: 'low' },
  { group: 'AB+', donors: 921, requests: 41, status: 'stable' },
  { group: 'AB-', donors: 554, requests: 39, status: 'low' },
];

export const CRM_DONOR_MIX = [
  { group: 'O+', value: 32 },
  { group: 'A+', value: 22 },
  { group: 'B+', value: 20 },
  { group: 'O-', value: 7 },
  { group: 'A-', value: 6 },
  { group: 'AB+', value: 5 },
  { group: 'B-', value: 5 },
  { group: 'AB-', value: 3 },
];

export const CRM_CITY_HOTSPOTS = [
  { city: 'Karachi', donors: 5342, requests: 48, status: 'critical' },
  { city: 'Lahore', donors: 4790, requests: 31, status: 'stable' },
  { city: 'Islamabad', donors: 2026, requests: 14, status: 'stable' },
  { city: 'Rawalpindi', donors: 1474, requests: 12, status: 'low' },
  { city: 'Faisalabad', donors: 1290, requests: 9, status: 'stable' },
  { city: 'Peshawar', donors: 1289, requests: 11, status: 'low' },
  { city: 'Multan', donors: 1105, requests: 8, status: 'stable' },
  { city: 'Quetta', donors: 920, requests: 7, status: 'stable' },
  { city: 'Hyderabad', donors: 737, requests: 6, status: 'stable' },
  { city: 'Gujranwala', donors: 553, requests: 5, status: 'low' },
  { city: 'Sialkot', donors: 368, requests: 3, status: 'stable' },
  { city: 'Bahawalpur', donors: 368, requests: 3, status: 'stable' },
];

export const CRM_EMERGENCY_REQUESTS = [
  {
    id: 'crm-req-1',
    bloodGroup: 'O-',
    hospital: 'Aga Khan University Hospital, Karachi',
    city: 'Karachi',
    patient: 'Imran Sheikh',
    urgency: 'Critical',
    units: 3,
    time: '42 min ago',
    status: 'Pending',
  },
  {
    id: 'crm-req-2',
    bloodGroup: 'A-',
    hospital: 'Mayo Hospital, Lahore',
    city: 'Lahore',
    patient: 'Sara Ahmed',
    urgency: 'Critical',
    units: 2,
    time: '1 hr ago',
    status: 'Pending',
  },
  {
    id: 'crm-req-3',
    bloodGroup: 'O+',
    hospital: 'PIMS, Islamabad',
    city: 'Islamabad',
    patient: 'Hina Raza',
    urgency: 'Urgent',
    units: 2,
    time: '3 hrs ago',
    status: 'Pending',
  },
  {
    id: 'crm-req-4',
    bloodGroup: 'B-',
    hospital: 'Lady Reading Hospital, Peshawar',
    city: 'Peshawar',
    patient: 'Yasir Khan',
    urgency: 'Urgent',
    units: 1,
    time: '5 hrs ago',
    status: 'Pending',
  },
  {
    id: 'crm-req-5',
    bloodGroup: 'AB-',
    hospital: 'Holy Family Hospital, Rawalpindi',
    city: 'Rawalpindi',
    patient: 'Ali Hassan',
    urgency: 'Critical',
    units: 2,
    time: '6 hrs ago',
    status: 'Pending',
  },
  {
    id: 'crm-req-6',
    bloodGroup: 'O-',
    hospital: 'Jinnah Postgraduate Medical Centre, Karachi',
    city: 'Karachi',
    patient: 'Nadia Malik',
    urgency: 'Critical',
    units: 4,
    time: '8 hrs ago',
    status: 'Approved',
  },
];

export const CRM_RECENT_DONATIONS = [
  {
    id: 'crm-don-1',
    donor: 'Ahmed Khan',
    bloodGroup: 'O+',
    city: 'Lahore',
    location: 'Mayo Hospital, Lahore',
    type: 'Whole Blood',
    volume: '450ml',
    date: '28 Aug 2026',
    status: 'Completed',
  },
  {
    id: 'crm-don-2',
    donor: 'Fatima Noor',
    bloodGroup: 'O+',
    city: 'Lahore',
    location: 'Shaukat Khanum Memorial Hospital, Lahore',
    type: 'Plasma',
    volume: '800ml',
    date: '27 Aug 2026',
    status: 'Completed',
  },
  {
    id: 'crm-don-3',
    donor: 'Hassan Ali',
    bloodGroup: 'A+',
    city: 'Karachi',
    location: 'Aga Khan University Hospital, Karachi',
    type: 'Whole Blood',
    volume: '450ml',
    date: '26 Aug 2026',
    status: 'Completed',
  },
  {
    id: 'crm-don-4',
    donor: 'Usman Tariq',
    bloodGroup: 'AB+',
    city: 'Rawalpindi',
    location: 'Holy Family Hospital, Rawalpindi',
    type: 'Platelets',
    volume: '300ml',
    date: '25 Aug 2026',
    status: 'Completed',
  },
  {
    id: 'crm-don-5',
    donor: 'Zainab Malik',
    bloodGroup: 'O-',
    city: 'Faisalabad',
    location: 'Allied Hospital, Faisalabad',
    type: 'Whole Blood',
    volume: '450ml',
    date: '24 Aug 2026',
    status: 'Completed',
  },
  {
    id: 'crm-don-6',
    donor: 'Sana Qureshi',
    bloodGroup: 'AB-',
    city: 'Multan',
    location: 'Nishtar Hospital, Multan',
    type: 'Whole Blood',
    volume: '450ml',
    date: '23 Aug 2026',
    status: 'Completed',
  },
];
