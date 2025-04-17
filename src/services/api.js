import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    toast.error(error.response?.data?.message || 'An error occurred');
    return Promise.reject(error);
  }
);

export const auth = {
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verify2FA: async (otp, email) => {
    const response = await api.post('/auth/verify-2fa', { otp, email });
    return response.data;
  },

  enable2FA: async () => {
    const response = await api.post('/auth/enable-2fa');
    return response.data;
  },

  disable2FA: async () => {
    const response = await api.post('/auth/disable-2fa');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await api.put('/auth/user', userData);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.patch(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

export const flights = {
  search: async (searchParams) => {
    const response = await api.get('/flights/search', { params: searchParams });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },

  create: async (flightData) => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  createBulk: async (flightsData) => {
    const response = await api.post('/flights/bulk', flightsData);
    return response.data;
  },
};

export const bookings = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}`);
    return response.data;
  }
};

export const user = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
  
  updatePassword: async (data) => {
    const response = await api.patch('/users/password', data);
    return response.data;
  },
  
  toggleTwoFactor: async () => {
    const response = await api.patch('/users/toggle-2fa');
    return response.data;
  }
};

export default api; 