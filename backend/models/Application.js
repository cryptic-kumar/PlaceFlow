const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    eligible: { type: Boolean, required: true },
    reason: { type: String, default: '' },
    outcome: {
      type: String,
      enum: ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'WITHDRAWN'],
      default: 'APPLIED',
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ApplicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
