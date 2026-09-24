const User = require('../models/User');
const Policy = require('../models/Policy');
const { ROLES } = require('../utils/constants');

async function getPolicy(req, res) {
  try {
    const policy = await Policy.getSingleton();
    res.json({ policy });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch policy.', error: err.message });
  }
}

async function updatePolicy(req, res) {
  try {
    const policy = await Policy.getSingleton();
    const { bandThresholds, categoryBandMap, oneOfferPerBand } = req.body;

    if (bandThresholds) {
      policy.bandThresholds = { ...policy.bandThresholds, ...bandThresholds };
    }
    if (categoryBandMap) {
      policy.categoryBandMap = new Map(Object.entries(categoryBandMap));
    }
    if (oneOfferPerBand !== undefined) {
      policy.oneOfferPerBand = oneOfferPerBand;
    }
    policy.updatedBy = req.user._id;

    await policy.save();
    res.json({ policy });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update policy.', error: err.message });
  }
}

async function createStaffUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || ![ROLES.TNP, ROLES.ADMIN].includes(role)) {
      return res.status(400).json({ message: 'name, email, password and a valid staff role are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create staff user.', error: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().select('-password').sort({ role: 1, name: 1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.', error: err.message });
  }
}

module.exports = { getPolicy, updatePolicy, createStaffUser, listUsers, deleteUser };
