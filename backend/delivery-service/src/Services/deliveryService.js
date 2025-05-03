// Description: This file contains the service functions for the delivery person service.
const makeServiceRequest = require("./serviceRequest");
const DeliveryPerson = require("../Models/DeliveryPerson");

// Automatically assign an available delivery person to an order
const assignOrder = async (orderId, token = null) => {
  // 1. Find the first available delivery person
  console.log("inside delivery-service service folder");

  const availableDriver = await DeliveryPerson.findOne({
    isAvailable: true,
    status: "Active",
  }).sort({ updatedAt: 1 });

  if (!availableDriver) {
    throw new Error("No available delivery person found");
  }
  const availableDriverUserId = availableDriver.userId;

  const Driver = await DeliveryPerson.findOne({
    userId: availableDriverUserId,
  });

  deliveryPersonDriverId = Driver._id;
  
  console.log("Available driver found:", availableDriver.name);

  const order = await makeServiceRequest(
    "orderService",
    "GET",
    `/getOrder/${orderId}`,
    null,
    token
  );
  
  console.log("Order response from order-service:", order);  

  if (!order) {
    throw new Error("Order not found");
  }

  const orderLocation = order.restaurantLocation; 
  console.log("Order location:", orderLocation);
  console.log("Driver location:", availableDriver.location);
 
  const driverLocation = availableDriver.location; 
  const distance = calculateDistance(driverLocation, orderLocation);

  const maxDistance = 5; // in kilometers

  if (distance > maxDistance) {
    throw new Error("No available driver within the required range");
  }

  // 4. Assign the delivery person to the order via order-service
  const result = await makeServiceRequest(
    "orderService",
    "POST",
    `/assign/${orderId}`,
    {
      deliveryPersonUserId: availableDriverUserId,
      deliveryPersonDriverId: deliveryPersonDriverId,
    },
    token
  );

  console.log("Order assignment result:", result);

  // 5. Mark the driver as unavailable (optional)
  availableDriver.isAvailable = false;
  const assigningDelivery = await availableDriver.save();

  console.log("Driver availability updated:", assigningDelivery.isAvailable);

  return {
    message: "Order successfully assigned to delivery person",
    orderResult: result,
    deliveryPerson: {
      id: availableDriver._id,
      name: availableDriver.name,
      email: availableDriver.email,
    },
  };
};

const calculateDistance = (driverLocation, orderLocation) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Radius of Earth in km

  const lat1 = toRadians(driverLocation.lat);
  const lon1 = toRadians(driverLocation.lon);
  const lat2 = toRadians(orderLocation.lat);
  const lon2 = toRadians(orderLocation.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in kilometers
  return distance;
};

module.exports = {
  assignOrder,
};

