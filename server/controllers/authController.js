const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TraineeProfile = require('../models/TraineeProfile');
const TrainerProfile = require('../models/TrainerProfile');

const JWT_SECRET = process.env.JWT_SECRET || 'capacity_connect_super_secret_jwt_key_2026_sih';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, headline, organization, expertise } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role || 'trainee';
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isApproved: true
    });

    if (userRole === 'trainee') {
      await TraineeProfile.create({
        user: newUser._id,
        headline: headline || 'Trainee Learner',
        organization: organization || 'Capacity Building Program',
        currentSkills: [
          { skill: 'Python', level: 'Intermediate', score: 60 },
          { skill: 'SQL', level: 'Intermediate', score: 55 }
        ],
        targetCompetency: 'Technical Project Lead'
      });
    } else if (userRole === 'trainer') {
      await TrainerProfile.create({
        user: newUser._id,
        title: headline || 'Certified Domain Trainer',
        expertise: expertise || ['Cloud Computing', 'AWS', 'DevOps'],
        subjects: ['Cloud Fundamentals', 'Enterprise Architectures']
      });
    }

    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account is pending admin approval' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile & token check
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;

    if (user.role === 'trainee') {
      profile = await TraineeProfile.findOne({ user: user._id });
    } else if (user.role === 'trainer') {
      profile = await TrainerProfile.findOne({ user: user._id });
    }

    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
