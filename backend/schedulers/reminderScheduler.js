const cron = require("node-cron");
const User = require("../models/User");
const { sendReminderEmail } = require("../utils/emailUtils");

const initializeReminderScheduler = () => {
  // Run at 6:00 PM every day
  cron.schedule("0 18 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const incompleteUsers = await User.aggregate([
        {
          $lookup: {
            from: "streaks",
            localField: "_id",
            foreignField: "userId",
            as: "streak",
          },
        },
        {
          $match: {
            $or: [
              { "streak.lastActionDate": { $lt: today } },
              { "streak.lastActionDate": { $exists: false } },
            ],
          },
        },
      ]);

      for (const user of incompleteUsers) {
        await sendReminderEmail(user.email);
      }
    } catch (error) {
      console.error("Error sending reminder emails:", error);
    }
  });
};

module.exports = { initializeReminderScheduler };
