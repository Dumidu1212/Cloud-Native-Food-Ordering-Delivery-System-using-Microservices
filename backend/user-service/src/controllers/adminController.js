// backend/user-service/src/controllers/adminController.js

import { StatusCodes }          from 'http-status-codes';
import mongoose                 from 'mongoose';
import ApiError                 from '../utils/ApiError.js';
import asyncHandler             from '../middlewares/asyncHandler.js';
import User                     from '../models/User.js';
import Admin                    from '../models/Admin.js';
import Restaurant               from '../models/Restaurant.js';
import DeliveryPerson           from '../models/DeliveryPerson.js';
import Customer                 from '../models/Customer.js';
import logger                   from '../utils/logger.js';
import { dispatchNotification } from '../services/notificationService.js';

const { OK, BAD_REQUEST, NOT_FOUND, NO_CONTENT } = StatusCodes;
const { info, error } = logger;

// Helper to pick the right profile model
const profileModels = {
  admin:      Admin,
  restaurant: Restaurant,
  delivery:   DeliveryPerson,
  customer:   Customer,
};

/**
 * GET /api/users/admin/users
 * List all users (paginated), excluding sensitive fields.
 */
export const listAllUsers = asyncHandler(async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit = Math.max(1, parseInt(req.query.limit ?? '20', 10));
  const skip  = (page - 1) * limit;

  const [ total, users ] = await Promise.all([
    User.countDocuments(),
    User.find()
      .select('-password -__v')
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  res.status(OK).json({ page, limit, total, data: users });
});

/**
 * GET /api/users/admin/users/:id
 * Fetch a single user by ID.
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findById(id).select('-password -__v').lean();
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }

  res.status(OK).json({ data: user });
});

/**
 * PATCH /api/users/admin/users/:id/status
 * Update a user’s status and cascade to their profile.
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;
  const VALID = ['Pending','Active','Inactive'];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(BAD_REQUEST, 'Invalid user ID');
  }
  if (!VALID.includes(status)) {
    throw new ApiError(BAD_REQUEST, `status must be one of ${VALID.join(', ')}`);
  }

  // 1) Fetch & update base User
  const user = await User.findById(id).select('+name +email +phone +role');
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  user.status = status;
  await user.save();
  info(`Admin ${req.user.id} updated user ${id} → status=${status}`);

  // 2) Cascade to role‐specific profile
  const Profile = profileModels[user.role];
  if (Profile) {
    await Profile.updateOne({ userId: user._id }, { status });
    info(`Also updated ${user.role} profile status to ${status}`);
  }

  // 3) Fire‐and‐forget notifications
  const title      = 'Account Status Updated';
  const message    = `Hello ${user.name}, your account is now ${status}.`;
  const authHeader = req.headers.authorization;

  await Promise.all([
    dispatchNotification({ userId: user._id, type: 'in-app', payload: { title, message }, authHeader }),
    dispatchNotification({ userId: user._id, type: 'email',   payload: { title, message }, email: user.email, authHeader }),
    dispatchNotification({ userId: user._id, type: 'sms',     payload: { title, message }, phone: user.phone, authHeader }),
  ]);

  res.status(OK).json({ message: 'Status updated', user: { id: user._id, status } });
});

/**
 * POST /api/users/admin/users/:id/approve
 * Shortcut to set status = 'Active'.
 */
export const approveUser = asyncHandler(async (req, res, next) => {
  req.body.status = 'Active';
  return updateUserStatus(req, res, next);
});

/**
 * DELETE /api/users/admin/users/:id
 * Permanently delete a user and their profile.
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  info(`Admin ${req.user.id} deleted user ${id}`);

  // Optionally cascade profile deletion
  const Profile = profileModels[user.role];
  if (Profile) {
    await Profile.deleteOne({ userId: id });
    info(`Also deleted ${user.role} profile for user ${id}`);
  }

  res.sendStatus(NO_CONTENT);
});
