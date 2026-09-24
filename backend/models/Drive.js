const mongoose = require('mongoose');
const { BANDS, PLACEMENT_TYPES } = require('../utils/constants');

const DriveSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    role: { type: String, required: true, trim: true },
    ctc: { type: Number, required: true },
    band: { type: String, enum: Object.values(BANDS), required: true },
    location: { type: String, trim: true, default: 'Not specified' },
    deadline: { type: Date, required: true },
    placementType: {
      type: String,
      enum: Object.values(PLACEMENT_TYPES),
      default: PLACEMENT_TYPES.NORMAL,
    },
    description: { type: String, trim: true, default: '' },
    googleFormLink: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Drive', DriveSchema);
