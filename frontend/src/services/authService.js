import api from './api';

export async function register(name, email, password) {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
}

export async function login(email, password) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

export async function googleLogin(token) {
  const response = await api.post('/api/auth/google', { token });
  return response.data;
}

export function logout() {
  localStorage.removeItem('crm-token');
}

export async function getProfile() {
  const response = await api.get('/api/auth/profile');
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
}
