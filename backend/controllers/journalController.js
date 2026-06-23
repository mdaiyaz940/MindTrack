const Journal = require('../models/Journal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Rate limiting for AI calls
const aiCallTracker = new Map();
const AI_RATE_LIMIT = 10; // calls per minute
const AI_WINDOW = 60000; // 1 minute

// Sanitize input for logging
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') return input;
  return encodeURIComponent(input).substring(0, 100);
};

// Get all journals for a user
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    console.error('Error fetching journals:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single journal
const getJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal not found'
      });
    }
    
    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error fetching journal:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check AI rate limit
const checkAIRateLimit = (userId) => {
  const now = Date.now();
  const userCalls = aiCallTracker.get(userId) || [];
  
  // Remove old calls outside the window
  const recentCalls = userCalls.filter(time => now - time < AI_WINDOW);
  
  if (recentCalls.length >= AI_RATE_LIMIT) {
    return false;
  }
  
  recentCalls.push(now);
  aiCallTracker.set(userId, recentCalls);
  return true;
};

// Analyze sentiment using Gemini
const analyzeSentiment = async (text, userId) => {
  // Check rate limit first
  if (!checkAIRateLimit(userId)) {
    console.log('AI rate limit exceeded for user:', userId);
    return { positive: 0.33, negative: 0.33, neutral: 0.34 };
  }

  try {
    const prompt = `Analyze the sentiment of the following text and return ONLY a JSON object with positive, negative, and neutral scores (0-1 range, sum should equal 1). No other text or explanation.\n\nText: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const sentiment = JSON.parse(jsonMatch[0]);
      return sentiment;
    }
    
    return { positive: 0.33, negative: 0.33, neutral: 0.34 };
  } catch (error) {
    console.error('Sentiment analysis error:', sanitizeForLog(error.message));
    
    // Handle specific 429 error
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.log('AI API rate limit hit, using default sentiment');
    }
    
    return { positive: 0.33, negative: 0.33, neutral: 0.34 };
  }
};

// Create a new journal entry
const createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    // Analyze sentiment with rate limiting
    const sentiment = await analyzeSentiment(content, req.user.id);
    
    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      mood,
      tags: tags || [],
      sentiment
    });
    
    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error creating journal:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update a journal entry
const updateJournal = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    // Find journal and verify ownership
    const existingJournal = await Journal.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!existingJournal) {
      return res.status(404).json({
        success: false,
        message: 'Journal not found'
      });
    }
    
    // Re-analyze sentiment if content changed
    let sentiment = existingJournal.sentiment;
    if (content && content !== existingJournal.content) {
      sentiment = await analyzeSentiment(content, req.user.id);
    }
    
    const journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { title, content, mood, tags, sentiment },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error updating journal:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a journal entry
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Journal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journal:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get journal analytics
const getJournalAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const journals = await Journal.find({
      userId: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
    
    // Calculate analytics
    const totalEntries = journals.length;
    const totalWords = journals.reduce((sum, j) => sum + j.wordCount, 0);
    const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    // Sentiment trends
    const sentimentTrends = journals.map(j => ({
      date: j.createdAt,
      positive: j.sentiment.positive,
      negative: j.sentiment.negative,
      neutral: j.sentiment.neutral
    }));
    
    // Most common tags
    const tagCounts = {};
    journals.forEach(j => {
      j.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    res.json({
      success: true,
      data: {
        totalEntries,
        totalWords,
        avgWordsPerEntry,
        sentimentTrends,
        topTags,
        timeRange: days
      }
    });
  } catch (error) {
    console.error('Error fetching journal analytics:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  getJournalAnalytics
};