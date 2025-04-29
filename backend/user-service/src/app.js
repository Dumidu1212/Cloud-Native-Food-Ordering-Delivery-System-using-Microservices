// backend/user-service/src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes  from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import logger, { errorHandler } from './utils/logger.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const { info, error } = logger;

// Health-check
app.get('/health', (_req, res) => res.sendStatus(200));

// Public/auth routes
app.use('/api/auth', authRoutes);

// Admin-only routes (protected inside those routers)
app.use('/api/users/admin', adminRoutes);

// Global error handler (must come after all routes)
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️ Connected to MongoDB');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      info(`👤 User Service listening on port ${PORT}`)
    );
  })
  .catch((err) => {
    error('❌ Mongo connection error:', err);
    process.exit(1);
  });
