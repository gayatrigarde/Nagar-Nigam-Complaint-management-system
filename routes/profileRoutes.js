import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js"; 

const router = express.Router();

router.get("/", auth, getUserProfile);
router.put("/", auth, updateUserProfile);
router.delete("/", auth, deleteUserProfile);

export default router;

