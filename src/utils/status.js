export const REQUEST_STATUS = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

export const DONOR_STATUS = {
  pending: 'pending',
  verified: 'verified',
};

export const normalizeRequestStatus = (status) => {
  const key = String(status || '').toLowerCase();
  if (key === 'approved') return REQUEST_STATUS.Approved;
  if (key === 'rejected') return REQUEST_STATUS.Rejected;
  return REQUEST_STATUS.Pending;
};

export const isPendingRequest = (status) =>
  normalizeRequestStatus(status) === REQUEST_STATUS.Pending;

export const requestBloodGroup = (req) => req?.bloodGroup || req?.blood || '—';

export const donorLastDonated = (donor) =>
  donor?.lastDonated || donor?.lastDonation || 'Not recorded';
