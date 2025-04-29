// backend/delivery-service/src/routes/deliveryRoutes.js
import express from 'express'
import {
  getProfile,
  updateProfile,
  assignOrder,
  checkAvailability,
  updateAvailability
} from '../Controllers/deliveryController.js'
import { verifyToken, verifyRole } from '../Middleware/authMiddleware.js'

const router = express.Router()

router.post('/assign', verifyToken, assignOrder)

router.get('/profile', verifyToken, getProfile)
router.put(
  '/profile',
  verifyToken,
  verifyRole('delivery'),
  updateProfile
)

router.get('/availability/:id', verifyToken, checkAvailability)
router.put('/UpdateAvailability/:id', verifyToken, updateAvailability)

export default router
