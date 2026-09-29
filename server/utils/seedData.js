const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TraineeProfile = require('../models/TraineeProfile');
const TrainerProfile = require('../models/TrainerProfile');
const TrainerApplication = require('../models/TrainerApplication');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Assessment = require('../models/Assessment');
const Competency = require('../models/Competency');
const Certificate = require('../models/Certificate');
const Announcement = require('../models/Announcement');
const Enrollment = require('../models/Enrollment');

async function seedData() {
  try {
    const existingUsers = await User.countDocuments({});
    if (existingUsers > 0) {
      console.log('Database already populated. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial demo data for CAPACITY CONNECT...');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Create Trainee: Rahul Kumar
    const traineeUser = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@capacityconnect.in',
      password: defaultPassword,
      role: 'trainee',
      isApproved: true
    });

    const traineeProfile = await TraineeProfile.create({
      user: traineeUser._id,
      headline: 'Software Engineer & Aspiring Cloud Project Lead',
      phone: '+91 9876543210',
      location: 'New Delhi, India',
      organization: 'National Capacity Innovation Cell',
      department: 'Digital Infrastructure Wing',
      highestQualification: 'B.Tech in Computer Science',
      institution: 'IIT Delhi',
      graduationYear: 2023,
      currentRole: 'Junior Software Engineer',
      workExperience: [
        { title: 'Junior Software Engineer', company: 'Digital India Tech', duration: '2 Years', description: 'Built REST APIs and database queries.' }
      ],
      resumeUrl: 'https://capacityconnect.in/resumes/rahul_kumar_resume.pdf',
      resumeText: 'Software Engineer with experience in JavaScript, Python, SQL, REST APIs, Git, and Microservices.',
      linkedinUrl: 'https://linkedin.com/in/rahulkumar-demo',
      githubUrl: 'https://github.com/rahulkumar-demo',
      portfolioUrl: 'https://rahulkumar.dev',
      currentSkills: [
        { skill: 'Python', level: 'Intermediate', score: 65 },
        { skill: 'JavaScript', level: 'Intermediate', score: 65 },
        { skill: 'SQL', level: 'Intermediate', score: 60 },
        { skill: 'Git', level: 'Intermediate', score: 50 },
        { skill: 'REST APIs', level: 'Intermediate', score: 55 },
        { skill: 'Cloud Computing', level: 'Beginner', score: 30 },
        { skill: 'DevOps & Docker', level: 'Beginner', score: 20 },
        { skill: 'Leadership', level: 'Beginner', score: 25 }
      ],
      targetCompetency: 'Technical Project Lead',
      careerInterests: ['Cloud Architecture', 'System Design', 'DevOps Automation', 'Engineering Leadership'],
      certifications: [
        { name: 'Full Stack Web Developer', issuer: 'National Skill Dev', year: 2024 }
      ],
      achievements: [
        'Top 5 Finalist in State Hackathon 2024',
        'Published Open-Source API Toolkit'
      ],
      profileCompletionPercentage: 100,
      overallCompetencyScore: 72
    });

    // 2. Create Approved Trainer: Dr. Ananya Sharma
    const trainerUser = await User.create({
      name: 'Dr. Ananya Sharma',
      email: 'ananya@capacityconnect.in',
      password: defaultPassword,
      role: 'trainer',
      isApproved: true
    });

    const trainerProfile = await TrainerProfile.create({
      user: trainerUser._id,
      title: 'Principal Cloud Architect & Technical Leadership Trainer',
      bio: 'Ex-AWS Principal Architect with 12+ years experience building mission-critical cloud infrastructure and mentoring 1,400+ tech leaders.',
      expertise: ['Cloud Computing', 'AWS', 'DevOps', 'Project Management', 'System Architecture'],
      subjects: ['AWS Cloud Foundations', 'DevOps & Docker', 'Leadership Essentials'],
      qualifications: ['Ph.D. in Computer Science', 'AWS Certified Solutions Architect Fellow'],
      experienceYears: 12,
      rating: 4.9,
      totalStudents: 1420
    });

    // 3. Create Pending Trainer Applicant (Demo for Admin Approval Flow!)
    const pendingTrainerUser = await User.create({
      name: 'Prof. Vikram Mehta',
      email: 'vikram@capacityconnect.in',
      password: defaultPassword,
      role: 'trainee', // Pending approval
      isApproved: false
    });

    await TrainerApplication.create({
      applicant: pendingTrainerUser._id,
      fullName: 'Prof. Vikram Mehta',
      email: 'vikram@capacityconnect.in',
      photo: '',
      phone: '+91 9812345678',
      location: 'Bangalore, India',
      highestQualification: 'Ph.D. in Cyber Security & Network Protocols',
      institution: 'IISc Bangalore',
      experienceYears: 14,
      currentOrganization: 'Center for Advanced Cyber Security',
      resumeUrl: 'https://capacityconnect.in/resumes/vikram_mehta_cv.pdf',
      linkedinUrl: 'https://linkedin.com/in/vikrammehta-cyber',
      githubUrl: 'https://github.com/vikrammehta-cyber',
      portfolioUrl: 'https://vikrammehta.tech',
      expertiseAreas: ['Cybersecurity Principles', 'Network Defense', 'Cloud Security', 'Ethical Hacking'],
      skills: ['Penetration Testing', 'Cryptography', 'AWS Security', 'ISO 27001 Audit'],
      certifications: ['CISSP', 'Certified Ethical Hacker (CEH)', 'AWS Certified Security Specialist'],
      achievements: ['Authored 3 Textbooks on Enterprise Cyber Defense', 'Govt Cyber Security Consultant'],
      teachingExperience: '14 Years Senior Professor & Corporate Information Security Trainer',
      publications: ['Zero Trust Architecture in Public Sector Clouds (ACM 2025)'],
      status: 'PENDING'
    });

    // 4. Create Admin
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@capacityconnect.in',
      password: defaultPassword,
      role: 'admin',
      isApproved: true
    });

    // 5. Create Competency Standard
    await Competency.create({
      title: 'Technical Project Lead',
      description: 'Competency standard for driving cross-functional tech initiatives, cloud architecture, and engineering teams.',
      category: 'Engineering Leadership',
      requiredSkills: [
        { skill: 'Cloud Computing', requiredLevel: 'Advanced', targetScore: 85 },
        { skill: 'Leadership', requiredLevel: 'Advanced', targetScore: 80 },
        { skill: 'DevOps & Docker', requiredLevel: 'Intermediate', targetScore: 75 },
        { skill: 'Project Management', requiredLevel: 'Intermediate', targetScore: 80 },
        { skill: 'Python', requiredLevel: 'Intermediate', targetScore: 75 },
        { skill: 'SQL', requiredLevel: 'Intermediate', targetScore: 70 }
      ]
    });

    // 6. Create Courses with Materials & Stream Announcements
    const course1 = await Course.create({
      title: 'AWS Cloud Foundations',
      description: 'Master Cloud Infrastructure, EC2, S3, Serverless Lambda, and IAM Security in Enterprise Applications.',
      category: 'Cloud Computing',
      difficulty: 'Intermediate',
      trainer: trainerUser._id,
      trainerName: 'Dr. Ananya Sharma',
      duration: '4 Weeks',
      learningObjectives: [
        'Understand Cloud Computing Fundamentals & IAM',
        'Deploy scalable Compute Services on AWS EC2 & Elastic Beanstalk',
        'Configure S3 Storage, VPC Networks, and Auto Scaling',
        'Implement Serverless Lambda and DynamoDB Architecture'
      ],
      modules: [
        { title: 'Module 1: Cloud Architecture & Security', description: 'AWS IAM, EC2 instances, subnets' },
        { title: 'Module 2: Storage & Serverless API', description: 'S3 bucket policies, DynamoDB, Lambda' }
      ],
      lectures: [
        { title: 'Lecture 1: Introduction to AWS & IAM Security', duration: '28 min', summary: 'Core cloud deployment models and IAM permissions.' },
        { title: 'Lecture 2: EC2 Compute Instances & VPC Networking', duration: '42 min', summary: 'Virtual private clouds, subnets, and security groups.' },
        { title: 'Lecture 3: S3 Storage & Database Architecture', duration: '35 min', summary: 'Object storage, bucket lifecycle policies, and DynamoDB.' },
        { title: 'Lecture 4: Serverless Computing with AWS Lambda', duration: '50 min', summary: 'Event-driven serverless API integration.' }
      ],
      materials: [
        { title: 'AWS Cloud Architectural Blueprints PDF', description: 'Enterprise VPC reference diagram and subnets', fileUrl: 'https://capacityconnect.in/docs/aws_blueprints.pdf', fileType: 'PDF', moduleName: 'Module 1', dateAdded: Date.now() },
        { title: 'IAM Security & Policy Best Practices Slide Deck', description: 'Presentation slides on least privilege IAM policies', fileUrl: 'https://capacityconnect.in/docs/iam_policies.ppt', fileType: 'PPT', moduleName: 'Module 1', dateAdded: Date.now() },
        { title: 'AWS Official Documentation Portal', description: 'External reference documentation link', fileUrl: 'https://docs.aws.amazon.com', fileType: 'External Link', moduleName: 'Module 2', dateAdded: Date.now() }
      ],
      announcements: [
        { title: '📢 Welcome to AWS Cloud Foundations Classroom!', content: 'Please review Module 1 presentation slides and complete Assignment 1 by Friday.', authorName: 'Dr. Ananya Sharma', createdAt: Date.now() }
      ],
      competencyTags: ['Cloud Computing', 'AWS', 'Infrastructure', 'Technical Project Lead'],
      enrollmentsCount: 342,
      completionRate: 91
    });

    const course2 = await Course.create({
      title: 'DevOps & Docker Essentials',
      description: 'Learn Containerization, Docker Compose, CI/CD Pipeline Automation, and Kubernetes Deployment fundamentals.',
      category: 'DevOps & Docker',
      difficulty: 'Intermediate',
      trainer: trainerUser._id,
      trainerName: 'Dr. Ananya Sharma',
      duration: '3 Weeks',
      learningObjectives: [
        'Containerize applications using Dockerfiles & Images',
        'Orchestrate multi-container stacks with Docker Compose',
        'Build automated CI/CD pipelines with GitHub Actions'
      ],
      lectures: [
        { title: 'Lecture 1: Containerization vs Virtualization', duration: '30 min', summary: 'Docker architecture and basic CLI commands.' },
        { title: 'Lecture 2: Docker Compose & Microservices', duration: '45 min', summary: 'Building multi-service web stacks.' }
      ],
      materials: [
        { title: 'Docker CLI & Container Cheat Sheet PDF', description: 'Quick CLI reference guide', fileUrl: 'https://capacityconnect.in/docs/docker_cheatsheet.pdf', fileType: 'PDF', moduleName: 'Module 1', dateAdded: Date.now() }
      ],
      competencyTags: ['DevOps & Docker', 'CI/CD', 'Containers'],
      enrollmentsCount: 210,
      completionRate: 86
    });

    // 7. Create Google Classroom-style Assignments
    const assignment1 = await Assignment.create({
      course: course1._id,
      title: 'Assignment 1: Deploying a Multi-Subnet AWS VPC Architecture',
      instructions: `1. Design an AWS Virtual Private Cloud (VPC) with 2 Public Subnets and 2 Private Subnets.
2. Attach an Internet Gateway (IGW) and configure Route Tables.
3. Submit your architectural diagram (or PDF) along with the IAM Policy JSON file.`,
      attachedResources: [
        { title: 'VPC Architecture Template Diagram', url: 'https://capacityconnect.in/docs/vpc_template.png', type: 'PDF' }
      ],
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      totalMarks: 100,
      createdBy: trainerUser._id
    });

    // Pre-enroll Rahul in AWS Cloud Foundations so "My Enrolled Courses" is immediately active!
    await Enrollment.create({
      trainee: traineeUser._id,
      course: course1._id,
      progress: 45,
      status: 'in_progress',
      enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    // 8. Create MCQ Assessments
    const assessment1 = await Assessment.create({
      course: course1._id,
      title: 'AWS Cloud Foundations & Architecture MCQ',
      subject: 'Cloud Computing',
      durationMinutes: 20,
      totalMarks: 100,
      passPercentage: 70,
      questions: [
        {
          questionText: 'Which AWS service provides resizable, virtual compute capacity in the cloud?',
          options: ['Amazon S3', 'Amazon EC2', 'Amazon DynamoDB', 'AWS CloudFront'],
          correctOptionIndex: 1,
          marks: 20
        },
        {
          questionText: 'What is the primary function of an AWS IAM Policy?',
          options: ['To manage physical server cooling', 'To define permissions for users, groups, and roles', 'To automatically scale EC2 instances', 'To encrypt S3 buckets by default'],
          correctOptionIndex: 1,
          marks: 20
        },
        {
          questionText: 'Which AWS storage service provides object storage with high durability and scalability?',
          options: ['Amazon EBS', 'Amazon Elastic File System (EFS)', 'Amazon S3', 'AWS Snowball'],
          correctOptionIndex: 2,
          marks: 20
        },
        {
          questionText: 'What is the key benefit of deploying applications across Multiple Availability Zones (AZs)?',
          options: ['Lower monthly subscription cost', 'High Availability and Fault Tolerance', 'Faster code compiling', 'Automatic database migration'],
          correctOptionIndex: 1,
          marks: 20
        },
        {
          questionText: 'Which service allows running code without provisioning or managing servers (Serverless)?',
          options: ['Amazon EC2', 'AWS Elastic Beanstalk', 'AWS Lambda', 'Amazon ECS'],
          correctOptionIndex: 2,
          marks: 20
        }
      ]
    });

    course1.assessment = assessment1._id;
    await course1.save();

    // 9. Seed Demo Certificate for Rahul Kumar
    await Certificate.create({
      certificateNumber: 'CAP-2026-CLOUD-9821',
      trainee: traineeUser._id,
      traineeName: 'Rahul Kumar',
      course: course1._id,
      courseTitle: 'AWS Cloud Foundations',
      trainerName: 'Dr. Ananya Sharma',
      score: 82,
      percentage: 82,
      status: 'VERIFIED'
    });

    // 10. Seed System Announcements
    await Announcement.create({
      title: '🚀 CAPACITY CONNECT Platform Launched for SIH 2026',
      content: 'Welcome to CAPACITY CONNECT! An AI-powered Capacity Building and Learning Management Portal empowering structured competency development, Google Classroom-style assignments, trainer verification workflows, and certified learning paths.',
      author: adminUser._id,
      authorName: 'System Administrator',
      category: 'Platform Update'
    });

    console.log('✅ Demo data seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}

module.exports = seedData;
