import axios from 'axios';

const NOTIF_BASE =
  (import.meta.env.VITE_NOTIFICATION_SERVICE_URL || '').trim() ||
  `${window.location.protocol}//${window.location.hostname}:3006`;

const api = axios.create({
  baseURL : `${NOTIF_BASE.replace(/\/$/, '')}/api/notifications`,
  headers : { 'Content-Type':'application/json' }
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const unwrap = p => p.then(r=>r.data)
                     .catch(err=>{
                        console.error('[notificationApi]', err?.response?.data ?? err.message);
                        throw err;
                     });

export const getUnreadCount       = () => unwrap(api.get('/unreadCount'));
export const getNotifications     = (page=1,limit=20) => unwrap(api.get('/', { params:{page,limit} }));
export const markNotification     = id => unwrap(api.patch(`/${id}/read`));
export const markAllNotifications = () => unwrap(api.patch('/markAllRead'));
