const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Trainer creates Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, instructions, attachedResources, deadline, totalMarks } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignment = await Assignment.create({
      course: courseId,
      title,
      instructions,
      attachedResources: attachedResources || [],
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      totalMarks: totalMarks || 100,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
};

// Get Course Assignments (For Trainee or Trainer)
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });

    let userSubmissions = [];
    if (req.user && req.user.role === 'trainee') {
      userSubmissions = await AssignmentSubmission.find({ course: courseId, trainee: req.user._id });
    }

    res.json({ assignments, submissions: userSubmissions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainee Submits Assignment Work
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionText, fileUrl } = req.body;
    const traineeId = req.user._id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const isLate = new Date() > new Date(assignment.deadline);

    let submission = await AssignmentSubmission.findOne({ assignment: assignmentId, trainee: traineeId });
    if (submission) {
      submission.submissionText = submissionText;
      submission.fileUrl = fileUrl || submission.fileUrl;
      submission.submittedAt = Date.now();
      submission.status = isLate ? 'Late' : 'Submitted';
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignment: assignmentId,
        course: assignment.course,
        trainee: traineeId,
        traineeName: req.user.name,
        submissionText,
        fileUrl: fileUrl || 'https://capacityconnect.in/submissions/demo_work.pdf',
        status: isLate ? 'Late' : 'Submitted'
      });
    }

    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ message: 'Server error submitting assignment' });
  }
};

// Trainer Views Submissions for Assignment
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
      .populate('trainee', 'name email avatar');

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainer Grades & Gives Feedback on Submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.feedback = feedback || 'Good work on technical implementation.';
    submission.status = 'Evaluated';
    await submission.save();

    res.json({ message: 'Submission evaluated successfully', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error grading submission' });
  }
};
