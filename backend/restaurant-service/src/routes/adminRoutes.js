// backend/restaurant-service/src/routes/adminRoutes.js
import express        from 'express';
import { body, param }from 'express-validator';
import { protect, authorize } from '../utils/authMiddleware.js';
import validateRequest        from '../middlewares/validateRequest.js';
import {
  listAllRestaurants,
  updateRestaurantStatus
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authenticated admin
router.use(protect, authorize('admin'));

router.get(
  '/',
  listAllRestaurants
);

router.patch(
  '/:id/status',
  param('id').isMongoId(),
  body('status').isIn(['Pending','Active','Inactive']),
  validateRequest,
  updateRestaurantStatus
);

export default router;
