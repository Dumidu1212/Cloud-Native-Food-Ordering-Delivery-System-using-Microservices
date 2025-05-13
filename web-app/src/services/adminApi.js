import axios from 'axios';

/* ───────────────────────── helper ───────────────────────── */
function apiFor(baseURL) {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
  });

  instance.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  return instance;
}

/* ───────────────────── micro-services ───────────────────── */
const USER_SVC = apiFor(
  import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001'
);
const PAYMENT_SVC = apiFor(
  import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3005'
);

/* ──────────────── USER / ACCOUNT MANAGEMENT ─────────────── */
export const fetchUsers = (page = 1, limit = 20, role) =>
  USER_SVC.get('/api/users/admin/users', { params: { page, limit, role } })
          .then(r => r.data);

export const updateUserStatus = (id, status) =>
  USER_SVC.patch(`/api/users/admin/users/${id}/status`, { status });

export const approveUser  = id =>
  USER_SVC.post(`/api/users/admin/users/${id}/approve`);

export const deleteUser   = id =>
  USER_SVC.delete(`/api/users/admin/users/${id}`);

/* ─────────────── DELIVERY PERSON HELPERS ─────────────── */
export const fetchDeliveryPersons       = (p = 1, l = 20) => fetchUsers(p, l, 'delivery').then(r => r.data);
export const updateDeliveryPersonStatus = updateUserStatus;
export const approveDeliveryPerson      = approveUser;
export const deleteDeliveryPerson       = deleteUser;

/* ─────────────── RESTAURANT HELPERS ( same idea ) ─────────────── */
export const fetchRestaurants       = (p = 1, l = 20) => fetchUsers(p, l, 'restaurant').then(r => r.data);
export const updateRestaurantStatus = updateUserStatus;     // same endpoint
export const approveRestaurant      = approveUser;
export const deleteRestaurant       = deleteUser;

/* ─────────────── FINANCIAL OVERVIEW ─────────────── */
export const fetchFinancialOverview = () =>
  PAYMENT_SVC.get('/api/financials/overview').then(r => r.data);
