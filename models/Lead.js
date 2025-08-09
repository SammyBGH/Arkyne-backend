import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, default: null, trim: true },
  phone: { type: String, default: null, trim: true },
  message: { type: String, required: true, trim: true },
  source: { type: String, default: 'web', trim: true },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
