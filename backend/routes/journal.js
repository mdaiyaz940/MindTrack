const express = require('express');
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  getJournalAnalytics
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const { validateJournal, validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getJournals)
  .post(validateJournal, validate, createJournal);

router.route('/:id')
  .get(getJournal)
  .put(validateJournal, validate, updateJournal)
  .delete(deleteJournal);

router.get('/analytics/data', getJournalAnalytics);

module.exports = router;