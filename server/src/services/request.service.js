import { BloodRequest } from '../models/BloodRequest.js';
import { AppError } from '../utils/AppError.js';

export const formatRequestResponse = (req) => ({
  id: req._id,
  bloodGroup: req.bloodGroup,
  hospital: req.hospital,
  patient: req.patient,
  neededBy: req.neededBy ? req.neededBy.toISOString() : null,
  units: req.units,
  component: req.component,
  status: req.status,
  urgency: req.urgency,
  location: req.location,
  contactNumber: req.contactNumber,
  email: req.email,
  note: req.note,
  userId: req.userId ? String(req.userId) : null,
  createdAt: req.createdAt,
  updatedAt: req.updatedAt,
});

export const listRequests = async ({ userId, bloodGroup, location, status, urgency, page = 1, limit = 20 }, currentUser) => {
  const query = {};

  if (userId) {
    if (userId === 'me' && currentUser) {
      query.userId = currentUser._id;
    } else {
      query.userId = userId;
    }
  }

  if (bloodGroup) {
    query.bloodGroup = bloodGroup.trim().replace(/\s+$/, '+');
  }
  if (urgency) query.urgency = urgency;
  if (status) {
    query.status = status;
  }

  if (location) {
    query.location = { $regex: new RegExp(`^${location}$`, 'i') };
  }

  const skip = (page - 1) * limit;
  const [requests, total] = await Promise.all([
    BloodRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    BloodRequest.countDocuments(query),
  ]);

  return {
    requests: requests.map(formatRequestResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getRequestById = async (id) => {
  const request = await BloodRequest.findById(id);
  if (!request) {
    throw new AppError(404, 'REQUEST_NOT_FOUND', 'Blood request not found.');
  }
  return formatRequestResponse(request);
};

export const createRequest = async (data, currentUser) => {
  const parsedNeededBy = new Date(data.neededBy);
  if (isNaN(parsedNeededBy.getTime())) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid needed-by date.', {
      neededBy: 'Needed-by must be a valid date.',
    });
  }

  const request = await BloodRequest.create({
    userId: currentUser ? currentUser._id : null,
    patient: data.patient,
    hospital: data.hospital,
    bloodGroup: data.bloodGroup,
    units: data.units || 1,
    component: data.component || 'Whole Blood',
    urgency: data.urgency || 'Urgent',
    neededBy: parsedNeededBy,
    location: data.location,
    contactNumber: data.contactNumber,
    email: data.email || (currentUser ? currentUser.email : null),
    note: data.note || '',
    status: 'Pending',
  });

  return formatRequestResponse(request);
};

export const updateRequest = async (id, data, currentUser) => {
  const request = await BloodRequest.findById(id);
  if (!request) {
    throw new AppError(404, 'REQUEST_NOT_FOUND', 'Blood request not found.');
  }

  const isOwner = request.userId && String(request.userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You do not have permission to update this request.');
  }

  if (data.status) {
    // Only admin or owner can change status
    if (data.status !== 'Cancelled' && !isAdmin) {
      throw new AppError(403, 'FORBIDDEN', 'Only administrators can approve or fulfill requests.');
    }
    request.status = data.status;
  }

  if (data.units) request.units = data.units;
  if (data.urgency) request.urgency = data.urgency;
  if (data.note !== undefined) request.note = data.note;

  if (data.neededBy) {
    const parsed = new Date(data.neededBy);
    if (!isNaN(parsed.getTime())) request.neededBy = parsed;
  }

  await request.save();
  return formatRequestResponse(request);
};

export const cancelRequest = async (id, currentUser) => {
  const request = await BloodRequest.findById(id);
  if (!request) {
    throw new AppError(404, 'REQUEST_NOT_FOUND', 'Blood request not found.');
  }

  const isOwner = request.userId && String(request.userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You can only cancel your own blood request.');
  }

  request.status = 'Cancelled';
  await request.save();
  return formatRequestResponse(request);
};
