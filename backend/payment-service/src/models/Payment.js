import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    // (optional) link back to an order if you have an Order model
    orderId:        { type: Schema.Types.ObjectId, ref: 'Order' },

    // the amount charged
    amount:         { type: Number, required: true },

    // status of the payment
    status:         { 
      type: String, 
      enum: ['Paid', 'Pending', 'Failed'], 
      default: 'Pending' 
    },

    // (optional) method used, e.g. 'Stripe' or 'PayHere'
    method:         { type: String }
  },
  { timestamps: true }
);

export default model('Payment', paymentSchema);
