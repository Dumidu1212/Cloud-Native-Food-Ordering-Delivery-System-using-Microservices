// backend/restaurant-service/src/models/Restaurant.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const itemSchema = new Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const restaurantSchema = new Schema({
  userId:          { type: Types.ObjectId, ref: 'User', required: true },
  restaurantName:  { type: String, required: true },
  restaurantOwner: { type: String, required: true },
  address:         { type: String, required: true },
  phone:           { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  category:        { type: String, required: true },
  items:           [itemSchema],
  status:          { 
    type: String, 
    enum: ['Pending','Active','Inactive'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);