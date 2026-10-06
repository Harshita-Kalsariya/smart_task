// middleware/authMiddleware.js - JWT Authentication Middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Middleware to verify JWT token.
 * Attaches the logged-in user to req.user on success.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify and decode the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
