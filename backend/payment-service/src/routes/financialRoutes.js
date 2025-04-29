// backend/payment-service/src/routes/financialRoutes.js
import express        from 'express';
import { protect, authorize } from '../utils/authMiddleware.js';
import { getOverview }        from '../controllers/financialController.js';

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/overview', getOverview);

export default router;
