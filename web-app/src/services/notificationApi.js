// src/services/notificationApi.js
import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, headers: { 'Content-Type': 'application/json' }});
export const fetchUnreadCount = () => API.get('/api/notifications/unreadCount');
export const fetchNotifications = (page=1, limit=20) => API.get('/api/notifications', { params: { page, limit }});
export const markNotificationAsRead = id => API.patch(`/api/notifications/${id}/read`);
