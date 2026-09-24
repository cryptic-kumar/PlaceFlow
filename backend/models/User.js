const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, CATEGORIES, PLACEMENT_STATUS } = require('../utils/constants');

const OfferSchema = new mongoose.Schema(
  {
    drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    company: { type: String, required: true },
    band: { type: String, required: true },
    placementType: { type: String, required: true },
    ctc: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
    decidedAt: { type: Date },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },

    rollNumber: { type: String, trim: true },
    branch: { type: String, trim: true },
    category: { type: String, enum: Object.values(CATEGORIES) },
    placementStatus: {
      type: String,
      enum: Object.values(PLACEMENT_STATUS),
      default: PLACEMENT_STATUS.ACTIVE,
    },
    offers: [OfferSchema],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
