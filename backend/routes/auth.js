const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validate 
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs (increased for development)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later'
  }
});

// Public routes
router.post('/register', authLimiter, validateRegister, validate, register);
router.post('/login', authLimiter, validateLogin, validate, login);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.put('/reset-password/:resettoken', passwordResetLimiter, resetPassword);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;