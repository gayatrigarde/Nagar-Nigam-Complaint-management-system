import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import OtpSession from "../models/OtpSession.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    await OtpSession.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const session = await OtpSession.findOne({ email });

    if (!session || session.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const { name } = req.body;
      user = new User({
        email,
        name: name || "Anonymous",
        password: "otp-login",
        isEmailVerified: true
      });
      await user.save();
    } else if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    await OtpSession.deleteOne({ email });

    res.status(200).json({ message: "OTP verified successfully. Please login now." });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { sendOtp, verifyOtp };
