import express from 'express';
import { submitComplaint, getComplaintById, getComplaintsByUser, deleteUserComplaint,getUserDetails } from '../controllers/complaintController.js';
import upload from '../middleware/upload.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/complaint/:id', getComplaintById);
router.get('/my-complaints', auth, authorize(['user']), getComplaintsByUser);
router.delete('/delete/:id', auth, authorize(['user']), deleteUserComplaint);
router.post('/submit-complaint', auth, upload.single('image'), submitComplaint);
router.get('/user/:id', getUserDetails); 

export default router;
