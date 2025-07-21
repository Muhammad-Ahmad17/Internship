const userController = require('../controllers/user.controller');
const authenticateJWT = require('../middlewares/auth.middleware');
const validator = require('../middlewares/validaor.middleware');
const express = require('express');
const router = express.Router();


// user routes
const {registerSchema, loginSchema , sendMoneySchema} = require('../validators/user.validator');

// Route to register a new user
router.post('/register',validator(registerSchema), userController.registerUser);
// Route to login
router.post('/login', validator(loginSchema), userController.loginUser);
// Route to get user profile
router.get('/profile', authenticateJWT, userController.userProfile);
// Route to get user location
router.get('/location', authenticateJWT, userController.userLocation);
// Route to send welcome email
router.post('/send-welcome-email', userController.sendWelcomeEmail);
// Route to send money
router.post('/send-money', validator(sendMoneySchema) ,authenticateJWT, userController.sendMoney);

module.exports = router;
