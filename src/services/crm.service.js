/**
 * src/services/crm.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * CRM Network Overview — frontend data access layer.
 *
 * Today  : composes mock snapshot (src/data/crm.data.js) + live localStorage
 *          overlays from AppDataContext (new donors / requests).
 * Tomorrow: replace the body of fetchCrmOverview with:
 *
 *   const res = await apiClient.get('/api/crm/overview', { params: filters });
 *   if (!res.ok) throw new Error(res.data?.message || 'Failed to load CRM');
 *   return res.data;
 *
 * MongoDB (future) would typically expose this as aggregations:
 *   Donor.aggregate([{ $match }, { $group: { _id: '$bloodGroup', count } }])
 *   Request.aggregate([{ $match: { status: 'Pending' } }, { $count }])
 *   Donation.aggregate([{ $match: { createdAt: { $gte, $lte } } }, { $group by month }])
 *
 * Do not read localStorage from React components — keep I/O here so the UI
 * stays a pure view of this DTO.
 */

import {
  CRM_KPIS_BY_PERIOD,
  CRM_DONATION_TREND,
  CRM_BLOOD_GROUP_AVAILABILITY,
  CRM_DONOR_MIX,
  CRM_CITY_HOTSPOTS,
  CRM_EMERGENCY_REQUESTS,
  CRM_RECENT_DONATIONS,
  CRM_CITY_SHARE,
  CRM_GROUP_SHARE,
} from '../data/crm.data';
import { DONOR_STATUS, isPendingRequest, requestBloodGroup } from '../utils/status';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const readLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const isSeedId = (id = '') => String(id).includes('-seed-');

const scale = (value, factor) => Math.max(0, Math.round(value * factor));

const clampShare = (map, key) => {
  if (!key || key === 'all') return 1;
  return map[key] ?? 1;
};

const overlayLiveCounts = (kpis) => {
  const donors = readLS('ls_donors');
  const requests = readLS('ls_requests');
  const users = readLS('ls_users');

  const extraDonors = donors.filter((d) => !isSeedId(d.id)).length;
  const extraUsers = users.filter((u) => !isSeedId(u.id) && u.role !== 'admin').length;
  const extraPending = requests.filter((r) => !isSeedId(r.id) && isPendingRequest(r.status)).length;
  const extraVerified = donors.filter(
    (d) => !isSeedId(d.id) && d.status === DONOR_STATUS.verified
  ).length;

  return {
    ...kpis,
    totalDonors: kpis.totalDonors + extraDonors + extraUsers,
    availableDonors: kpis.availableDonors + extraVerified,
    pendingRequests: kpis.pendingRequests + extraPending,
  };
};

const overlayLiveLists = (emergencies, donations, { city, bloodGroup }) => {
  const liveRequests = readLS('ls_requests')
    .filter((r) => !isSeedId(r.id) && isPendingRequest(r.status))
    .map((r) => ({
      id: r.id,
      bloodGroup: requestBloodGroup(r),
      hospital: r.hospital || r.hospitalName || 'Hospital',
      city: r.location || r.city || '',
      patient: r.patient || 'Patient',
      urgency: r.urgency || 'Urgent',
      units: r.units || 1,
      time: r.time || 'Just now',
      status: r.status || 'Pending',
    }));

  const liveDonations = readLS('ls_donations')
    .filter((d) => !isSeedId(d.id))
    .map((d) => ({
      id: d.id,
      donor: d.donor || d.donorName || 'Donor',
      bloodGroup: d.bloodGroup || '—',
      city: d.city || '',
      location: d.location || '—',
      type: d.type || 'Whole Blood',
      volume: d.volume || '450ml',
      date: d.date || 'Recently',
      status: d.status || 'Completed',
    }));

  const match = (row) => {
    const cityOk = city === 'all' || row.city === city;
    const groupOk = bloodGroup === 'all' || row.bloodGroup === bloodGroup;
    return cityOk && groupOk;
  };

  return {
    emergencyRequests: [...liveRequests, ...emergencies].filter(match).slice(0, 6),
    recentDonations: [...liveDonations, ...donations].filter(match).slice(0, 6),
  };
};

/**
 * @typedef {Object} CrmFilters
 * @property {'week'|'month'|'year'} [period]
 * @property {string} [city]        'all' or a Pakistan city
 * @property {string} [bloodGroup]  'all' or a blood group
 */

