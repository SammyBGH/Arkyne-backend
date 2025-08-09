import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  message: { type: String, required: true },
  source: { type: String, default: 'web' },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
