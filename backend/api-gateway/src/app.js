import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const {
  FRONTEND_URL,
  API_GATEWAY_PORT,
  USER_SERVICE_URL,
  RESTAURANT_SERVICE_URL,
  ORDER_SERVICE_URL,
  DELIVERY_SERVICE_URL,
  PAYMENT_SERVICE_URL,
  NOTIFICATION_SERVICE_URL
} = process.env;

const app = express();

// Enable CORS only from our front-end
app.use(cors({ origin: FRONTEND_URL || '*' }));

// Health-check endpoint
app.get('/health', (_req, res) => res.sendStatus(200));

// Proxy /api/auth → user-service **without** stripping the path
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug'
    // no pathRewrite: we want to forward /api/auth/register → /api/auth/register
  })
);

// All other user-service routes (strip `/api/users`)
app.use(
  '/api/users',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
    logLevel: 'debug'
  })
);

// Restaurant service (public & admin)
app.use(
  '/api/restaurants',
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/restaurants': '' },
    logLevel: 'debug'
  })
);

// Order service
app.use(
  '/api/orders',
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '' },
    logLevel: 'debug'
  })
);

// Delivery service
app.use(
  '/api/delivery',
  createProxyMiddleware({
    target: DELIVERY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/delivery': '' },
    logLevel: 'debug'
  })
);

// Payment service
app.use(
  '/api/payments',
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/payments': '' },
    logLevel: 'debug'
  })
);

// Financial overview (also payment service)
app.use(
  '/api/financials',
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/financials': '' },
    logLevel: 'debug'
  })
);

// Notification service (in-app, email, sms)
app.use(
  '/api/notifications',
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/notifications': '' },
    logLevel: 'debug'
  })
);

// Start the server
const port = API_GATEWAY_PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 API Gateway listening on port ${port}`);
});
