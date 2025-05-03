const Order = require("../Models/Order");
const mongoose = require("mongoose");
const createTestOrder = async (overrides = {}) => {
  const defaultData = {
    customer: new mongoose.Types.ObjectId(),
    restaurant: new mongoose.Types.ObjectId(),
    deliveryLocation: {
      type: "Point",
      coordinates: [80.7, 7.2],
    },
    restaurantLocation: {
      type: "Point",
      coordinates: [80.5, 7.1],
    },
    total: 10.99,
    status: "Pending",
    statusHistory: [],
    ...overrides,
  };

  const order = new Order({ ...defaultData, ...overrides });
  return await order.save();
};

module.exports = { createTestOrder };
