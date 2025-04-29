import express           from 'express';
import mongoose          from 'mongoose';
import dotenv            from 'dotenv';
import finRoutes         from './routes/financialRoutes.js';

import logger, { errorHandler } from './utils/logger.js'

const { info, error } = logger

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.sendStatus(200));

// Admin financial overview
app.use('/api/financials', finRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️  Connected to MongoDB');
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () =>
      info(`🔔 Payment Service running on port ${PORT}`)
    );
  })
  .catch(err => {
    error('❌ Mongo connection error:', err)
    process.exit(1)
  })
