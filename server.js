const express = require('express');
const sequelize = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

const cors = require('cors');
app.use(cors());

// Import helpers
const { sendSuccessResponse, sendErrorResponse } = require('./helpers/responseHelper');
const { validateRequest, validateUserRegistration } = require('./helpers/validationHelper');
const { logInfo, logError } = require('./helpers/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const charityRoutes = require('./routes/charityRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());

// Example route with validation and helpers
app.post('/api/register', validateRequest(validateUserRegistration), (req, res) => {
    const { email, password } = req.body;

    // Simulating a successful registration
    logInfo(`User ${email} registered successfully.`);
    sendSuccessResponse(res, { email }, 'User registered successfully');
});

// Example error route
app.get('/api/error', (req, res) => {
    logError('Something went wrong in the error route.');
    sendErrorResponse(res, 500, 'Internal Server Error');
});
app.use(express.static('public'));


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error-handling middleware
app.use(errorHandler);

// Sync database and start server
sequelize.sync({ force: false })
  .then(() => {
    logInfo('Database connected successfully!');
    app.listen(3000, () => {
      logInfo('Server is running on port 3000');
    });
  })
  .catch((err) => logError(`Error syncing database: ${err.message}`));
