const Goal = require("../../models/Goal");

// Create a new financial goal
const createGoal = async (req, res) => {
  const { goalName, goalAmount, currentSavings } = req.body;

  if (!goalName || !goalAmount) {
    return res
      .status(400)
      .json({ message: "Goal name and amount are required" });
  }

  if (goalAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Goal amount must be greater than zero" });
  }

  if (currentSavings < 0) {
    return res
      .status(400)
      .json({ message: "Current savings cannot be negative" });
  }

  try {
    const goal = new Goal({
      userId: req.user.id, // Use MongoDB ObjectId for user reference
      goalName,
      goalAmount,
      currentSavings: currentSavings || 0, // Default to 0 if not provided
    });

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all financial goals for a user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ date: -1 });
    if (!goals || goals.length === 0) {
      return res.status(200).json({ message: "No goals found", goals: [] });
    }

    res.status(200).json({ goals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit an existing financial goal
const editGoal = async (req, res) => {
  const { goalId } = req.params;
  const { goalName, goalAmount, currentSavings } = req.body;

  try {
    const goal = await Goal.findOne({ _id: goalId, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goalName) goal.goalName = goalName;
    if (goalAmount) {
      if (goalAmount <= 0) {
        return res
          .status(400)
          .json({ message: "Goal amount must be greater than zero" });
      }
      goal.goalAmount = goalAmount;
    }
    if (currentSavings !== undefined) {
      if (currentSavings < 0) {
        return res
          .status(400)
          .json({ message: "Current savings cannot be negative" });
      }
      goal.currentSavings = currentSavings;
    }

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a financial goal
const removeGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    const goal = await Goal.findOneAndDelete({
      _id: goalId,
      userId: req.user.id,
    });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createGoal, getGoals, editGoal, removeGoal };
