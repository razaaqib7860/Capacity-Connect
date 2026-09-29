const express = require('express');
const router = express.Router();
const trainerAppController = require('../controllers/trainerApplicationController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Trainee / User submits application to become a trainer
router.post('/apply', verifyToken, trainerAppController.submitApplication);

// Admin Application Review Endpoints
router.get('/', verifyToken, checkRole('admin'), trainerAppController.getAllApplications);
router.get('/:id', verifyToken, checkRole('admin'), trainerAppController.getApplicationById);
router.put('/:id/review', verifyToken, checkRole('admin'), trainerAppController.reviewApplication);

module.exports = router;
