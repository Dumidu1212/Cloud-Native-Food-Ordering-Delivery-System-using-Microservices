// backend/restaurant-service/src/controllers/adminController.js
import { StatusCodes } from 'http-status-codes';
import mongoose         from 'mongoose';
import ApiError         from '../utils/ApiError.js';
import Restaurant       from '../models/Restaurant.js';
import logger           from '../utils/logger.js';

const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes;
const { info, error } = logger;

/**
 * GET /api/restaurants/admin
 * List all restaurants, paginated.
 */
export async function listAllRestaurants(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10));
    const limit = Math.max(1, parseInt(req.query.limit ?? '20', 10));
    const skip  = (page - 1) * limit;

    const [ total, restaurants ] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.find()
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.status(OK).json({ page, limit, total, data: restaurants });
  } catch (err) {
    error('listAllRestaurants error:', err);
    next(err);
  }
}

/**
 * PATCH /api/restaurants/admin/:id/status
 * Approve or block a restaurant.
 */
export async function updateRestaurantStatus(req, res, next) {
  const { id }     = req.params;
  const { status } = req.body;
  const VALID = ['Pending','Active','Inactive'];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(BAD_REQUEST).json({ message: 'Invalid restaurant ID' });
  }
  if (!VALID.includes(status)) {
    return res
      .status(BAD_REQUEST)
      .json({ message: `status must be one of ${VALID.join(', ')}` });
  }

  try {
    const rest = await Restaurant.findById(id);
    if (!rest) {
      return res.status(NOT_FOUND).json({ message: 'Restaurant not found' });
    }

    rest.status = status;
    await rest.save();
    info(`Admin ${req.user.id} set restaurant ${id} → status=${status}`);

    res.status(OK).json({ id, status });
  } catch (err) {
    error('updateRestaurantStatus error:', err);
    next(err);
  }
}
