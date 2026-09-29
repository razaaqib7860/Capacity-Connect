const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(verifyToken, checkRole('admin'));

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id/approve', adminController.approveUser);
router.put('/users/:id/reject', adminController.rejectUser);
router.post('/announcements', adminController.createAnnouncement);
router.get('/announcements', adminController.getAnnouncements);

module.exports = router;
