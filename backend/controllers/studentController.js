const Drive = require('../models/Drive');
const Policy = require('../models/Policy');
const Application = require('../models/Application');
const { checkEligibility } = require('../utils/eligibilityEngine');

async function browseDrives(req, res) {
  try {
    const drives = await Drive.find({ published: true }).populate('company').sort({ deadline: 1 });
    const policy = await Policy.getSingleton();

    const annotated = drives.map((drive) => {
      const result = checkEligibility(req.user, drive, policy);
      return { drive, eligibility: result };
    });

    res.json({ drives: annotated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drives.', error: err.message });
  }
}

async function checkDriveEligibility(req, res) {
  try {
    const drive = await Drive.findById(req.params.id).populate('company');
    if (!drive) return res.status(404).json({ message: 'Drive not found.' });

    const policy = await Policy.getSingleton();
    const result = checkEligibility(req.user, drive, policy);

    if (result.eligible) {
      await Application.findOneAndUpdate(
        { student: req.user._id, drive: drive._id },
        { student: req.user._id, drive: drive._id, eligible: true, reason: result.reason },
        { upsert: true, new: true }
      );
    }

    res.json({ eligibility: result, googleFormLink: result.eligible ? drive.googleFormLink : null });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check eligibility.', error: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({ path: 'drive', populate: { path: 'company' } })
      .sort({ createdAt: -1 });

    res.json({
      profile: req.user.toSafeJSON(),
      offers: req.user.offers,
      placementStatus: req.user.placementStatus,
      applications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard.', error: err.message });
  }
}

module.exports = { browseDrives, checkDriveEligibility, getDashboard };
