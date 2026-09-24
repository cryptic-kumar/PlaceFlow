const express = require('express');
const router = express.Router();
const {
  getPolicy,
  updatePolicy,
  createStaffUser,
  listUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

router.use(protect, authorize(ROLES.ADMIN));

router.get('/policy', getPolicy);
router.put('/policy', updatePolicy);
router.post('/users', createStaffUser);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
