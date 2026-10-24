import { User } from '../models/User.js';
import { Donor } from '../models/Donor.js';
import { BloodRequest } from '../models/BloodRequest.js';
import { AppError } from '../utils/AppError.js';
import { formatDonorResponse } from './donor.service.js';
import { formatRequestResponse } from './request.service.js';

export const getAdminUsers = async ({ q, status, page = 1, limit = 50 }) => {
  const query = {};

  if (status) query.status = status;
  if (q) {
    query.$or = [
      { fullName: { $regex: new RegExp(q, 'i') } },
      { email: { $regex: new RegExp(q, 'i') } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users: users.map((u) => ({
      id: u._id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      city: u.city,
      bloodGroup: u.bloodGroup,
      role: u.role,
      status: u.status,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const updateAdminUser = async (userId, data, currentAdminId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found.');
  }

  if (String(user._id) === String(currentAdminId) && data.role && data.role !== 'admin') {
    throw new AppError(400, 'OPERATION_NOT_ALLOWED', 'Administrators cannot remove their own admin privileges.');
  }

  if (data.role) user.role = data.role;
  if (data.status) user.status = data.status;

  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    bloodGroup: user.bloodGroup,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
};

export const deleteAdminUser = async (userId, currentAdminId) => {
  if (String(userId) === String(currentAdminId)) {
    throw new AppError(400, 'OPERATION_NOT_ALLOWED', 'You cannot delete your own account while acting as administrator.');
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found.');
  }

  // Also clean up linked donor record if any
  await Donor.deleteMany({ userId });

  return { success: true };
};

export const getAdminDonors = async ({ q, status, page = 1, limit = 50 }, adminUser) => {
  const query = {};

  if (status) query.status = status;
  if (q) {
    query.$or = [
      { name: { $regex: new RegExp(q, 'i') } },
      { city: { $regex: new RegExp(q, 'i') } },
      { phone: { $regex: new RegExp(q, 'i') } },
    ];
  }

  const skip = (page - 1) * limit;
  const [donors, total] = await Promise.all([
    Donor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donor.countDocuments(query),
  ]);

  return {
    donors: donors.map((d) => formatDonorResponse(d, adminUser)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const updateAdminDonor = async (donorId, data, adminUser) => {
  const donor = await Donor.findById(donorId);
  if (!donor) {
    throw new AppError(404, 'DONOR_NOT_FOUND', 'Donor profile not found.');
  }

  if (data.status) donor.status = data.status;
  if (data.canContact !== undefined) donor.canContact = data.canContact;

  await donor.save();
  return formatDonorResponse(donor, adminUser);
};

export const deleteAdminDonor = async (donorId) => {
  const donor = await Donor.findByIdAndDelete(donorId);
  if (!donor) {
    throw new AppError(404, 'DONOR_NOT_FOUND', 'Donor not found.');
  }
  return { success: true };
};

export const getAdminRequests = async ({ q, status, page = 1, limit = 50 }) => {
  const query = {};

  if (status) query.status = status;
  if (q) {
    query.$or = [
      { patient: { $regex: new RegExp(q, 'i') } },
      { hospital: { $regex: new RegExp(q, 'i') } },
      { location: { $regex: new RegExp(q, 'i') } },
    ];
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

export const updateAdminRequest = async (requestId, data) => {
  const request = await BloodRequest.findById(requestId);
  if (!request) {
    throw new AppError(404, 'REQUEST_NOT_FOUND', 'Blood request not found.');
  }

  if (data.status) request.status = data.status;
  await request.save();

  return formatRequestResponse(request);
};

export const deleteAdminRequest = async (requestId) => {
  const request = await BloodRequest.findByIdAndDelete(requestId);
  if (!request) {
    throw new AppError(404, 'REQUEST_NOT_FOUND', 'Blood request not found.');
  }
  return { success: true };
};

export const getAdminStats = async () => {
  const [pendingRequests, totalDonors, verifiedDonors, totalUsers] = await Promise.all([
    BloodRequest.countDocuments({ status: 'Pending' }),
    Donor.countDocuments(),
    Donor.countDocuments({ status: 'verified' }),
    User.countDocuments(),
  ]);

  return {
    pendingRequests,
    totalDonors,
    verifiedDonors,
    totalUsers,
    totalLitres: (verifiedDonors * 0.45).toFixed(1),
  };
};
