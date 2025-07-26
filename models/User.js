
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: "user", 
  },
  resetOTP: {        
    type: String,
    default: null
  },
  isEmailVerified: {
  type: Boolean,
  default: false
  },
  otpExpiry: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
