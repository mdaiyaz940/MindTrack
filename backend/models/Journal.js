const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'tired', 'stressed'],
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  sentiment: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 }
  },
  wordCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
journalSchema.index({ userId: 1, createdAt: -1 });
journalSchema.index({ userId: 1, tags: 1 });

// Pre-save middleware to calculate word count
journalSchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  next();
});

module.exports = mongoose.model('Journal', journalSchema);