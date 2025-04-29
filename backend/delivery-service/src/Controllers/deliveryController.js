// backend/delivery-service/src/controllers/deliveryController.js
import DeliveryPerson from '../Models/DeliveryPerson.js'

/**
 * POST /api/delivery/assign
 */
export async function assignOrder(req, res, next) {
  try {
    const { orderId } = req.body
    const result = await deliveryService.assignOrder(orderId, req.token)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/delivery/profile
 */
export async function getProfile(req, res, next) {
  try {
    const driver = await DeliveryPerson.findOne({ userId: req.user._id })
    if (!driver) return res.status(404).json({ message: 'Profile not found' })
    res.json(driver)
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/delivery/profile
 */
export async function updateProfile(req, res, next) {
  try {
    const driver = await DeliveryPerson.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body },
      { new: true }
    )
    if (!driver) return res.status(404).json({ message: 'Profile not found' })
    res.json(driver)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/delivery/availability/:id
 */
export async function checkAvailability(req, res, next) {
  try {
    const driver = await DeliveryPerson.findById(req.params.id)
    if (!driver) return res.status(404).json({ message: 'Driver not found' })
    res.json({ isAvailable: driver.isAvailable })
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/delivery/UpdateAvailability/:id
 */
export async function updateAvailability(req, res, next) {
  try {
    const driver = await DeliveryPerson.findById(req.params.id)
    if (!driver) return res.status(404).json({ message: 'Driver not found' })
    driver.isAvailable = !driver.isAvailable
    await driver.save()
    res.json(driver)
  } catch (err) {
    next(err)
  }
}
