const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'tired', 'stressed'],
    lowercase: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  note: {
    type: String,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    trim: true
  },
  triggers: [{
    type: String,
    trim: true
  }],
  activities: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ userId: 1, createdAt: -1 });
moodSchema.index({ userId: 1, mood: 1 });

// Virtual for mood score (for analytics)
moodSchema.virtual('moodScore').get(function() {
  const moodScores = {
    happy: 8, excited: 9, neutral: 5, 
    tired: 3, anxious: 2, sad: 1, angry: 1, stressed: 2
  };
  return moodScores[this.mood] || 5;
});

module.exports = mongoose.model('Mood', moodSchema);