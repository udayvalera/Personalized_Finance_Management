const Income = require("../../models/Income");

// Create a new income record
const createIncome = async (req, res) => {
  const { amount, category, description } = req.body;

  if (!amount || !category || !description) {
    return res
      .status(400)
      .json({ message: "Amount, category, and description are required" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be greater than zero" });
  }

  try {
    const income = new Income({
      userId: req.user.id, // Assuming the user ID is available in req.user.id
      amount,
      category,
      description,
    });

    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all income records for a user
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({
      date: -1,
    });
    // console.log(incomes);
    if (!incomes || incomes.length === 0) {
      return res.status(200).json({ message: "No incomes found", incomes: [] });
    }

    res.status(200).json({ incomes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit an existing income record
const editIncome = async (req, res) => {
  const { incomeId } = req.params;
  const { amount, category, description } = req.body;

  try {
    const income = await Income.findOne({ _id: incomeId, userId: req.user.id });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (amount) {
      if (amount <= 0) {
        return res
          .status(400)
          .json({ message: "Amount must be greater than zero" });
      }
      income.amount = amount;
    }
    if (category) income.category = category;
    if (description) income.description = description;

    const updatedIncome = await income.save();
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove an income record
const removeIncome = async (req, res) => {
  const { incomeId } = req.params;

  try {
    const income = await Income.findOneAndDelete({
      _id: incomeId,
      userId: req.user.id,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createIncome, getIncomes, editIncome, removeIncome };
