// src/middlewares/authMiddleware.js

import jwtPkg from 'jsonwebtoken';
const { verify } = jwtPkg;

import User from '../models/User.js';

/**
 * Verifies JWT and attaches `req.user`.
 */
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user  = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Guards routes by role.
 * @param  {...string} roles allowed roles
 */
export function verifyRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

/** Shortcut for admin-only */
export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
}

/** Shortcut for restaurant-only */
export function isRestaurant(req, res, next) {
  if (req.user.role !== 'restaurant') {
    return res.status(403).json({ message: 'Restaurants only' });
  }
  next();
}

/** Shortcut for customer-only */
export function isCustomer(req, res, next) {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Customers only' });
  }
  next();
}

/** Shortcut for delivery-person-only */
export function isDeliveryPerson(req, res, next) {
  if (req.user.role !== 'delivery') {
    return res.status(403).json({ message: 'Delivery personnel only' });
  }
  next();
}
