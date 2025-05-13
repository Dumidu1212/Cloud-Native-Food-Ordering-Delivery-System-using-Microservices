import express      from 'express';
import { body, param } from 'express-validator';

import {
  listAllUsers,
  getUserById,
  updateUserStatus,
  approveUser,
  deleteUser,
  findUserIdFromProfile                // ← helper just added
} from '../controllers/adminController.js';

import { protect, authorize } from '../services/adminService.js';
import validateRequest        from '../middlewares/validateRequest.js';
import ApiError               from '../utils/ApiError.js';

const router = express.Router();

// All admin APIs must be authenticated + role = admin
router.use(protect, authorize('admin'));

/* ────────────────────────────  USER ENDPOINTS ─────────────────────────── */

router.get('/users', listAllUsers);

router.get(
  '/users/:id',
  param('id').isMongoId(),
  validateRequest,
  getUserById
);

router.patch(
  '/users/:id/status',
  param('id').isMongoId(),
  body('status').isIn(['Pending', 'Active', 'Inactive']),
  validateRequest,
  updateUserStatus
);

router.post(
  '/users/:id/approve',
  param('id').isMongoId(),
  validateRequest,
  approveUser
);

router.delete(
  '/users/:id',
  param('id').isMongoId(),
  validateRequest,
  deleteUser
);

/* ─────────────────────────  PROFILE-STATUS ENDPOINT  ─────────────────────
   Allows the front-end to PATCH restaurant / delivery profiles directly.
   PATCH /api/users/admin/profile/:role/:profileId/status
   Body: { "status": "Active" | "Inactive" | "Pending" }
   ----------------------------------------------------------------------- */

router.patch(
  '/profile/:role/:id/status',
  param('role').isIn(['restaurant', 'delivery']),
  param('id').isMongoId(),
  body('status').isIn(['Pending', 'Active', 'Inactive']),
  validateRequest,
  async (req, res, next) => {
    try {
      const { role, id: profileId } = req.params;
      const userId = await findUserIdFromProfile(profileId, role);
      if (!userId) throw new ApiError(404, 'Profile not found');

      // Delegate to the canonical updater
      req.params.id = userId;
      return updateUserStatus(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
