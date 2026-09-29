const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('trainer', 'name email avatar')
      .populate('assessment');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('trainer', 'name email avatar')
      .populate('assessment');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let isEnrolled = false;
    let enrollment = null;

    if (req.user && req.user.role === 'trainee') {
      enrollment = await Enrollment.findOne({ trainee: req.user._id, course: course._id });
      if (enrollment) isEnrolled = true;
    }

    const assignments = await Assignment.find({ course: course._id }).sort({ createdAt: -1 });

    res.json({ course, isEnrolled, enrollment, assignments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll in Course
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const traineeId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let enrollment = await Enrollment.findOne({ trainee: traineeId, course: courseId });
    if (enrollment) {
      return res.json({ message: 'Already enrolled in this course', enrollment });
    }

    enrollment = await Enrollment.create({
      trainee: traineeId,
      course: courseId,
      progress: 10,
      status: 'enrolled'
    });

    course.enrollmentsCount += 1;
    await course.save();

    res.status(201).json({ message: 'Successfully enrolled in course', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error enrolling in course' });
  }
};

// Update Lecture Progress
exports.completeLecture = async (req, res) => {
  try {
    const { courseId, lectureIndex } = req.body;
    const traineeId = req.user._id;

    const enrollment = await Enrollment.findOne({ trainee: traineeId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    if (!enrollment.completedLectures.includes(lectureIndex)) {
      enrollment.completedLectures.push(lectureIndex);
    }

    const course = await Course.findById(courseId);
    const totalLectures = (course && course.lectures) ? course.lectures.length : 1;
    enrollment.progress = Math.min(100, Math.round((enrollment.completedLectures.length / totalLectures) * 100));

    if (enrollment.progress >= 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = Date.now();
    } else {
      enrollment.status = 'in_progress';
    }

    await enrollment.save();

    res.json({ message: 'Lecture completed', progress: enrollment.progress, enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating lecture progress' });
  }
};

// Trainer Adds Classroom Material (Video, PDF, PPT, Document, External Link)
exports.addMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, fileUrl, fileType, moduleName } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.materials.push({
      title,
      description,
      fileUrl: fileUrl || '#',
      fileType: fileType || 'PDF',
      moduleName: moduleName || 'General',
      dateAdded: Date.now()
    });

    await course.save();

    res.status(201).json({ message: 'Material added successfully', materials: course.materials });
  } catch (err) {
    res.status(500).json({ message: 'Server error adding material' });
  }
};

// Trainer Adds Stream Announcement
exports.addAnnouncement = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.announcements.push({
      title,
      content,
      authorName: req.user.name,
      createdAt: Date.now()
    });

    await course.save();

    res.status(201).json({ message: 'Announcement posted to classroom stream', announcements: course.announcements });
  } catch (err) {
    res.status(500).json({ message: 'Server error posting announcement' });
  }
};
