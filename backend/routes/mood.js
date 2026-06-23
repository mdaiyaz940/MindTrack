const express = require('express');
const {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
  getMoodAnalytics
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');
const { validateMood, validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getMoods)
  .post(validateMood, validate, createMood);

router.route('/:id')
  .put(validateMood, validate, updateMood)
  .delete(deleteMood);

router.get('/analytics/data', getMoodAnalytics);

module.exports = router;