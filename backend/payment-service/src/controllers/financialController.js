// backend/payment-service/src/controllers/financialController.js
import { StatusCodes } from 'http-status-codes';
import Payment         from '../models/Payment.js';
import logger          from '../utils/logger.js';

const { OK } = StatusCodes;
const { info, error } = logger;

export async function getOverview(req, res, next) {
  try {
    // 1) Total revenue (sum of paid amounts)
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2) Pending payouts (sum of pending amounts)
    const pendingResult = await Payment.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingPayouts = pendingResult[0]?.total || 0;

    // 3) Transaction counts
    const transactionCount = await Payment.countDocuments();
    const paidCount        = await Payment.countDocuments({ status: 'Paid' });
    const pendingCount     = await Payment.countDocuments({ status: 'Pending' });

    info('Fetched financial overview');
    res.status(OK).json({
      totalRevenue,
      pendingPayouts,
      transactionCount,
      paidCount,
      pendingCount
    });
  } catch (err) {
    error('getOverview error:', err);
    next(err);
  }
}
