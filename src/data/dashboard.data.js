/**
 * src/data/dashboard.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data for the Dashboard Overview — active blood requests and nearby donors.
 * Consumed by: DashboardOverview.jsx
 * Next step  : wrap in src/services/dashboard.service.js with fake async API.
 */

export const activeRequests = [
  {
    id: 'req-1',
    blood: 'O+',
    urgency: 'Critical',
    hospital: 'City General Hospital',
    distance: '12.0 miles away',
    time: '2 hrs ago',
    note: 'Surgery Patient',
  },
  {
    id: 'req-2',
    blood: 'A-',
    urgency: 'Routine',
    hospital: "Metro Children's Clinic",
    distance: '4.0 miles away',
    time: '5 hrs ago',
    note: 'Routine Supply',
  },
];

export const nearbyDonors = [
  { id: 'donor-1', name: 'Sarah Jenkins',  distance: '2.1 miles away', blood: 'O-', initials: 'SJ' },
  { id: 'donor-2', name: 'Marcus Thorne',  distance: '3.5 miles away', blood: 'B+', initials: 'MT' },
  { id: 'donor-3', name: 'Elena Rodriguez',distance: '5.0 miles away', blood: 'A+', initials: 'ER' },
];
