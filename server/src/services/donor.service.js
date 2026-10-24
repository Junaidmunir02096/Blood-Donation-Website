import { Donor } from '../models/Donor.js';
import { AppError } from '../utils/AppError.js';

export const maskPhoneNumber = (phone) => {
  if (!phone) return null;
  // If formatted like 0300-1234567
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length >= 10) {
    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-4);
    return `${start}-***${end}`;
  }
  return phone;
};

export const generateInitials = (name) => {
  if (!name) return '??';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDonorResponse = (donor, currentUser) => {
  const isOwner = currentUser && donor.userId && String(donor.userId) === String(currentUser._id);
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canViewPhone = isOwner || isAdmin || (currentUser && donor.canContact && donor.status === 'verified');

  return {
    id: donor._id,
    name: donor.name,
    bloodGroup: donor.bloodGroup,
    city: donor.city,
    phone: canViewPhone ? donor.phone : maskPhoneNumber(donor.phone),
    canContact: donor.canContact,
    status: donor.status,
    lastDonated: donor.lastDonated ? donor.lastDonated.toISOString() : null,
    donations: donor.donationsCount || 0,
    lives: donor.livesSavedCount || 0,
    streak: donor.streak || 0,
    avatar: donor.avatar || generateInitials(donor.name),
    km: donor.km ?? null,
    userId: donor.userId ?? null,
    createdAt: donor.createdAt,
    updatedAt: donor.updatedAt,
  };
};

export const listDonors = async ({ bloodGroup, city, q, status, page = 1, limit = 20 }, currentUser) => {
  const query = {};

  // Visibility / status filtering:
  // Admins can filter by any status. Public/standard users only see verified donors,
  // plus their own profile if logged in.
  const isAdmin = currentUser && currentUser.role === 'admin';
  if (status && isAdmin) {
    query.status = status;
  } else if (!isAdmin) {
    if (currentUser) {
      query.$or = [{ status: 'verified' }, { userId: currentUser._id }];
    } else {
      query.status = 'verified';
    }
  }

  if (bloodGroup) {
    const normalizedGroup = bloodGroup.trim().replace(/\s+$/, '+');
    query.bloodGroup = normalizedGroup;
  }

  if (city) {
    query.city = { $regex: new RegExp(`^${city}$`, 'i') };
  }

  if (q) {
    query.$or = [
      ...(query.$or || []),
      { name: { $regex: new RegExp(q, 'i') } },
      { city: { $regex: new RegExp(q, 'i') } },
    ];
  }

  const skip = (page - 1) * limit;
  const [donors, total] = await Promise.all([
    Donor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donor.countDocuments(query),
  ]);

  return {
    donors: donors.map((donor) => formatDonorResponse(donor, currentUser)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getDonorById = async (id, currentUser) => {
  const donor = await Donor.findById(id);
  if (!donor) {
    throw new AppError(404, 'DONOR_NOT_FOUND', 'Donor profile not found.');
  }
  return formatDonorResponse(donor, currentUser);
};

export const registerOrUpdateDonor = async (user, data) => {
  let donor = await Donor.findOne({ userId: user._id });

  const parsedLastDonated = data.lastDonationDate ? new Date(data.lastDonationDate) : null;
  const avatar = generateInitials(data.name);

  if (donor) {
    donor.name = data.name;
    donor.bloodGroup = data.bloodGroup;
    donor.city = data.city;
    donor.phone = data.phone;
    donor.canContact = data.canContact ?? donor.canContact;
    if (parsedLastDonated && !isNaN(parsedLastDonated.getTime())) {
      donor.lastDonated = parsedLastDonated;
    }
    donor.avatar = avatar;
    await donor.save();
  } else {
    donor = await Donor.create({
      userId: user._id,
      name: data.name,
      bloodGroup: data.bloodGroup,
      city: data.city,
      phone: data.phone,
      canContact: data.canContact ?? true,
      status: 'pending',
      lastDonated: parsedLastDonated && !isNaN(parsedLastDonated.getTime()) ? parsedLastDonated : null,
      avatar,
    });
  }

  return formatDonorResponse(donor, user);
};

export const updateDonor = async (id, data, currentUser) => {
  const donor = await Donor.findById(id);
  if (!donor) {
    throw new AppError(404, 'DONOR_NOT_FOUND', 'Donor profile not found.');
  }

  const isOwner = donor.userId && String(donor.userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You can only update your own donor profile.');
  }

  if (data.name) {
    donor.name = data.name;
    donor.avatar = generateInitials(data.name);
  }
  if (data.bloodGroup) donor.bloodGroup = data.bloodGroup;
  if (data.city) donor.city = data.city;
  if (data.phone) donor.phone = data.phone;
  if (data.canContact !== undefined) donor.canContact = data.canContact;

  if (data.status) {
    if (!isAdmin) {
      throw new AppError(403, 'FORBIDDEN', 'Only administrators can change donor status.');
    }
    donor.status = data.status;
  }

  if (data.lastDonationDate) {
    const parsed = new Date(data.lastDonationDate);
    if (!isNaN(parsed.getTime())) donor.lastDonated = parsed;
  }

  await donor.save();
  return formatDonorResponse(donor, currentUser);
};
