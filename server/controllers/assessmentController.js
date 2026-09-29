const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const TraineeProfile = require('../models/TraineeProfile');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { analyzeTraineeCompetency } = require('../services/competencyEngine');

// Get Assessment Details
exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course', 'title category trainerName');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Hide correct options if requester is trainee attempting quiz
    const sanitizedQuestions = assessment.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks
    }));

    res.json({
      _id: assessment._id,
      title: assessment.title,
      subject: assessment.subject,
      durationMinutes: assessment.durationMinutes,
      totalMarks: assessment.totalMarks,
      passPercentage: assessment.passPercentage,
      course: assessment.course,
      questions: sanitizedQuestions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit Assessment Attempt
exports.submitAttempt = async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;
    const traineeId = req.user._id;

    const assessment = await Assessment.findById(assessmentId).populate('course');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    let earnedMarks = 0;
    let totalMarks = assessment.totalMarks || 100;
    const questions = assessment.questions || [];

    questions.forEach((q, index) => {
      const selectedIndex = answers[index];
      if (selectedIndex !== undefined && selectedIndex === q.correctOptionIndex) {
        earnedMarks += (q.marks || 20);
      }
    });

    const percentage = Math.round((earnedMarks / totalMarks) * 100);
    const passed = percentage >= (assessment.passPercentage || 70);

    // Save Attempt
    const attempt = await AssessmentAttempt.create({
      trainee: traineeId,
      assessment: assessmentId,
      course: assessment.course._id,
      answers,
      score: earnedMarks,
      totalMarks,
      percentage,
      passed
    });

    let certificate = null;

    // If passed, issue Certificate & update Trainee Competency Profile!
    if (passed) {
      // 1. Mark enrollment as completed
      await Enrollment.findOneAndUpdate(
        { trainee: traineeId, course: assessment.course._id },
        { status: 'completed', progress: 100, completedAt: Date.now() },
        { upsert: true }
      );

      // 2. Generate Certificate
      const certNumber = `CAP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      certificate = await Certificate.create({
        certificateNumber: certNumber,
        trainee: traineeId,
        traineeName: req.user.name,
        course: assessment.course._id,
        courseTitle: assessment.course.title,
        trainerName: assessment.course.trainerName || 'Dr. Ananya Sharma',
        score: earnedMarks,
        percentage,
        status: 'VERIFIED'
      });

      // 3. Update Trainee Competency & Skill Scores
      let profile = await TraineeProfile.findOne({ user: traineeId });
      if (profile) {
        const categorySkill = assessment.subject || assessment.course.category;
        
        // Find existing skill or push new
        let existingSkill = profile.currentSkills.find(s => s.skill.toLowerCase().includes(categorySkill.toLowerCase()) || categorySkill.toLowerCase().includes(s.skill.toLowerCase()));
        if (existingSkill) {
          existingSkill.score = Math.min(95, Math.max(existingSkill.score + 25, percentage));
          if (existingSkill.score > 70) existingSkill.level = 'Advanced';
          else if (existingSkill.score > 45) existingSkill.level = 'Intermediate';
        } else {
          profile.currentSkills.push({
            skill: categorySkill,
            level: percentage >= 80 ? 'Advanced' : 'Intermediate',
            score: percentage
          });
        }

        await profile.save();
        const updatedAnalysis = await analyzeTraineeCompetency(profile);
        profile.overallCompetencyScore = updatedAnalysis.overallCompetencyScore;
        profile.identifiedGaps = updatedAnalysis.identifiedGaps;
        await profile.save();
      }
    }

    res.json({
      attempt,
      score: earnedMarks,
      totalMarks,
      percentage,
      passed,
      certificate
    });
  } catch (err) {
    console.error('Error submitting assessment attempt:', err);
    res.status(500).json({ message: 'Server error during submission', error: err.message });
  }
};

// Get User's Past Attempts
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ trainee: req.user._id })
      .populate('assessment', 'title subject totalMarks passPercentage')
      .populate('course', 'title category');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
