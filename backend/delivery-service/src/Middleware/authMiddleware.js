// backend/delivery-service/src/Middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// 🔐 Verifies and decodes JWT, attaches user to req
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user  = user;
    req.token = token; // if you need to forward it
    next();
  } catch (err) {
    console.error('Token middleware error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🎯 Allows only users with one of the listed roles
export const verifyRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: Insufficient role' });
  }
  next();
};

// 👤 Shortcut for admins
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};

// 🚚 Shortcut for delivery staff
export const isDeliveryPerson = (req, res, next) => {
  if (req.user?.role !== 'delivery') {
    return res.status(403).json({ message: 'Delivery personnel only' });
  }
  next();
};
