import express from 'express';
import { auth,authorize } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAllComplaints, updateComplaintStatus,deleteComplaint,getFilteredComplaints,searchComplaints,getUserDetails } from '../controllers/complaintController.js';

const router = express.Router();

router.get('/dashboard', auth, authorize(['admin']), async (req, res) => {
  res.json({ message: 'Welcome to admin dashboard' });
});
router.get('/admin/all',auth, adminMiddleware, getAllComplaints); 
router.put('/admin/update/:id',auth, adminMiddleware, updateComplaintStatus);
router.delete('/admin/delete/:id', auth, adminMiddleware, deleteComplaint);
router.get('/admin/filter', auth, adminMiddleware, getFilteredComplaints);
router.get('/admin/search', auth, authorize(['admin']), searchComplaints);
router.get('/user/:id', adminMiddleware, getUserDetails);
export default router;

