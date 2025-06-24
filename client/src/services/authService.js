import axios from 'axios';

// Configurar axios con interceptor para incluir token
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las requests
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Registrar nuevo usuario (solo admin)
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export default api; 