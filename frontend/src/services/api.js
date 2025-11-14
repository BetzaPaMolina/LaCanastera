// frontend/src/services/api.js - VERSIÓN LOCALHOST
import axios from 'axios';

// ✅ URL LOCALHOST CORRECTA
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => {
    console.log('🔐 Intentando login...');
    return api.post('/auth/login', { username, password });
  },
  register: (userData) => {
    console.log('📝 Intentando registro...');
    return api.post('/auth/register', userData);
  },
};

// frontend/src/services/api.js - Añadir nueva función
export const userAPI = {
  getVendedores: () => api.get('/users/vendedores'),
  getActiveUsers: () => api.get('/users/active'), // ← NUEVA
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;