// backend/user-service/src/routes/adminRoutes.js
import express      from 'express';
import { body, param } from 'express-validator';
import { protect, authorize } from '../services/adminService.js';
import validateRequest        from '../middlewares/validateRequest.js';
import {
  listAllUsers,
  getUserById,
  updateUserStatus,
  approveUser,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes must be authenticated + role="admin"
router.use(protect, authorize('admin'));

// List & paginate users
router.get(
  '/users',
  listAllUsers
);

// Get a single user
router.get(
  '/users/:id',
  param('id').isMongoId(),
  validateRequest,
  getUserById
);

// Update status
router.patch(
  '/users/:id/status',
  param('id').isMongoId(),
  body('status').isIn(['Pending','Active','Inactive']),
  validateRequest,
  updateUserStatus
);

// Approve user
router.post(
  '/users/:id/approve',
  param('id').isMongoId(),
  validateRequest,
  approveUser
);

// Delete user
router.delete(
  '/users/:id',
  param('id').isMongoId(),
  validateRequest,
  deleteUser
);

export default router;
