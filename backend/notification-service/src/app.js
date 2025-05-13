// ── src/app.js ─────────────────────────────────────────────────────────────────
import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';
import dotenv   from 'dotenv';

import notificationRoutes from './routes/notificationRoutes.js';
import { protect }        from './services/authService.js';
import { errorHandler }   from './utils/logger.js';          // <- same logger you used

dotenv.config();

const {
  MONGODB_URI,
  PORT          = 3006,
  CLIENT_ORIGIN = 'http://localhost:5173'   // → adjust / comma-separate for many
} = process.env;

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();

// ―–– middleware
app.use(cors({ origin: CLIENT_ORIGIN.split(','), optionsSuccessStatus: 200 }));
app.use(express.json());

// ―–– health check
app.get('/health', (_req, res) => res.sendStatus(200));

// ―–– protected routes
app.use('/api/notifications', protect, notificationRoutes);

// ―–– central error-handler (must be last)
app.use(errorHandler);

// ── Mongo + start server ──────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🗄️  MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🔔 Notification-service listening on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  });
