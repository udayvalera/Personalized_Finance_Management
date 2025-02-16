const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        goalName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        goalAmount: {
            type: Number,
            required: true,
            min: 1,
        },
        currentSavings: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;
