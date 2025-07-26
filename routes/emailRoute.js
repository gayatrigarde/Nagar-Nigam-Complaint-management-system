import express from 'express';
import { sendComplaintEmail } from '../controllers/emailController.js';

const router = express.Router();
router.post('/send-email', sendComplaintEmail);
export default router;
