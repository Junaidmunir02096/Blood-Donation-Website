import {
  deleteAdminDonor,
  deleteAdminRequest,
  deleteAdminUser,
  getAdminDonors,
  getAdminRequests,
  getAdminStats,
  getAdminUsers,
  updateAdminDonor,
  updateAdminRequest,
  updateAdminUser,
} from '../services/admin.service.js';

export const createAdminController = () => ({
  getUsers: async (request, response) => {
    const result = await getAdminUsers(request.validated.query);
    response.status(200).json({
      success: true,
      data: result,
    });
  },

  updateUser: async (request, response) => {
    const updated = await updateAdminUser(request.params.id, request.validated.body, request.user._id);
    response.status(200).json({
      success: true,
      data: updated,
      message: 'User updated successfully.',
    });
  },

  deleteUser: async (request, response) => {
    await deleteAdminUser(request.params.id, request.user._id);
    response.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  },

  getDonors: async (request, response) => {
    const result = await getAdminDonors(request.validated.query, request.user);
    response.status(200).json({
      success: true,
      data: result,
    });
  },

  updateDonor: async (request, response) => {
    const updated = await updateAdminDonor(request.params.id, request.validated.body, request.user);
    response.status(200).json({
      success: true,
      data: updated,
      message: 'Donor status updated successfully.',
    });
  },

  deleteDonor: async (request, response) => {
    await deleteAdminDonor(request.params.id);
    response.status(200).json({
      success: true,
      message: 'Donor profile deleted successfully.',
    });
  },

  getRequests: async (request, response) => {
    const result = await getAdminRequests(request.validated.query);
    response.status(200).json({
      success: true,
      data: result,
    });
  },

  updateRequest: async (request, response) => {
    const updated = await updateAdminRequest(request.params.id, request.validated.body);
    response.status(200).json({
      success: true,
      data: updated,
      message: 'Request status updated successfully.',
    });
  },

  deleteRequest: async (request, response) => {
    await deleteAdminRequest(request.params.id);
    response.status(200).json({
      success: true,
      message: 'Blood request deleted successfully.',
    });
  },

  getStats: async (_request, response) => {
    const stats = await getAdminStats();
    response.status(200).json({
      success: true,
      data: stats,
    });
  },
});
