/**
 * API Client for LifeStream Frontend
 * Communicates with the Express backend at VITE_API_BASE_URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important: sends cookies with requests
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, data.error?.message || data.message || 'Request failed', data.error);
      }

      return { ok: true, data: data.data || data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error.message || 'Network error', { code: 'NETWORK_ERROR' });
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(status, message, errorDetails = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = errorDetails.code || 'UNKNOWN_ERROR';
    this.fields = errorDetails.fields || null;
  }
}

export const apiClient = new ApiClient();

// Auth-specific API methods
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  session: () => apiClient.get('/auth/session'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};

// Health check
export const healthApi = {
  check: () => apiClient.get('/health'),
};

export default apiClient;