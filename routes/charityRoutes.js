const express = require('express');
const { uploadMiddleware, registerCharity, getCharityProfile, addProject,allcharities,allprojects,deleteproject,unapprovedcharities, approvecharity } = require('../controllers/charityController');
const { authenticate} = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/unapprovedcharities', unapprovedcharities);
router.get('/allprojects/:charityid', allprojects);
router.get('/allcharities', allcharities); // Get charity profile by ID
router.post('/addproject',authenticate, uploadMiddleware, addProject);
router.delete('/deleteproject/:projectid',authenticate, deleteproject);
router.post('/approvecharity/:charityid', approvecharity);


// Serve uploaded images
router.use('/uploads', express.static('uploads'));
// Public routes
// router.get('/:charityId', getCharityProfile); // Get charity profile by ID

// Protected routes (auth required)
// router.post('/register', authenticate, registerCharity); // Register a new charity
// router.post('/:charityId/projects', authenticate, addProject); // Add a project to a charity

module.exports = router;
