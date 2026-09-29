const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/auth');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/:id/enroll', verifyToken, courseController.enrollCourse);
router.post('/complete-lecture', verifyToken, courseController.completeLecture);
router.post('/:courseId/materials', verifyToken, courseController.addMaterial);
router.post('/:courseId/announcements', verifyToken, courseController.addAnnouncement);

module.exports = router;
