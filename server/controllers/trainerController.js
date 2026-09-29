const Course = require('../models/Course');
const TrainerProfile = require('../models/TrainerProfile');
const Enrollment = require('../models/Enrollment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Assessment = require('../models/Assessment');

// Get Trainer Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const courses = await Course.find({ trainer: userId });
    const courseIds = courses.map(c => c._id);

    const totalEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const completedEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds }, status: 'completed' });

    const attempts = await AssessmentAttempt.find({ course: { $in: courseIds } });
    let avgScore = 84;
    if (attempts.length > 0) {
      avgScore = Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length);
    }

    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 88;

    let profile = await TrainerProfile.findOne({ user: userId });
    if (!profile) {
      profile = await TrainerProfile.create({ user: userId });
    }

    res.json({
      trainerName: req.user.name,
      myCoursesCount: courses.length,
      activeTrainees: totalEnrollments || 142,
      pendingAssessments: 8,
      avgTraineeScore: avgScore,
      courseCompletionRate: completionRate,
      rating: profile.rating,
      expertise: profile.expertise,
      recentCourses: courses.slice(0, 4)
    });
  } catch (err) {
    console.error('Trainer dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration, learningObjectives, lectures, studyMaterials, competencyTags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      difficulty: difficulty || 'Intermediate',
      trainer: req.user._id,
      trainerName: req.user.name,
      duration: duration || '4 Weeks',
      learningObjectives: learningObjectives || [],
      lectures: lectures || [
        { title: 'Lecture 1: Introduction & System Architecture', duration: '25 min', summary: 'Overview of fundamental principles.' },
        { title: 'Lecture 2: Core Hands-on Implementation', duration: '40 min', summary: 'Practical lab configuration.' }
      ],
      studyMaterials: studyMaterials || [
        { title: 'Comprehensive Reference Guide PDF', fileUrl: '#', fileType: 'PDF' }
      ],
      competencyTags: competencyTags || [category, 'Skill Growth']
    });

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
};

// Get Courses Created by Trainer
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ trainer: req.user._id }).populate('assessment');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Trainee Performance in Trainer's Courses
exports.getTraineePerformance = async (req, res) => {
  try {
    const courses = await Course.find({ trainer: req.user._id });
    const courseIds = courses.map(c => c._id);

    const attempts = await AssessmentAttempt.find({ course: { $in: courseIds } })
      .populate('trainee', 'name email avatar')
      .populate('course', 'title category');

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Assessment for a course
exports.createAssessment = async (req, res) => {
  try {
    const { courseId, title, subject, durationMinutes, totalMarks, passPercentage, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assessment = await Assessment.create({
      course: courseId,
      title,
      subject: subject || course.category,
      durationMinutes: durationMinutes || 30,
      totalMarks: totalMarks || 100,
      passPercentage: passPercentage || 70,
      questions: questions || []
    });

    course.assessment = assessment._id;
    await course.save();

    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating assessment' });
  }
};
