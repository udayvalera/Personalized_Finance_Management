const Budget = require("../../models/Budget");
const User = require("../../models/User");

const createBudget = async (req, res) => {
  const { monthlyIncome, savings, expectedExpenses, budgetPeriod } = req.body;
  const userId = req.user.id;
  if (
    !monthlyIncome ||
    !savings ||
    !expectedExpenses ||
    expectedExpenses.length === 0
  ) {
    return res.status(400).json({
      message: "Monthly Income, Savings, and Expected Expenses are required",
    });
  }

  if (monthlyIncome <= 0 || savings < 0) {
    return res.status(400).json({
      message:
        "Monthly Income must be greater than 0 and Savings cannot be negative",
    });
  }

  const totalExpectedExpense = expectedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (monthlyIncome < totalExpectedExpense + savings) {
    return res.status(400).json({
      message:
        "Monthly Income must be greater than the sum of Expected Expenses and Savings",
    });
  }

  try {
    const existingBudget = await Budget.findOne({ userId });

    if (existingBudget) {
      existingBudget.monthlyIncome = monthlyIncome;
      existingBudget.savings = savings;
      existingBudget.expectedExpenses = expectedExpenses;
      existingBudget.budgetPeriod = budgetPeriod || 30;

      await existingBudget.save();
      return res.status(200).json({
        message: "Budget updated successfully",
        budget: existingBudget,
      });
    }

    const newBudget = new Budget({
      userId,
      monthlyIncome,
      savings,
      expectedExpenses,
      budgetPeriod: budgetPeriod || 30,
    });

    await newBudget.save();

    res.status(201).json({
      message: "Budget created successfully",
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getBudget = async (req, res) => {
  const userId = req.user.id;

  try {
    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget fetched successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const editBudget = async (req, res) => {
  const { budgetId } = req.params;
  const { budgetAmount, expectedExpenseAmount, budgetPeriod } = req.body;

  try {
    const budget = await Budget.findOne({ _id: budgetId, userId: req.user.id });
    if (!budget) {
      return res.status(400).json({
        message: "Budget not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const removeBudget = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      username: req.user.username,
    });
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }
    res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createBudget, getBudget, editBudget, removeBudget };
