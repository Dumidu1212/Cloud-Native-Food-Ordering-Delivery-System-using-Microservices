// src/services/adminApi.js
import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, headers: { 'Content-Type': 'application/json' }});
export const fetchUsers = (page = 1, limit = 20) => API.get('/api/users/admin/users', { params: { page, limit } });
export const updateUserStatus = (id, status) => API.patch(`/api/users/admin/users/${id}/status`, { status });
export const approveUser = id => API.post(`/api/users/admin/users/${id}/approve`);
export const deleteUser = id => API.delete(`/api/users/admin/users/${id}`);
export const fetchRestaurants = (page=1, limit=20) => API.get('/api/restaurants/admin', { params: { page, limit }});
export const updateRestaurantStatus = (id, status) => API.patch(`/api/restaurants/admin/${id}/status`, { status });
export const fetchFinancialOverview = () => API.get('/api/financials/overview');