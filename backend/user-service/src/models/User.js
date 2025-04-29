import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin','restaurant','delivery','customer'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending','Active','Inactive'],
    default: 'Pending'
  }
}, { timestamps: true });

export default model('User', UserSchema);
