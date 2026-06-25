/**
 * src/services/dashboard.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Dashboard overview widget data — reads from localStorage.
 * Swap for real API calls when backend is ready.
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Fetch summary data shown on the Dashboard Overview widget */
export const fetchDashboardData = async () => {
  await delay(400);

  const requests = readLS('ls_requests');
  const donors   = readLS('ls_donors');

  /* Active (pending) requests for dashboard overview */
  const activeRequests = requests
    .filter((r) => r.status === 'Pending')
    .slice(0, 5)
    .map((r) => ({
      id:       r.id,
      blood:    r.blood,
      urgency:  r.urgency  || 'Routine',
      hospital: r.hospital || r.hospitalName || 'Hospital',
      distance: r.distance || '—',
      time:     r.time     || 'Recently',
      note:     r.note     || r.urgency || 'Standard',
    }));

  /* Nearby donors — first 5 from the list */
  const nearbyDonors = donors.slice(0, 5).map((d) => ({
    id:       d.id,
    name:     d.name,
    distance: d.miles ? `${d.miles} miles away` : 'Nearby',
    blood:    d.bloodGroup,
    initials: d.avatar || (d.name || 'XX').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
  }));

  return { activeRequests, nearbyDonors };
};
