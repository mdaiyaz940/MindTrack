const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatSession = require('../models/ChatSession');
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Sanitize input for logging
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') return input;
  return encodeURIComponent(input).substring(0, 100);
};

// Get user context for AI
const getUserContext = async (userId) => {
  try {
    // Get recent moods (last 7 days)
    const recentMoods = await Mood.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 }).limit(10);

    // Get recent journal entries (last 3 days)
    const recentJournals = await Journal.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 }).limit(3);

    return {
      recentMoods: recentMoods.map(m => ({ mood: m.mood, intensity: m.intensity, date: m.createdAt })),
      recentJournals: recentJournals.map(j => ({ 
        sentiment: j.sentiment, 
        wordCount: j.wordCount, 
        date: j.createdAt 
      }))
    };
  } catch (error) {
    console.error('Error getting user context:', sanitizeForLog(error.message));
    return { recentMoods: [], recentJournals: [] };
  }
};

// Generate AI system prompt based on user context
const generateSystemPrompt = (userContext) => {
  const { recentMoods, recentJournals } = userContext;
  
  let contextInfo = '';
  
  if (recentMoods.length > 0) {
    const moodSummary = recentMoods.map(m => `${m.mood} (intensity: ${m.intensity})`).join(', ');
    contextInfo += `Recent moods: ${moodSummary}. `;
  }
  
  if (recentJournals.length > 0) {
    const avgSentiment = recentJournals.reduce((sum, j) => sum + (j.sentiment.positive || 0), 0) / recentJournals.length;
    contextInfo += `Recent journal sentiment tends to be ${avgSentiment > 0.6 ? 'positive' : avgSentiment < 0.4 ? 'negative' : 'neutral'}. `;
  }

  return `You are a warm, supportive AI wellness companion. Keep responses SHORT, conversational, and actionable.

STYLE RULES:
- Write like a caring friend, not a textbook
- Use 2-3 short sentences max per paragraph
- Include emojis sparingly (1-2 per response)
- Ask follow-up questions to keep conversation flowing
- Give ONE specific tip per response, not multiple
- Use "you" language, be personal

RESPONSE FORMAT:
1. Acknowledge their feeling (1 sentence)
2. Give ONE practical tip (1-2 sentences) 
3. Ask an engaging follow-up question (1 sentence)

USER CONTEXT: ${contextInfo}

Never give medical advice. If crisis mentioned, suggest professional help immediately.`;
};

// Chat with AI assistant
const chatWithAI = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
    }
    
    if (!session) {
      session = await ChatSession.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Get user context for personalized responses
    const userContext = await getUserContext(userId);
    const systemPrompt = generateSystemPrompt(userContext);

    // Prepare conversation history for Gemini
    const conversationHistory = [
      systemPrompt,
      ...session.messages.slice(-6).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ),
      `User: ${message}`
    ].join('\n\n');

    // Get AI response from Gemini
    const result = await model.generateContent(conversationHistory);
    const response = await result.response;
    let aiResponse = response.text();
    
    // Ensure response is concise (limit to ~150 words)
    const words = aiResponse.split(' ');
    if (words.length > 150) {
      aiResponse = words.slice(0, 150).join(' ') + '...';
    }

    // Save messages to session
    session.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    );
    session.lastActivity = new Date();
    
    await session.save();

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        message: aiResponse,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('AI chat error:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response'
    });
  }
};

// Get chat sessions
const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ 
      userId: req.user.id,
      isActive: true 
    })
    .sort({ lastActivity: -1 })
    .limit(20)
    .select('title lastActivity messages');

    // Add message count to each session
    const sessionsWithCount = sessions.map(session => ({
      ...session.toObject(),
      messageCount: session.messages.length
    }));

    res.json({
      success: true,
      data: sessionsWithCount
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single chat session
const getChatSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching chat session:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete chat session
const deleteChatSession = async (req, res) => {
  try {
    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat session:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};



// Get AI recommendations based on user data
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userContext = await getUserContext(userId);

    // Analyze user patterns
    const { recentMoods, recentJournals } = userContext;
    
    let recommendations = {
      videos: [],
      articles: [],
      activities: []
    };

    // Determine dominant mood pattern
    const moodCounts = {};
    recentMoods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    );

    // Generate mood-based recommendations
    const moodRecommendations = {
      anxious: {
        videos: [
          { title: '5-Minute Breathing Exercise for Anxiety', url: 'https://youtube.com/watch?v=example1', type: 'breathing' },
          { title: 'Progressive Muscle Relaxation', url: 'https://youtube.com/watch?v=example2', type: 'relaxation' }
        ],
        articles: [
          { title: 'Understanding Anxiety: Causes and Coping Strategies', url: '#', category: 'education' },
          { title: '10 Grounding Techniques for Anxiety Relief', url: '#', category: 'techniques' }
        ],
        activities: ['Deep breathing', 'Gentle yoga', 'Nature walk', 'Journaling']
      },
      sad: {
        videos: [
          { title: 'Uplifting Meditation for Low Mood', url: 'https://youtube.com/watch?v=example3', type: 'meditation' },
          { title: 'Gentle Movement for Depression', url: 'https://youtube.com/watch?v=example4', type: 'exercise' }
        ],
        articles: [
          { title: 'Building Resilience During Difficult Times', url: '#', category: 'resilience' },
          { title: 'The Science of Gratitude and Mood', url: '#', category: 'science' }
        ],
        activities: ['Gratitude practice', 'Creative expression', 'Social connection', 'Light exercise']
      },
      stressed: {
        videos: [
          { title: 'Quick Stress Relief Techniques', url: 'https://youtube.com/watch?v=example5', type: 'stress-relief' },
          { title: 'Mindfulness for Busy People', url: 'https://youtube.com/watch?v=example6', type: 'mindfulness' }
        ],
        articles: [
          { title: 'Managing Work-Life Balance', url: '#', category: 'lifestyle' },
          { title: 'Time Management for Mental Health', url: '#', category: 'productivity' }
        ],
        activities: ['Time blocking', 'Meditation', 'Exercise', 'Boundary setting']
      }
    };

    recommendations = moodRecommendations[dominantMood] || moodRecommendations.neutral || {
      videos: [
        { title: 'Daily Mindfulness Practice', url: 'https://youtube.com/watch?v=example7', type: 'mindfulness' }
      ],
      articles: [
        { title: 'Building Mental Wellness Habits', url: '#', category: 'wellness' }
      ],
      activities: ['Meditation', 'Exercise', 'Journaling', 'Social connection']
    };

    res.json({
      success: true,
      data: {
        recommendations,
        basedOn: {
          dominantMood,
          moodPattern: moodCounts,
          timeframe: 'last 7 days'
        }
      }
    });

  } catch (error) {
    console.error('Error generating recommendations:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  chatWithAI,
  getChatSessions,
  getChatSession,
  deleteChatSession,
  getRecommendations
};