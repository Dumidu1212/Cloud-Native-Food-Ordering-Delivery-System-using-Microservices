import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  phone:  { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['Active','Inactive'], default: 'Active' }
}, { timestamps: true });

export default model('Admin', AdminSchema);
