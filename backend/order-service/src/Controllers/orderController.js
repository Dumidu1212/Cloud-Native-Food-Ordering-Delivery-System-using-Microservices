const Order = require("./../Models/Order");
const orderService = require("../Services/orderService");
const axios = require("axios"); 

const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryLocation,
      restaurantLocation,
      paymentMethod,
    } = req.body;

    // 1. Create the order
    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryLocation,
      restaurantLocation,
      paymentMethod,
      paymentStatus: "Pending",
      status: "Pending",
    });

    const newOrderResponse = await newOrder.save();

    if(!newOrderResponse) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    console.log("✅ Order created:", newOrder._id);

    // 2. Notify delivery-service to assign a driver
    try {
      console.log("🚚 Notifying delivery service to assign a driver...");
      const deliveryServiceUrl = `${DELIVERY_SERVICE_URL}/assign`;

      console.log(`newOrder._id`, newOrder._id);
      console.log(`deliveryServiceUrl`, deliveryServiceUrl);      
      const assignResponse = await axios.post(
        deliveryServiceUrl,
        { orderId: newOrder._id },
        {
          headers: {
            Authorization: req.headers.authorization || "", // Forward JWT token if available
            "Content-Type": "application/json",
          },
        }
      );
            
      if(assignResponse.status !== 200) {
        return res.status(500).json({ message: "Failed to notify delivery service" });
      }

      console.log("🚚 Order assigned to delivery person:", assignResponse.data);
    } catch (assignErr) {
      console.error(
        "❌ Failed to assign order to delivery person:",
        assignErr.message
      );
      // Optional: you can return a warning message or save this info in order logs
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order); // This will be used by delivery-service
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get All Orders Error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getUnassignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPerson: null }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Unassigned Orders Error:", err.message);
    res.status(500).json({ message: "Failed to fetch unassigned orders" });
  }
};

const assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonUserId } = req.body;
    const {deliveryPersonDriverId} = req.body; 

    // 1. Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Ensure the order is not already assigned
    if (order.status === "Assigned") {
      return res.status(400).json({ message: "Order already assigned" });
    }

    // 3. Check if the delivery person is already assigned to another order
    const existingOrder = await Order.findOne({
      deliveryPerson: deliveryPersonDriverId,
      status: { $ne: "Delivered" },
    });


    if (existingOrder) {
      return res
        .status(400)
        .json({
          message: "Delivery person is already assigned to another order",
        });
    }

    // 4. Update the order with the assigned delivery person and change the status to 'Assigned'
    order.deliveryPerson = deliveryPersonDriverId;
    order.status = "Assigned";
    await order.save();

    // 5. Return success response
    res.status(200).json({
      message: "Delivery person assigned successfully",
      order,
    });
  } catch (err) {
    console.error("Error assigning delivery person:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Function to get assigned orders for a delivery person
const getAssignedOrders = async (req, res) => {
  console.log("Fetching assigned orders for delivery person");

  const deliveryPersonUserId = req.params.id; 
  const deliveryProfile = await axios.get(`${DELIVERY_SERVICE_URL}/profile`, {
    headers: {
      Authorization: req.headers.authorization || "", // Forward JWT token if available
      "Content-Type": "application/json",
    },
  });
  console.log("Delivery Profile:", deliveryProfile.data);

  const deliveryPersonDriverId = deliveryProfile.data._id; 
  
  try {
    const assignedOrders = await Order.find({
      deliveryPerson: deliveryPersonDriverId,
      status: "Assigned",
    });

    console.log("Assigned Orders:", assignedOrders);

    if (assignedOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No assigned orders found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned orders retrieved successfully",
      data: assignedOrders,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assigned orders",
      error: error.message,
    });
  }
};

const acceptOrder = async (req, res) => {
  console.log("Accepting order");
  try {
    const { deliveryPersonUserId } = req.body;
    const orderId = req.params.orderId;
    console.log("Accepting order ID:", orderId);
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const deliveryProfile = await axios.get(`${DELIVERY_SERVICE_URL}/profile`, {
      headers: {
        Authorization: req.headers.authorization || "", // Forward JWT token if available
        "Content-Type": "application/json",
      },
    });

    const deliveryPersonDriverId = deliveryProfile.data._id; 
    //If the order already has a delivery person assigned, and the currently assigned deliveryPerson is NOT the same as the one trying to accept it now, then reject it.
    if (
      order.deliveryPerson &&
      order.deliveryPerson.toString() !== deliveryPersonDriverId
    ) {
      return res.status(400).json({ message: "Order already accepted" });
    }

    // console.log("Order found:", order);
    order.deliveryPerson = deliveryPersonDriverId;
    order.status = "Accepted";

    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error accepting order" });
  }
};

const updateOrderStatus = async (req, res) => {

  try {
    const { deliveryPersonId, status } = req.body;
    const orderId = req.params.id;

    const deliveryProfile = await axios.get(`${DELIVERY_SERVICE_URL}/profile`, {
      headers: {
        Authorization: req.headers.authorization || "", // Forward JWT token if available
        "Content-Type": "application/json",
      },
    });
    const deliveryPersonDriverId = deliveryProfile.data._id;
    console.log("Delivery Person Driver ID:", deliveryPersonDriverId);
    console.log("Delivery Person ID from request body:", deliveryPersonId);

    const updatedOrder = await orderService.updateOrderStatus(orderId, status, deliveryPersonId);
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update Order Status Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const getDeliveryHistory = async (req, res) => {
  console.log("Fetching delivery history for delivery person");

  const { deliveryPersonUserId } = req.params;

  console.log("Delivery Person User ID:", deliveryPersonUserId);

  try {
    const deliveryProfile = await axios.get(`${DELIVERY_SERVICE_URL}/profile`, {
      headers: {
        Authorization: req.headers.authorization || "", // Forward JWT token if available
        "Content-Type": "application/json",
      },
    });

    const deliveryPersonDriverId = deliveryProfile.data._id;
    // Get the status from query parameters (e.g., "Delivered")
    const { status } = req.query;
    // Pass filters to the service (only including status here)
    const filters = { status };
    // Call the service to fetch the history
    const orders = await orderService.getDeliveryHistory(
      deliveryPersonDriverId,
      filters
    );
    console.log("Delivery History:", orders);

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Delivery History Error:", err.message);
    res.status(500).json({ message: "Error fetching delivery history" });
  }
};


// PUT /orders/decline/:orderId
const declineOrder = async (req, res) => {
  console.log("Declining order controller called");
  try {
    const orderId  = req.params.orderId;
    console.log("Declining order ID:", orderId);

    const deliveryPersonUserId = req.body; // Optional, for logging or verification
    console.log("Delivery Person ID:", deliveryPersonUserId);

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    console.log("Order found:", order);

    const deliveryProfile = await axios.get(
      `${DELIVERY_SERVICE_URL}/profile`, {
      headers: {
        Authorization: req.headers.authorization || "", // Forward JWT token if available
        "Content-Type": "application/json",
      },
    });

    const deliveryPersonDriverId = deliveryProfile.data._id; 

    if (
      !order.deliveryPerson ||
      order.deliveryPerson.toString() !== deliveryPersonDriverId
    ) 
    {
      return res
        .status(403)
        .json({ message: "You are not assigned to this order" });
    }

    // Update order: remove assignment and set status back to Pending

    order.deliveryPerson = null;
    order.status = "Pending";

    await order.save();

    res.status(200).json({
      message: "Order declined and set back to Pending",
      order,
    });
  } catch (error) {
    console.error("Error declining order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//devhara's part
  // Get all orders by restaurant ID
const getOrdersByRestaurantDev = async (req, res) => {
  try {
    const { restaurantId } = req.params;
  
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
  
    const orders = await Order.find({ restaurantID: restaurantId })
      .sort({ createdAt: -1 }) // Latest orders first
       
  
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by restaurant:", error.message);
    res.status(500).json({ message: "Failed to fetch orders for restaurant" });
  }
};
// Update order status by Order ID
const updateOrderStatusDev = async (req, res) => {
    try {
      const { id } = req.params; // order ID from URL
      const { status, updatedBy } = req.body; // new status and updater's userID
  
      // Validate input
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
    
      // Find the order
      const order = await Order.findById(id);
    
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    
      // Update order status
      order.orderStatus = status;
      order.lastUpdated = Date.now(); // update lastUpdated time
    
      // Push the status change to history
      order.statusHistory.push({
        status: status,
        timestamp: Date.now(),
        updatedBy: updatedBy || null, // optional field
      });
    
      await order.save();
    
      res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error.message);
      res.status(500).json({ message: "Failed to update order status" });
    }
};


module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  assignDeliveryPerson,
  getUnassignedOrders,

  getAssignedOrders,
  declineOrder,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,

  getOrdersByRestaurantDev,
  updateOrderStatusDev,
};