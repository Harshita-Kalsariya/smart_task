// routes/authRoutes.js - Authentication endpoints

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Login and receive JWT
router.post('/login', loginUser);

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', protect, getMe);

module.exports = router;
