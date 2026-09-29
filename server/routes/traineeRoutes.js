const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/traineeController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(verifyToken, checkRole('trainee', 'admin'));

router.get('/profile', traineeController.getProfile);
router.put('/profile', traineeController.updateProfile);
router.get('/dashboard', traineeController.getDashboard);
router.get('/certificates', traineeController.getMyCertificates);
router.get('/my-courses', traineeController.getMyCourses);

module.exports = router;
