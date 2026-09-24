const express = require('express');
const router = express.Router();
const {
  createDrive,
  updateDrive,
  togglePublish,
  deleteDrive,
  listAllDrives,
  getDriveById,
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

router.get('/', protect, authorize(ROLES.TNP, ROLES.ADMIN), listAllDrives);
router.get('/:id', protect, getDriveById);

router.post('/', protect, authorize(ROLES.TNP, ROLES.ADMIN), createDrive);
router.put('/:id', protect, authorize(ROLES.TNP, ROLES.ADMIN), updateDrive);
router.patch('/:id/publish', protect, authorize(ROLES.TNP, ROLES.ADMIN), togglePublish);
router.delete('/:id', protect, authorize(ROLES.TNP, ROLES.ADMIN), deleteDrive);

module.exports = router;
