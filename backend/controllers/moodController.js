const Mood = require('../models/Mood');

// Sanitize input for logging
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') return input;
  return encodeURIComponent(input).substring(0, 100);
};

// Get all moods for a user
const getMoods = async (req, res) => {
  try {
    const { timeRange = '30', mood: moodFilter } = req.query;
    const days = parseInt(timeRange);
    
    let query = { userId: req.user.id };
    
    // Add time filter
    if (days > 0) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query.createdAt = { $gte: startDate };
    }
    
    // Add mood filter
    if (moodFilter && moodFilter !== 'all') {
      query.mood = moodFilter;
    }
    
    const moods = await Mood.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    console.error('Error fetching moods:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new mood entry
const createMood = async (req, res) => {
  try {
    const { mood, intensity, note, triggers, activities } = req.body;
    
    const moodEntry = await Mood.create({
      userId: req.user.id,
      mood,
      intensity: intensity || 5,
      note: note || '',
      triggers: triggers || [],
      activities: activities || []
    });
    
    res.status(201).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    console.error('Error creating mood:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update a mood entry
const updateMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }
    
    res.json({
      success: true,
      data: mood
    });
  } catch (error) {
    console.error('Error updating mood:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a mood entry
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mood:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get mood analytics
const getMoodAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const moods = await Mood.find({
      userId: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
    
    // Mood distribution
    const moodCounts = {};
    const moodScores = [];
    const dailyMoods = {};
    
    moods.forEach(mood => {
      // Count moods
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
      
      // Collect scores for average
      moodScores.push(mood.moodScore);
      
      // Group by day
      const day = mood.createdAt.toISOString().split('T')[0];
      if (!dailyMoods[day]) {
        dailyMoods[day] = [];
      }
      dailyMoods[day].push(mood);
    });
    
    // Calculate averages
    const avgMoodScore = moodScores.length > 0 
      ? Math.round((moodScores.reduce((a, b) => a + b, 0) / moodScores.length) * 10) / 10
      : 0;
    
    const avgIntensity = moods.length > 0
      ? Math.round((moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length) * 10) / 10
      : 0;
    
    // Daily trends
    const dailyTrends = Object.entries(dailyMoods).map(([date, dayMoods]) => ({
      date,
      avgScore: Math.round((dayMoods.reduce((sum, m) => sum + m.moodScore, 0) / dayMoods.length) * 10) / 10,
      avgIntensity: Math.round((dayMoods.reduce((sum, m) => sum + m.intensity, 0) / dayMoods.length) * 10) / 10,
      count: dayMoods.length
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Most common triggers
    const triggerCounts = {};
    moods.forEach(mood => {
      mood.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });
    
    const topTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([trigger, count]) => ({ trigger, count }));
    
    res.json({
      success: true,
      data: {
        totalEntries: moods.length,
        avgMoodScore,
        avgIntensity,
        moodDistribution: moodCounts,
        dailyTrends,
        topTriggers,
        timeRange: days
      }
    });
  } catch (error) {
    console.error('Error fetching mood analytics:', sanitizeForLog(error.message));
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
  getMoodAnalytics
};