import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
  },

  // Users endpoints
  users: {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.patch(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Equipment endpoints
  equipment: {
    getAll: (type) => api.get('/equipment', { params: { type } }),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (equipmentData) => api.post('/equipment', equipmentData),
    update: (id, equipmentData) => api.patch(`/equipment/${id}`, equipmentData),
    delete: (id) => api.delete(`/equipment/${id}`),
  },

  // Lands endpoints
  lands: {
    getAll: () => api.get('/lands'),
    getById: (id) => api.get(`/lands/${id}`),
    create: (landData) => api.post('/lands', landData),
    update: (id, landData) => api.patch(`/lands/${id}`, landData),
    delete: (id) => api.delete(`/lands/${id}`),
    getMyLands: () => api.get('/lands/my-lands'),
  },

  // Orders endpoints
  orders: {
    getAll: (status) => api.get('/orders', { params: { status } }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (orderData) => api.post('/orders', orderData),
    update: (id, orderData) => api.patch(`/orders/${id}`, orderData),
    delete: (id) => api.delete(`/orders/${id}`),
    getMyOrders: () => api.get('/orders/my-orders'),
  },

  // File upload endpoints
  uploadImage: (formData) => {
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Dashboard stats
  dashboard: {
    getStats: async () => {
      try {
        const [users, equipment, lands, orders] = await Promise.all([
          api.get('/users'),
          api.get('/equipment'),
          api.get('/lands'),
          api.get('/orders'),
        ]);

        return {
          totalUsers: users.data.length,
          totalEquipment: equipment.data.length,
          totalLands: lands.data.length,
          totalOrders: orders.data.length,
          totalRevenue: orders.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
  },
};

export default api;
