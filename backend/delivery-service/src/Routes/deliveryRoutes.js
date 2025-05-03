const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  assignOrder,
  checkAvailability,
  updateAvailability,
} = require("./../Controllers/deliveryController");
const { verifyToken, verifyRole } = require("../Middleware/authMiddleware");

// Internal route: auto-assign driver to order
//http://delivery-service:4000/api/delivery/assign
router.post("/assign",verifyToken,assignOrder);

// Driver routes
// This route is used to fetch the profile of a driver
//http://delivery-service:4000/api/delivery/profile/:id
router.get("/profile", verifyToken, getProfile);

// This route is used to update the profile of a driver
//http://delivery-service:4000/api/delivery/profile
router.put(
  "/profile",
  verifyToken,
  verifyRole("deliveryPerson"),
  updateProfile
);

// This route is used to update the availability status of a driver
//http://delivery-service:4000/api/delivery/availability/:id
router.get("/availability/:id", checkAvailability);

// This route is used to toggle the availability status of a driver
//http://delivery-service:4000/api/delivery/UpdateAvailability/:id
router.put("/UpdateAvailability/:id", updateAvailability);

module.exports = router;
