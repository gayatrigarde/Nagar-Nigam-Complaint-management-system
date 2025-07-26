import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: String,
  complaintType: String, 
  Address: String,
  wardNumber: String,
  complaintDescription: String,
  status: {
    type: String,
    enum: ['pending', 'in progress', 'resolved'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Complaint', complaintSchema);
