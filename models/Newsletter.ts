import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  signedUpAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
