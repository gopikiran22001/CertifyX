const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: Number, required: true, unique: true },
  learnerAddress: { type: String, required: true },
  learnerName: { type: String, required: true },
  qualification: { type: String, required: true },
  institution: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  adminAddress: { type: String, required: true },
  transactionHash: { type: String, required: true },
  qrCode: { type: String },
  status: { type: String, enum: ['issued', 'verified'], default: 'issued' },
  verificationCount: { type: Number, default: 0 },
  digiLockerStatus: { type: String, enum: ['pending', 'uploaded', 'failed'], default: 'pending' },
  skillIndiaStatus: { type: String, enum: ['pending', 'registered', 'failed'], default: 'pending' }
}, {
  timestamps: true
});

certificateSchema.index({ learnerAddress: 1 });
certificateSchema.index({ certificateId: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);