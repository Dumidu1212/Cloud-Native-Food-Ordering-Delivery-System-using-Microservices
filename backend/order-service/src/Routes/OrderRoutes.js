const express = require("express");
const router = express.Router();
const {verifyToken} = require("../Middleware/authMiddleware");
const validateOrderStatus = require("../Middleware/validateOrderStatus");
const {
  createOrder,
  getAllOrders,
  getUnassignedOrders,
  assignDeliveryPerson,

  getAssignedOrders,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
  declineOrder,
  getOrderById,

  getOrdersByRestaurantDev,
  updateOrderStatusDev,
} = require("../Controllers/orderController");
// These routes are specifically for the delivery-service to call

//http://order-service:4040/api/orders/create
router.post("/create",createOrder);

///http://order-service:4040/api/orders/
router.get("/",getAllOrders);

// hhtp://order-service:4040/api/orders/:orderId
router.get('/getOrder/:orderId', getOrderById);

//http://order-service:4040/api/orders/unassigned
router.get("/unassigned",getUnassignedOrders);

//http://order-service:4040/api/orders/assign/:orderId
router.post("/assign/:orderId",assignDeliveryPerson);

//http://order-service:4040/api/orders/getAssignedOrders/:id
router.get("/getAssignedOrders/:id", verifyToken, getAssignedOrders);

//http://order-service:4040/api/orders/accept/:orderId
router.post("/accept/:orderId",acceptOrder);

//http://order-service:4040/api/orders//update-status/:id
router.put("/update-status/:id", validateOrderStatus, updateOrderStatus);

//http://order-service:4040/api/orders/history
router.get("/history",getDeliveryHistory);

//http://order-service:4040/api/orders/decline/:orderId
router.put("/decline/:orderId",declineOrder);

//devhara's routes
// Get all orders by restaurant ID
router.get("/:restaurantId",getOrdersByRestaurantDev);

// Update order status
router.put("/update-status/:id",updateOrderStatusDev);


module.exports = router;
