const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'notefolio_secret_key';

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if this is an admin token (from /api/admin/login)
      if (decoded.id === 'admin' && decoded.role === 'admin') {
        req.user = { id: 'admin', role: 'admin', isAdminToken: true };
        return next();
      }

      // Regular user token - look up in database
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Admin middleware - check if user has admin role
const admin = (req, res, next) => {
  // Admin token from /api/admin/login
  if (req.user && req.user.isAdminToken) {
    return next();
  }
  
  // Database user with admin role
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Not authorized as admin' });
};

module.exports = { protect, admin };
