const Streak = require("../../models/Streak");
const User = require("../../models/User");
const { sendReminderEmail } = require("../utils/emailUtils");

const updateStreak = async (userId) => {
  try {
    const streak = await Streak.findOne({ userId });
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!streak) {
      return await Streak.create({
        userId,
        currentStreak: 1,
        lastActionDate: now,
        longestStreak: 1,
      });
    }

    const lastAction = new Date(streak.lastActionDate);
    const lastActionDay = new Date(
      lastAction.getFullYear(),
      lastAction.getMonth(),
      lastAction.getDate()
    );

    // If action already completed today
    if (lastActionDay.getTime() === today.getTime()) {
      return streak;
    }

    // If streak should continue (last action was yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActionDay.getTime() === yesterday.getTime()) {
      streak.currentStreak += 1;
      streak.longestStreak = Math.max(
        streak.currentStreak,
        streak.longestStreak
      );
    } else {
      // Streak broken
      streak.currentStreak = 1;
    }

    streak.lastActionDate = now;
    return await streak.save();
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
};
