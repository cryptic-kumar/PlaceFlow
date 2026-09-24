const Drive = require('../models/Drive');
const Company = require('../models/Company');
const Policy = require('../models/Policy');
const { classifyCTC } = require('../utils/eligibilityEngine');

async function createDrive(req, res) {
  try {
    const { companyName, role, ctc, location, deadline, placementType, description, googleFormLink } =
      req.body;

    if (!companyName || !role || ctc === undefined || !deadline || !googleFormLink) {
      return res.status(400).json({ message: 'companyName, role, ctc, deadline and googleFormLink are required.' });
    }

    let company = await Company.findOne({ name: companyName.trim() });
    if (!company) {
      company = await Company.create({ name: companyName.trim(), createdBy: req.user._id });
    }

    const policy = await Policy.getSingleton();
    const band = classifyCTC(Number(ctc), policy.bandThresholds);

    const drive = await Drive.create({
      company: company._id,
      role,
      ctc: Number(ctc),
      band,
      location,
      deadline,
      placementType,
      description,
      googleFormLink,
      createdBy: req.user._id,
      published: false,
    });

    res.status(201).json({ drive: await drive.populate('company') });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create drive.', error: err.message });
  }
}

async function updateDrive(req, res) {
  try {
    const { id } = req.params;
    const updatable = ['role', 'location', 'deadline', 'placementType', 'description', 'googleFormLink'];
    const updates = {};
    updatable.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (req.body.ctc !== undefined) {
      const policy = await Policy.getSingleton();
      updates.ctc = Number(req.body.ctc);
      updates.band = classifyCTC(updates.ctc, policy.bandThresholds);
    }

    const drive = await Drive.findByIdAndUpdate(id, updates, { new: true }).populate('company');
    if (!drive) return res.status(404).json({ message: 'Drive not found.' });

    res.json({ drive });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update drive.', error: err.message });
  }
}

async function togglePublish(req, res) {
  try {
    const { id } = req.params;
    const drive = await Drive.findById(id);
    if (!drive) return res.status(404).json({ message: 'Drive not found.' });

    drive.published = !drive.published;
    await drive.save();

    res.json({ drive });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle publish state.', error: err.message });
  }
}

async function deleteDrive(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Drive.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Drive not found.' });
    res.json({ message: 'Drive deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete drive.', error: err.message });
  }
}

async function listAllDrives(req, res) {
  try {
    const drives = await Drive.find().populate('company').sort({ createdAt: -1 });
    res.json({ drives });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drives.', error: err.message });
  }
}

async function getDriveById(req, res) {
  try {
    const drive = await Drive.findById(req.params.id).populate('company');
    if (!drive) return res.status(404).json({ message: 'Drive not found.' });
    res.json({ drive });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drive.', error: err.message });
  }
}

module.exports = {
  createDrive,
  updateDrive,
  togglePublish,
  deleteDrive,
  listAllDrives,
  getDriveById,
};
