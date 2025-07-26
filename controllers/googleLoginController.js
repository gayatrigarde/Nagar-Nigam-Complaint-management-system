import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
const SECRET_KEY = process.env.JWT_SECRET || "your-secret"; 

export const googleLogin = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not registered. Please signup first before using Google Sign-In.",
      });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role, id: user._id },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
