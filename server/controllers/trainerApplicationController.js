const TrainerApplication = require('../models/TrainerApplication');
const TrainerProfile = require('../models/TrainerProfile');
const User = require('../models/User');

// Submit Trainer Application (Trainer Onboarding)
exports.submitApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      fullName, email, phone, location, photo,
      highestQualification, institution, experienceYears, currentOrganization,
      resumeUrl, linkedinUrl, githubUrl, portfolioUrl,
      expertiseAreas, skills, certifications, achievements, teachingExperience, publications
    } = req.body;

    let application = await TrainerApplication.findOne({ applicant: userId });
    if (application && application.status === 'PENDING') {
      return res.status(400).json({ message: 'You already have a pending trainer application under review.' });
    }

    application = await TrainerApplication.create({
      applicant: userId,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      photo: photo || '',
      phone: phone || '+91 9876543210',
      location: location || 'Bangalore, India',
      highestQualification: highestQualification || 'Ph.D. in Computer Science',
      institution: institution || 'IISc Bangalore',
      experienceYears: Number(experienceYears) || 10,
      currentOrganization: currentOrganization || 'Cloud Innovation Labs',
      resumeUrl: resumeUrl || 'https://capacityconnect.in/resumes/trainer_demo_resume.pdf',
      linkedinUrl: linkedinUrl || 'https://linkedin.com/in/trainer-demo',
      githubUrl: githubUrl || 'https://github.com/trainer-demo',
      portfolioUrl: portfolioUrl || 'https://trainer-demo.dev',
      expertiseAreas: expertiseAreas || ['Cloud Computing', 'AWS', 'DevOps', 'System Design'],
      skills: skills || ['AWS Architecture', 'Docker', 'Kubernetes', 'Python'],
      certifications: certifications || ['AWS Certified Solutions Architect Fellow'],
      achievements: achievements || ['Trained 1,400+ IT Professionals', 'Published 12 Conference Papers'],
      teachingExperience: teachingExperience || '8 Years Senior Corporate & Academic Trainer',
      publications: publications || 'Scalable Cloud Systems Architecture (IEEE 2024)',
      status: 'PENDING'
    });

    res.status(201).json({ message: 'Trainer application submitted successfully! Pending admin approval.', application });
  } catch (err) {
    console.error('Error submitting trainer application:', err);
    res.status(500).json({ message: 'Server error submitting trainer application', error: err.message });
  }
};

// Get All Applications (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const applications = await TrainerApplication.find(filter)
      .populate('applicant', 'name email avatar role')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Single Application by ID (Admin Inspection)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await TrainerApplication.findById(req.params.id)
      .populate('applicant', 'name email avatar role');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Review Action (Approve or Reject)
exports.reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback } = req.body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' });
    }

    const application = await TrainerApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.adminFeedback = adminFeedback || '';
    application.reviewedAt = Date.now();
    await application.save();

    // If APPROVED, grant trainer role & create TrainerProfile
    if (status === 'APPROVED') {
      const user = await User.findById(application.applicant);
      if (user) {
        user.role = 'trainer';
        user.isApproved = true;
        await user.save();

        let trainerProfile = await TrainerProfile.findOne({ user: user._id });
        if (!trainerProfile) {
          trainerProfile = new TrainerProfile({ user: user._id });
        }

        trainerProfile.application = application._id;
        trainerProfile.title = `${application.highestQualification} • Senior Domain Specialist`;
        trainerProfile.bio = application.teachingExperience;
        trainerProfile.expertise = application.expertiseAreas;
        trainerProfile.qualifications = [application.highestQualification];
        trainerProfile.experienceYears = application.experienceYears;
        await trainerProfile.save();
      }
    }

    res.json({ message: `Trainer application status updated to ${status}`, application });
  } catch (err) {
    console.error('Error reviewing trainer application:', err);
    res.status(500).json({ message: 'Server error reviewing application' });
  }
};
