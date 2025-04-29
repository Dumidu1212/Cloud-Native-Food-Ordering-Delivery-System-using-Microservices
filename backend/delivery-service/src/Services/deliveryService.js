// backend/delivery-service/src/services/deliveryService.js

import makeServiceRequest from "./serviceRequest.js";
import DeliveryPerson     from "../Models/DeliveryPerson.js";   // default export!

// Automatically assign an available delivery person to an order
export async function assignOrder(orderId, token = null) {
  console.log("inside delivery-service service folder");

  // 1. Find the first available delivery person
  const availableDriver = await DeliveryPerson
    .findOne({ isAvailable: true, status: "Active" })
    .sort({ updatedAt: 1 });

  if (!availableDriver) {
    throw new Error("No available delivery person found");
  }

  console.log("Available driver found:", availableDriver.name);
  console.log("Driver ID:", availableDriver._id);

  // 2. Fetch the order from Order Service
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

  // 3. Check proximity
  const orderLocation  = order.restaurantLocation;   // { lat, lon }
  const driverLocation = availableDriver.location;   // { type: 'Point', coordinates: [lon, lat] }

  // convert Mongoose Point into { lat, lon }
  const [lon, lat] = driverLocation.coordinates;
  const distance = calculateDistance({ lat, lon }, orderLocation);

  const maxDistance = 5; // km
  if (distance > maxDistance) {
    throw new Error("No available driver within the required range");
  }

  // 4. Assign via Order Service
  const result = await makeServiceRequest(
    "orderService",
    "POST",
    `/assign/${orderId}`,
    { deliveryPersonId: availableDriver._id },
    token
  );
  console.log("Order assignment result:", result);

  // 5. Mark driver unavailable
  availableDriver.isAvailable = false;
  await availableDriver.save();
  console.log("Driver availability updated:", availableDriver.isAvailable);

  return {
    message: "Order successfully assigned",
    orderResult: result,
    deliveryPerson: {
      id: availableDriver._id,
      name: availableDriver.name,
      email: availableDriver.email,
    },
  };
}

function calculateDistance(driverLoc, orderLoc) {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371; // Earth radius km

  const dLat = toRad(orderLoc.lat - driverLoc.lat);
  const dLon = toRad(orderLoc.lon - driverLoc.lon);

  const a = Math.sin(dLat/2)**2
          + Math.cos(toRad(driverLoc.lat))
          * Math.cos(toRad(orderLoc.lat))
          * Math.sin(dLon/2)**2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
