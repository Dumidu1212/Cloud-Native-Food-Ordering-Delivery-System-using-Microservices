import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    address: {
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
    phone: { type: String, sparse: true },
    email: { type: String, required: true, unique: true },
    favoriteRestaurants: [
      { type: Schema.Types.ObjectId, ref: "Restaurant" },
    ],
    orderHistory: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
        date: { type: Date, default: Date.now },
        totalAmount: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

customerSchema.index({ address: "2dsphere" });


export default model("Customer", customerSchema);
