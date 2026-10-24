import {
  cancelRequest,
  createRequest,
  getRequestById,
  listRequests,
  updateRequest,
} from '../services/request.service.js';

export const createRequestController = () => ({
  getRequests: async (request, response) => {
    const result = await listRequests(request.validated.query, request.user);
    response.status(200).json({
      success: true,
      data: result,
    });
  },

  getRequestById: async (request, response) => {
    const reqData = await getRequestById(request.params.id);
    response.status(200).json({
      success: true,
      data: reqData,
    });
  },

  createRequest: async (request, response) => {
    const reqData = await createRequest(request.validated.body, request.user);
    response.status(201).json({
      success: true,
      data: reqData,
      message: 'Blood request submitted successfully.',
    });
  },

  updateRequest: async (request, response) => {
    const reqData = await updateRequest(request.params.id, request.validated.body, request.user);
    response.status(200).json({
      success: true,
      data: reqData,
      message: 'Blood request updated successfully.',
    });
  },

  cancelRequest: async (request, response) => {
    const reqData = await cancelRequest(request.params.id, request.user);
    response.status(200).json({
      success: true,
      data: reqData,
      message: 'Blood request cancelled successfully.',
    });
  },
});
