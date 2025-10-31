import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002'; // Backend API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration or invalid tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error is 401 Unauthorized and not a login/refresh request, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally, redirect to login page or show a message
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    // Clear token on client side
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { message: 'Logged out successfully' };
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

const equipmentService = {
  getAll: async () => {
    const response = await api.get('/equipment');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/equipment', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/equipment/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },
};

const landsService = {
  getAll: async () => {
    const response = await api.get('/lands');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/lands/${id}`);
    return response.data;
  },
  getMyLands: async () => {
    const response = await api.get('/lands/my-lands');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/lands', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/lands/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/lands/${id}`);
    return response.data;
  },
};

const ordersService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

const usersService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

const contactService = {
  create: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/contact/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

const apiService = {
  auth: authService,
  equipment: equipmentService,
  lands: landsService,
  orders: ordersService,
  users: usersService,
  contact: contactService,
};

export default apiService;
