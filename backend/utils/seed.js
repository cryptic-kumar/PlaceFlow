require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Policy = require('../models/Policy');
const { ROLES, CATEGORIES, PLACEMENT_TYPES } = require('./constants');
const { classifyCTC } = require('./eligibilityEngine');

async function seed() {
  await connectDB();

  console.log('[seed] Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Drive.deleteMany({}),
    Policy.deleteMany({}),
  ]);

  const policy = await Policy.getSingleton();

  console.log('[seed] Creating admin, TNP and demo students...');
  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@placeflow.edu',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  });

  const tnp = await User.create({
    name: 'TNP Officer',
    email: 'tnp@placeflow.edu',
    password: 'Tnp@1234',
    role: ROLES.TNP,
  });

  const students = await User.create([
    {
      name: 'Aditi Sharma',
      email: 'aditi@student.edu',
      password: 'Student@123',
      rollNumber: 'CS101',
      branch: 'Computer Science',
      category: CATEGORIES.CAT1,
    },
    {
      name: 'Rohan Verma',
      email: 'rohan@student.edu',
      password: 'Student@123',
      rollNumber: 'CS102',
      branch: 'Computer Science',
      category: CATEGORIES.CAT2,
    },
    {
      name: 'Priya Nair',
      email: 'priya@student.edu',
      password: 'Student@123',
      rollNumber: 'EC103',
      branch: 'Electronics',
      category: CATEGORIES.CAT3,
    },
  ]);

  console.log('[seed] Creating companies and drives...');
  const [infosys, google, microsoft] = await Company.create([
    { name: 'Infosys', description: 'IT services', createdBy: tnp._id },
    { name: 'Google', description: 'Big tech', createdBy: tnp._id },
    { name: 'Microsoft', description: 'Big tech / AEDP program', createdBy: tnp._id },
  ]);

  const drivesData = [
    {
      company: infosys._id,
      role: 'Systems Engineer',
      ctc: 4.5,
      location: 'Bangalore',
      deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      placementType: PLACEMENT_TYPES.NORMAL,
      description: 'Entry-level systems engineering role.',
      googleFormLink: 'https://forms.example.com/infosys-2026',
      createdBy: tnp._id,
      published: true,
    },
    {
      company: google._id,
      role: 'Software Engineer',
      ctc: 8,
      location: 'Hyderabad',
      deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000),
      placementType: PLACEMENT_TYPES.NORMAL,
      description: 'Dream opportunity for CAT1/CAT2 students.',
      googleFormLink: 'https://forms.example.com/google-2026',
      createdBy: tnp._id,
      published: true,
    },
    {
      company: microsoft._id,
      role: 'AEDP Apprentice Engineer',
      ctc: 12,
      location: 'Noida',
      deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      placementType: PLACEMENT_TYPES.AEDP,
      description: 'Super Dream, AEDP program - removes student from further placements.',
      googleFormLink: 'https://forms.example.com/microsoft-aedp-2026',
      createdBy: tnp._id,
      published: true,
    },
  ].map((d) => ({ ...d, band: classifyCTC(d.ctc, policy.bandThresholds) }));

  await Drive.create(drivesData);

  console.log('[seed] Done!');
  console.log('----------------------------------------------------');
  console.log('Admin login:   admin@placeflow.edu / Admin@123');
  console.log('TNP login:     tnp@placeflow.edu   / Tnp@1234');
  console.log('Student login: aditi@student.edu   / Student@123 (CAT1)');
  console.log('Student login: rohan@student.edu   / Student@123 (CAT2)');
  console.log('Student login: priya@student.edu   / Student@123 (CAT3)');
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
