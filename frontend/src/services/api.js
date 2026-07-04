import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.');
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      // Only redirect to login if this is NOT an auth request (login/register)
      // This allows validation errors on auth pages to be handled by the component
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/api/auth/login') || requestUrl.includes('/api/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('crm-token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
