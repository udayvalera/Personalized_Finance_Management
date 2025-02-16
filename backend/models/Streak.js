const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastActionDate: {
    type: Date,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
});

const Streak = mongoose.model("Streak", streakSchema);
module.exports = Streak;
