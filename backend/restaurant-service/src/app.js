import express           from 'express';
import mongoose          from 'mongoose';
import dotenv            from 'dotenv';
import adminRoutes       from './routes/adminRoutes.js';

import logger, { errorHandler } from './utils/logger.js'

const { info, error } = logger

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.sendStatus(200));

// Admin approval routes
app.use('/api/restaurants/admin', adminRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️  Connected to MongoDB');
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () =>
      info(`🔔 Restaurant Service running on port ${PORT}`)
    );
  })
  .catch(err => {
    error('❌ Mongo connection error:', err)
    process.exit(1)
  })