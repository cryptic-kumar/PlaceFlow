const User = require('../models/User');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const { PLACEMENT_STATUS, OFFER_STATUS, PLACEMENT_TYPES } = require('../utils/constants');

async function listApplicationsForDrive(req, res) {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ drive: driveId })
      .populate('student', 'name email rollNumber branch category placementStatus')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications.', error: err.message });
  }
}

async function updateOutcome(req, res) {
  try {
    const { applicationId } = req.params;
    const { outcome } = req.body;

    const application = await Application.findById(applicationId).populate('drive');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    application.outcome = outcome;
    application.updatedBy = req.user._id;
    await application.save();

    if (outcome === 'SELECTED') {
      const drive = application.drive;
      const student = await User.findById(application.student);
      if (!student) return res.status(404).json({ message: 'Student not found.' });

      const existingOfferIdx = student.offers.findIndex(
        (o) => o.drive.toString() === drive._id.toString()
      );

      const offerPayload = {
        drive: drive._id,
        company: (await Drive.findById(drive._id).populate('company')).company.name,
        band: drive.band,
        placementType: drive.placementType,
        ctc: drive.ctc,
        status: OFFER_STATUS.ACCEPTED,
        decidedAt: new Date(),
      };

      if (existingOfferIdx >= 0) {
        student.offers[existingOfferIdx] = { ...student.offers[existingOfferIdx].toObject(), ...offerPayload };
      } else {
        student.offers.push(offerPayload);
      }

      if (drive.placementType === PLACEMENT_TYPES.AEDP) {
        student.placementStatus = PLACEMENT_STATUS.AEDP_SELECTED;
      }

      await student.save();
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update outcome.', error: err.message });
  }
}

async function getAnalytics(req, res) {
  try {
    const [totalStudents, categoryBreakdown, drives, offerStats] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Drive.find().populate('company'),
      User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: { path: '$offers', preserveNullAndEmptyArrays: false } },
        { $match: { 'offers.status': 'ACCEPTED' } },
        { $group: { _id: '$offers.band', count: { $sum: 1 } } },
      ]),
    ]);

    const aedpCount = await User.countDocuments({ placementStatus: 'AEDP_SELECTED' });
    const publishedDrives = drives.filter((d) => d.published).length;

    res.json({
      totalStudents,
      categoryBreakdown,
      offerStats,
      aedpCount,
      totalDrives: drives.length,
      publishedDrives,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics.', error: err.message });
  }
}

async function listStudents(req, res) {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students.', error: err.message });
  }
}

module.exports = { listApplicationsForDrive, updateOutcome, getAnalytics, listStudents };
