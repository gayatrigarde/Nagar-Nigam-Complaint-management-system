import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import complaintRoutes from "./routes/complaintRoute.js";
import adminRoute from "./routes/adminRoute.js";
import emailRoutes from './routes/emailRoute.js';
const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true,               
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api", adminRoute);
app.use('/api/email', emailRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Digital complaint System!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
