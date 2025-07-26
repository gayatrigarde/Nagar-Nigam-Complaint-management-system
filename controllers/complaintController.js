import Complaint from '../models/Complaint.js';
import upload from '../middleware/upload.js';  
import User from '../models/User.js';
import mongoose from 'mongoose';

export const submitComplaint = async (req, res) => 
  {
  console.log('Body:', req.body);
  console.log('File:', req.file);
    console.log("DB Name:", mongoose.connection.name);
  try{
  const { Address, wardNumber, complaintType, complaintDescription } = req.body;
    console.log("Address:", Address);
    console.log("Ward Number:", wardNumber);
    console.log("Complaint Type:", complaintType);
    console.log("Complaint Description:", complaintDescription);

  if (!complaintType || !Address || !wardNumber || !complaintDescription || !req.file) {
    return res.status(400).json({ error: 'All fields including image are required' });
  }

    const imageUrl = `/uploads/${req.file.filename}`;

    const complaint = new Complaint({
      user: req.user.id, 
      imageUrl,
      complaintType,
      Address,
      wardNumber,
      complaintDescription,
      status: 'pending',
      submittedAt: new Date()
    });

    await complaint.save();

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    console.error('Complaint submission failed:', error);
    res.status(500).json({ error: 'Internal server error while submitting complaint' });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    user.profileImage = req.file.filename; 
    await user.save();

    res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Admin side
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};
const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'in progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint status updated', updatedComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

    if (!deletedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getFilteredComplaints = async (req, res) => {
  try {
    const { status, wardNumber } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (wardNumber) {
      filter.wardNumber = wardNumber;
    }

    const filteredComplaints = await Complaint.find(filter);
    res.status(200).json(filteredComplaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch filtered complaints', error: error.message });
  }
};

const searchComplaints = async (req, res) => {
  try {
    const { keyword } = req.query;  

    if (!keyword) {
      return res.status(400).json({ message: 'Please provide a search keyword' });
    }

    const complaints = await Complaint.find({
      complaintType: { $regex: keyword, $options: 'i' },  
    });

    if (complaints.length > 0) {
      res.status(200).json(complaints);
    } else {
      res.status(404).json({ message: 'No complaints found matching the search criteria' });
    }
  } catch (error) {
    console.error('Error while searching complaints:', error);
    res.status(500).json({ message: 'Failed to search complaints', error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getComplaintsByUser = async (req, res) => {
  console.log('User ID:', req.user.id);  
  try {
    const complaints = await Complaint.find({ user: req.user.id });

    if (complaints.length === 0) {
      return res.status(404).json({
        message: "No complaints found for this user",
        complaints: [],
      });
    }

    return res.json({
      message: "Fetched user complaints",
      complaints,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const deleteUserComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this complaint' });
    }

    await complaint.deleteOne();

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete Complaint Error:', error.message);
    res.status(500).json({ message: 'Something went wrong while deleting complaint' });
  }
};


export { getComplaintById,getAllComplaints,updateComplaintStatus,deleteComplaint,getFilteredComplaints,searchComplaints,getUserDetails,getComplaintsByUser };
