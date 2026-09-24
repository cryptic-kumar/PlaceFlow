const express = require('express');
const router = express.Router();
const {
  listApplicationsForDrive,
  updateOutcome,
  getAnalytics,
  listStudents,
} = require('../controllers/tnpController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

router.use(protect, authorize(ROLES.TNP, ROLES.ADMIN));

router.get('/drives/:driveId/applications', listApplicationsForDrive);
router.patch('/applications/:applicationId/outcome', updateOutcome);
router.get('/analytics', getAnalytics);
router.get('/students', listStudents);

module.exports = router;
