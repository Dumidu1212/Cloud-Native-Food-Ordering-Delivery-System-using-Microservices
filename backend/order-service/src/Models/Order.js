const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      default: null,
    },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String, // Snapshot in case name changes later

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    // Delivery destination
    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // Restaurant origin location
    restaurantLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Accepted",
        "PickedUp",
        "Delivered",
        "Placed",
        "Preparing",
        "On the way",
        "Ready for Pickup",
        "OnTheWay",
      ],
      default: "Placed",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryTimeEstimate: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    cancellationReason: {
      type: String,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Credit Card", "UPI", "Net Banking"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Add geospatial index
orderSchema.index({ restaurantLocation: "2dsphere" });
orderSchema.index({ deliveryLocation: "2dsphere" });

module.exports = mongoose.model("Order", orderSchema);
