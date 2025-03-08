const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthlyIncome: {
      type: Number,
      required: true,
    },
    savings: {
      type: Number,
      required: true,
    },
    expectedExpenses: [
      {
        category: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    budgetPeriod: {
      type: Number,
      default: 30, // Default to 30 days
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
