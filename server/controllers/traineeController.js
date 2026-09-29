const TraineeProfile = require('../models/TraineeProfile');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { analyzeTraineeCompetency } = require('../services/competencyEngine');

// Get Trainee Profile & Competency Analysis
exports.getProfile = async (req, res) => {
  try {
    let profile = await TraineeProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');
    if (!profile) {
      profile = await TraineeProfile.create({ user: req.user._id });
    }

    const analysis = await analyzeTraineeCompetency(profile);

    // Sync identified gaps to profile in DB
    profile.overallCompetencyScore = analysis.overallCompetencyScore;
    profile.identifiedGaps = analysis.identifiedGaps;
    await profile.save();

    res.json({
      profile,
      competencyAnalysis: analysis
    });
  } catch (err) {
    console.error('Error fetching trainee profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Trainee Profile
exports.updateProfile = async (req, res) => {
  try {
    const { headline, organization, department, currentSkills, targetCompetency, qualifications, experience, interests } = req.body;

    let profile = await TraineeProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new TraineeProfile({ user: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (organization !== undefined) profile.organization = organization;
    if (department !== undefined) profile.department = department;
    if (currentSkills !== undefined) profile.currentSkills = currentSkills;
    if (targetCompetency !== undefined) profile.targetCompetency = targetCompetency;
    if (qualifications !== undefined) profile.qualifications = qualifications;
    if (experience !== undefined) profile.experience = experience;
    if (interests !== undefined) profile.interests = interests;
    profile.updatedAt = Date.now();

    await profile.save();

    const analysis = await analyzeTraineeCompetency(profile);
    profile.overallCompetencyScore = analysis.overallCompetencyScore;
    profile.identifiedGaps = analysis.identifiedGaps;
    await profile.save();

    res.json({ message: 'Profile updated successfully', profile, competencyAnalysis: analysis });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get Dashboard Overview for Trainee
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    let profile = await TraineeProfile.findOne({ user: userId });
    if (!profile) {
      profile = await TraineeProfile.create({ user: userId });
    }

    const analysis = await analyzeTraineeCompetency(profile);

    // Get Enrollments & calculated avg progress
    const enrollments = await Enrollment.find({ trainee: userId }).populate('course');
    let totalProgress = 0;
    if (enrollments.length > 0) {
      totalProgress = Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length);
    } else {
      totalProgress = 78; // Default demo progress
    }

    // Get upcoming assessment
    const completedAttempts = await AssessmentAttempt.find({ trainee: userId }).select('assessment');
    const attemptedAssessmentIds = completedAttempts.map(a => a.assessment);

    const upcomingAssessment = await Assessment.findOne({
      _id: { $nin: attemptedAssessmentIds }
    }).populate('course', 'title category');

    const certificates = await Certificate.find({ trainee: userId });

    res.json({
      welcomeName: req.user.name,
      overallProgress: totalProgress,
      competencyScore: analysis.overallCompetencyScore,
      targetCompetency: analysis.targetCompetency,
      skillGaps: analysis.identifiedGaps.slice(0, 3),
      recommendedCourses: analysis.recommendedCourses,
      recommendedTrainer: analysis.recommendedTrainers[0] || null,
      upcomingAssessment: upcomingAssessment || {
        title: 'Cloud Fundamentals & AWS Architecture MCQ',
        dueDate: 'Friday',
        courseTitle: 'AWS Cloud Foundations'
      },
      certificatesCount: certificates.length,
      enrolledCount: enrollments.length
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Trainee Certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ trainee: req.user._id }).populate('course');
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Enrolled Courses
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ trainee: req.user._id }).populate({
      path: 'course',
      populate: { path: 'trainer', select: 'name email' }
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
