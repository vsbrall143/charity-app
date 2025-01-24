const express = require('express');
const { registerCharity, getCharityProfile, addProject } = require('../controllers/charityController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/:charityId', getCharityProfile); // Get charity profile by ID

// Protected routes (auth required)
router.post('/register', authenticate, registerCharity); // Register a new charity
router.post('/:charityId/projects', authenticate, addProject); // Add a project to a charity

module.exports = router;
