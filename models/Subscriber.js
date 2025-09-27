import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, unique: true },
    source: { type: String, default: 'newsletter', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Subscriber', subscriberSchema);
