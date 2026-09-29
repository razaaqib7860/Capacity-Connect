const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Assignments
router.post('/create', verifyToken, checkRole('trainer', 'admin'), assignmentController.createAssignment);
router.get('/course/:courseId', verifyToken, assignmentController.getCourseAssignments);

// Trainee Submission
router.post('/submit', verifyToken, checkRole('trainee', 'admin'), assignmentController.submitAssignment);

// Trainer Grading
router.get('/:assignmentId/submissions', verifyToken, checkRole('trainer', 'admin'), assignmentController.getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', verifyToken, checkRole('trainer', 'admin'), assignmentController.gradeSubmission);

module.exports = router;
