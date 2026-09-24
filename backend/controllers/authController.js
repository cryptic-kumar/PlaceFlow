const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES, PLACEMENT_STATUS } = require('../utils/constants');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function registerStudent(req, res) {
  try {
    const { name, email, password, rollNumber, branch, category } = req.body;

    if (!name || !email || !password || !rollNumber || !branch || !category) {
      return res.status(400).json({ message: 'All fields are required for student registration.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      rollNumber,
      branch,
      category,
      role: ROLES.STUDENT,
      placementStatus: PLACEMENT_STATUS.ACTIVE,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
}

async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

module.exports = { registerStudent, login, me };
