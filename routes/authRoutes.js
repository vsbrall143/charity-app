const express = require('express');
const { register, login } = require('../controllers/authController');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register); // User registration
router.post('/login', login); // User login

// Protected routes
router.get('/profile', authenticate, getUserProfile); // Get user profile
router.put('/profile', authenticate, updateUserProfile); // Update user profile

module.exports = router;
