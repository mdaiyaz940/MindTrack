const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  chatWithAI,
  getChatSessions,
  getChatSession,
  deleteChatSession,
  getRecommendations
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { validateChat, validate } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for AI chat
const aiChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each user to 10 AI requests per minute
  message: {
    success: false,
    message: 'Too many AI requests, please wait a moment'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// All routes are protected
router.use(protect);

// Routes
router.post('/chat', aiChatLimiter, validateChat, validate, chatWithAI);
router.get('/sessions', getChatSessions);
router.get('/sessions/:id', getChatSession);
router.delete('/sessions/:id', deleteChatSession);
router.get('/recommendations', getRecommendations);

module.exports = router;