const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const verifyToken = require('../middleware/auth');

router.get('/my-attempts', verifyToken, assessmentController.getMyAttempts);
router.get('/:id', verifyToken, assessmentController.getAssessment);
router.post('/submit', verifyToken, assessmentController.submitAttempt);

module.exports = router;
