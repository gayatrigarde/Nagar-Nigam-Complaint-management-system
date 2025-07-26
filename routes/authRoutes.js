import express from "express";
import {
  signup,
  login,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { googleLogin } from "../controllers/googleLoginController.js"; 
import { auth } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/google-login", googleLogin);  

router.get("/profile", auth, getUserProfile);

export default router;
