const mongoose = require('mongoose');
const {
  CATEGORIES,
  BANDS,
  DEFAULT_CATEGORY_BAND_MAP,
  DEFAULT_BAND_THRESHOLDS,
} = require('../utils/constants');

const PolicySchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'GLOBAL_POLICY', unique: true },

    bandThresholds: {
      normalMax: { type: Number, default: DEFAULT_BAND_THRESHOLDS.normalMax },
      dreamMax: { type: Number, default: DEFAULT_BAND_THRESHOLDS.dreamMax },
    },

    categoryBandMap: {
      type: Map,
      of: [String],
      default: () => new Map(Object.entries(DEFAULT_CATEGORY_BAND_MAP)),
    },

    oneOfferPerBand: { type: Boolean, default: true },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

PolicySchema.statics.getSingleton = async function getSingleton() {
  let policy = await this.findOne({ singletonKey: 'GLOBAL_POLICY' });
  if (!policy) {
    policy = await this.create({});
  }
  return policy;
};

module.exports = mongoose.model('Policy', PolicySchema);
