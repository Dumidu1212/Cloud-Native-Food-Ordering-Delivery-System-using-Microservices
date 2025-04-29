import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "restaurant", "delivery", "customer"], required: true },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
