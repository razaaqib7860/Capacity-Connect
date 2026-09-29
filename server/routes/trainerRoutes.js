const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.use(verifyToken, checkRole('trainer', 'admin'));

router.get('/dashboard', trainerController.getDashboard);
router.get('/courses', trainerController.getMyCourses);
router.post('/courses', trainerController.createCourse);
router.post('/assessments', trainerController.createAssessment);
router.get('/performance', trainerController.getTraineePerformance);

module.exports = router;
