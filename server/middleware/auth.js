const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'capacity_connect_super_secret_jwt_key_2026_sih');
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account is pending admin approval' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
