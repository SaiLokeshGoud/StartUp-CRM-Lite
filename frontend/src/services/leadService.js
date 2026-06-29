import api from './api';

export async function getLeads(params) {
  const response = await api.get('/api/leads', { params });
  return response.data;
}

export async function createLead(leadData) {
  const response = await api.post('/api/leads', leadData);
  return response.data;
}

export async function updateLead(id, leadData) {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
}

export async function updateLeadStatus(id, status) {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
}

export async function deleteLead(id) {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
}

export async function getLeadStats() {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
}

export async function getMonthlyStats() {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
}