/**
 * Fetch the Network Overview DTO.
 * Signature is stable for the future API: same filters, same return shape.
 *
 * @param {CrmFilters} filters
 */
export const fetchCrmOverview = async (filters = {}) => {
  await delay(420);

  const period = filters.period || 'month';
  const city = filters.city || 'all';
  const bloodGroup = filters.bloodGroup || 'all';

  const factor = clampShare(CRM_CITY_SHARE, city) * clampShare(CRM_GROUP_SHARE, bloodGroup);
  const baseKpis = CRM_KPIS_BY_PERIOD[period] || CRM_KPIS_BY_PERIOD.month;

  const kpis = overlayLiveCounts({
    totalDonors: scale(baseKpis.totalDonors, factor),
    totalDonorsTrend: baseKpis.totalDonorsTrend,
    availableDonors: scale(baseKpis.availableDonors, factor),
    availableDonorsTrend: baseKpis.availableDonorsTrend,
    pendingRequests: scale(baseKpis.pendingRequests, factor),
    pendingRequestsTrend: baseKpis.pendingRequestsTrend,
    pendingMeta: baseKpis.pendingMeta,
    emergencies: Math.max(1, scale(baseKpis.emergencies, city === 'all' && bloodGroup === 'all' ? 1 : Math.max(factor, 0.2))),
    emergenciesTrend: baseKpis.emergenciesTrend,
    emergenciesMeta: baseKpis.emergenciesMeta,
  });

  const lists = overlayLiveLists(CRM_EMERGENCY_REQUESTS, CRM_RECENT_DONATIONS, {
    city,
    bloodGroup,
  });

  return {
    source: 'mock',
    generatedAt: new Date().toISOString(),
    filters: { period, city, bloodGroup },
    kpis,
    donationTrend: CRM_DONATION_TREND[period] || CRM_DONATION_TREND.month,
    bloodGroupAvailability: CRM_BLOOD_GROUP_AVAILABILITY.map((row) => ({
      ...row,
      donors: scale(row.donors, clampShare(CRM_CITY_SHARE, city)),
      requests: scale(row.requests, clampShare(CRM_CITY_SHARE, city)),
      highlight: bloodGroup === 'all' || row.group === bloodGroup,
    })),
    donorMix: CRM_DONOR_MIX,
    cityHotspots: CRM_CITY_HOTSPOTS.map((row) => ({
      ...row,
      highlight: city === 'all' || row.city === city,
    })),
    ...lists,
  };
};

const csvEscape = (value) => {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

/** Build a CSV of the current overview — no backend required. */
export const overviewToCsv = (overview) => {
  const lines = [
    ['LifeStream CRM Network Overview'],
    ['Generated', overview.generatedAt],
    ['Period', overview.filters?.period],
    ['City', overview.filters?.city],
    ['Blood group', overview.filters?.bloodGroup],
    [],
    ['KPI', 'Value', 'Trend %'],
    ['Total donors', overview.kpis.totalDonors, overview.kpis.totalDonorsTrend],
    ['Available donors', overview.kpis.availableDonors, overview.kpis.availableDonorsTrend],
    ['Pending requests', overview.kpis.pendingRequests, overview.kpis.pendingRequestsTrend],
    ['Emergency alerts', overview.kpis.emergencies, overview.kpis.emergenciesTrend],
    [],
    ['Blood group', 'Donors', 'Open requests', 'Status'],
    ...overview.bloodGroupAvailability.map((r) => [r.group, r.donors, r.requests, r.status]),
    [],
    ['City', 'Donors', 'Open requests', 'Status'],
    ...overview.cityHotspots.map((r) => [r.city, r.donors, r.requests, r.status]),
    [],
    ['Emergency — hospital', 'Group', 'Urgency', 'City', 'Time'],
    ...overview.emergencyRequests.map((r) => [r.hospital, r.bloodGroup, r.urgency, r.city, r.time]),
  ];

  return lines.map((row) => row.map(csvEscape).join(',')).join('\n');
};

export const downloadCrmCsv = (overview) => {
  const csv = overviewToCsv(overview);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lifestream-crm-${overview.filters?.period || 'month'}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
