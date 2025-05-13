import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import { createProxyMiddleware } from 'http-proxy-middleware'

// --- 1) Validate required env vars ---
const {
  API_GATEWAY_PORT,
  FRONTEND_URL,
  USER_SERVICE_URL,
  RESTAURANT_SERVICE_URL,
  ORDER_SERVICE_URL,
  DELIVERY_SERVICE_URL,
  PAYMENT_SERVICE_URL,
  NOTIFICATION_SERVICE_URL
} = process.env

const missing = [
  ['USER_SERVICE_URL', USER_SERVICE_URL],
  ['RESTAURANT_SERVICE_URL', RESTAURANT_SERVICE_URL],
  ['ORDER_SERVICE_URL', ORDER_SERVICE_URL],
  ['DELIVERY_SERVICE_URL', DELIVERY_SERVICE_URL],
  ['PAYMENT_SERVICE_URL', PAYMENT_SERVICE_URL],
  ['NOTIFICATION_SERVICE_URL', NOTIFICATION_SERVICE_URL],
]
  .filter(([,v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`)
  process.exit(1)
}

// --- 2) Create Express app & global middleware ---
const app = express()
app.use(helmet())                              // security headers
app.use(compression())                         // gzip
app.use(cors({ origin: FRONTEND_URL || '*' })) // CORS
app.use(express.json())                        // JSON body parser
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))                    // access logs

// --- 3) Health check ---
app.get('/health', (_req, res) => res.sendStatus(200))

// --- 4) Proxy factory ---
function makeProxy(path, target, stripPrefix = true) {
  return createProxyMiddleware({
    context: path,
    target,
    changeOrigin: true,
    // only strip if your service mounts its own routes at "/"
    pathRewrite: stripPrefix ? { [`^${path}`]: '' } : undefined,
    logLevel: 'warn',
    onError(err, _req, res) {
      console.error(`❌ Proxy error on "${path}" → ${target}:`, err.message)
      res.status(502).json({ error: 'Bad gateway' })
    }
  })
}

// --- 5) Mount your microservices ---
// **Auth** (needs full `/api/auth/...`)
app.use( makeProxy('/api/auth',         USER_SERVICE_URL,       false) )
// **User‐Service Admin** (keep `/api/users/...`)
app.use( makeProxy('/api/users',        USER_SERVICE_URL,       false) )
// **Restaurants Admin** (keep `/api/restaurants/...`)
app.use( makeProxy('/api/restaurants',  RESTAURANT_SERVICE_URL, false) )

// Everything else you can strip if the downstream service mounts at `/`
app.use( makeProxy('/api/orders',       ORDER_SERVICE_URL,      true ) )
app.use( makeProxy('/api/delivery',     DELIVERY_SERVICE_URL,   true ) )
app.use( makeProxy('/api/payments',     PAYMENT_SERVICE_URL,    true ) )
app.use( makeProxy('/api/financials',   PAYMENT_SERVICE_URL,    true ) )
app.use( makeProxy('/api/notifications',NOTIFICATION_SERVICE_URL,true ) )

// --- 6) 404 & global error handlers ---
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// --- 7) Start listening ---
const port = parseInt(API_GATEWAY_PORT, 10) || 3000
app.listen(port, () => {
  console.info(`🚀 API Gateway listening on port ${port}`)
})
