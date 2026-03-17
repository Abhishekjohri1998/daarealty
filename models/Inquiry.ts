import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  interest: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
