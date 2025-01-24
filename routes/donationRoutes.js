const express = require('express');
const { processDonation, getDonationsByCharity } = require('../controllers/donationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authenticate, processDonation); // Make a donation
router.get('/charity/:charityId', authenticate, getDonationsByCharity); // Get donations by charity ID

module.exports = router;
