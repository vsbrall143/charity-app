const express = require('express');
const sequelize = require('./config/db');
// const { errorHandler } = require('./middlewares/errorMiddleware');

 
const helmet = require('helmet');
 


// Import helpers
// const { sendSuccessResponse, sendErrorResponse } = require('./helpers/responseHelper');
// const { validateRequest, validateUserRegistration } = require('./helpers/validationHelper');
// const { logInfo, logError } = require('./helpers/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const charityRoutes = require('./routes/charityRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
 

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        scriptSrc: ["*","'unsafe-inline'","'unsafe-eval'","blob:"],
        scriptSrcAttr: ["*","'unsafe-inline'"],
        styleSrc: ["*","'unsafe-inline'"],
        fontSrc: ["*"],
        connectSrc: ["*"],
        imgSrc: ["*","data:"],
        mediaSrc: ["*"],
        objectSrc: ["*"],
        frameSrc: ["*"],
        workerSrc: ["*","blob:"],
        frameAncestors: ["*"],
        formAction: ["*"], // ✅ Allows form submissions from anywhere
      },
    },
    crossOriginResourcePolicy: false, // ✅ Allows cross-origin requests
  })
);

app.use(express.json());   // Middleware to parse JSON data
// Example route with validation and helpers
// app.post('/api/register', validateRequest(validateUserRegistration), (req, res) => {
//     const { email, password } = req.body;

//     // Simulating a successful registration
//     logInfo(`User ${email} registered successfully.`);
//     // sendSuccessResponse(res, { email }, 'User registered successfully');
// });

// Example error route
app.get('/api/error', (req, res) => {
    logError('Something went wrong in the error route.');
    // sendErrorResponse(res, 500, 'Internal Server Error');
});
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true })); // Enables form data parsing
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { User, Charity, Project, Donation, Admin } = require('./models');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(charityRoutes);
app.use('/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error-handling middleware
// app.use(errorHandler);
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database connected successfully!');
    // logInfo('Database connected successfully!');

    app.listen(5000, () => {
      // logInfo('Server is running on port 5000');
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.log("Error syncing DB:", err);
    // logError(`Error syncing database: ${err.message}`);
  }
}

startServer();

//  sequelize.sync({ force: false })
//   .then(() => {
//     console.log('Database connected successfully!');
//     // logInfo('Database connected successfully!');
//     app.listen(5000, () => {
//       // logInfo('Server is running on port 3000');
//       console.log("server running on port 5000")
//     });
//   })
//   .catch((err) => console.log("error syncing db",err))
//   // .catch((err) => logError(`Error syncing database: ${err.message}`));
