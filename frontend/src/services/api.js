import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Barang API
export const barangAPI = {
  getAll: () => api.get('/barang'),
  getById: (id) => api.get(`/barang/${id}`),
  create: (data) => api.post('/barang', data),
  update: (id, data) => api.put(`/barang/${id}`, data),
  delete: (id) => api.delete(`/barang/${id}`),
};

// Pembeli API
export const pembeliAPI = {
  getAll: () => api.get('/pembeli'),
  search: (nama) => api.get(`/pembeli/search?nama=${nama}`),
  getById: (id) => api.get(`/pembeli/${id}`),
  create: (data) => api.post('/pembeli', data),
  update: (id, data) => api.put(`/pembeli/${id}`, data),
  delete: (id) => api.delete(`/pembeli/${id}`),
};

// Transaksi API
export const transaksiAPI = {
  getAll: () => api.get('/transaksi'),
  filter: (startDate, endDate) => api.get(`/transaksi/filter?startDate=${startDate}&endDate=${endDate}`),
  getById: (id) => api.get(`/transaksi/${id}`),
  create: (data) => api.post('/transaksi', data),
  update: (id, data) => api.put(`/transaksi/${id}`, data),
  delete: (id) => api.delete(`/transaksi/${id}`),
  cetak: (id) => api.get(`/transaksi/${id}/cetak`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;