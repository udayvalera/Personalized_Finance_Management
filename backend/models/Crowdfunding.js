const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  goal_amount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: [1, 'Goal amount must be at least $1']
  },
  current_amount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required'],
    match: [/^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|webp)$/, 'Invalid image URL format']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'business', 'education', 'community', 'environment']
  },
  end_date: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'End date must be in the future'
    }
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: function() {
      return !this.anonymous;
    }
  },
  creator_name: {
    type: String,
    required: function() {
      return !this.anonymous;
    },
    maxlength: [60, 'Creator name cannot exceed 60 characters']
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  proof: {
    type: String,
    required: [true, 'Verification proof is required'],
    maxlength: [1000, 'Proof cannot exceed 1000 characters']
  },
  supporter_count: {
    type: Number,
    default: 0,
    min: [0, 'Supporter count cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'suspended'],
    default: 'pending'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better query performance
campaignSchema.index({ category: 1, status: 1 });
campaignSchema.index({ end_date: 1 });
campaignSchema.index({ current_amount: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
