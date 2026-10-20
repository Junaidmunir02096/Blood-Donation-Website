export const toUserResponse = (user) => ({
  id: String(user._id),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  city: user.city,
  bloodGroup: user.bloodGroup,
  role: user.role,
  status: user.status,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
