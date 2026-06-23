const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Mood validation rules
const validateMood = [
  body('mood')
    .isIn(['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'tired', 'stressed'])
    .withMessage('Invalid mood value'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
    .escape()
];

// Journal validation rules
const validateJournal = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters')
    .escape(),
  body('mood')
    .optional()
    .isIn(['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'tired', 'stressed'])
    .withMessage('Invalid mood value')
];

// Chat validation rules
const validateChat = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .escape()
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateMood,
  validateJournal,
  validateChat
};