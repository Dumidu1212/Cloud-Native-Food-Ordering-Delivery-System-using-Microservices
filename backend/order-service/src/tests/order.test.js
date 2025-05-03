require("./setup");
const mongoose = require("mongoose");
const { createTestOrder } = require("./testUtils");
const Order = require("../Models/Order");

describe("Order Model", () => {
  it("should create a new order with default fields", async () => {
    const order = await createTestOrder();
    expect(order).toBeDefined();
    expect(order.total).toBe(10.99);
    expect(order.status).toBe("Pending");
    expect(order.deliveryLocation.type).toBe("Point");
    expect(order.restaurantLocation.coordinates.length).toBe(2);
    expect(order.lastUpdated).toBeInstanceOf(Date);
  });

  it("should initialize empty statusHistory array", async () => {
    const order = await createTestOrder();
    expect(Array.isArray(order.statusHistory)).toBe(true);
    expect(order.statusHistory.length).toBe(0);
  });
});
