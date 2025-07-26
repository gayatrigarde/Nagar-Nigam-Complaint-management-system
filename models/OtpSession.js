import mongoose from "mongoose";

const otpSessionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

export default mongoose.model("OtpSession", otpSessionSchema);
