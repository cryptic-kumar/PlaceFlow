const express = require('express');
const router = express.Router();
const { browseDrives, checkDriveEligibility, getDashboard } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

router.use(protect, authorize(ROLES.STUDENT));

router.get('/drives', browseDrives);
router.get('/drives/:id/eligibility', checkDriveEligibility);
router.get('/dashboard', getDashboard);

module.exports = router;
