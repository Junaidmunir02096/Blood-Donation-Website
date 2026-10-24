import {
  getDonorById,
  listDonors,
  registerOrUpdateDonor,
  updateDonor,
} from '../services/donor.service.js';

export const createDonorController = () => ({
  getDonors: async (request, response) => {
    const result = await listDonors(request.validated.query, request.user);
    response.status(200).json({
      success: true,
      data: result,
    });
  },

  getDonorById: async (request, response) => {
    const donor = await getDonorById(request.params.id, request.user);
    response.status(200).json({
      success: true,
      data: donor,
    });
  },

  registerDonor: async (request, response) => {
    const donor = await registerOrUpdateDonor(request.user, request.validated.body);
    response.status(201).json({
      success: true,
      data: donor,
      message: 'Donor profile saved successfully.',
    });
  },

  updateDonor: async (request, response) => {
    const donor = await updateDonor(request.params.id, request.validated.body, request.user);
    response.status(200).json({
      success: true,
      data: donor,
      message: 'Donor profile updated successfully.',
    });
  },
});
