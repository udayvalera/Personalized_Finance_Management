const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Debt sub-schema
const DebtSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  debtType: {
    type: String,
    enum: [
      "Credit Card",
      "Student Loan",
      "Mortgage",
      "Car Loan",
      "Personal Loan",
      "Other",
    ],
    required: true,
  },
});

// Define the Investment Portfolio sub-schema
const InvestmentPortfolioSchema = new Schema({
  totalValue: {
    type: Number,
    required: true,
  },
  allocation: {
    stocks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    bonds: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    realEstate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
});

// Define the FinancialProfile schema
const FinancialProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    monthlyIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    currentDebts: [DebtSchema],
    investmentPortfolio: InvestmentPortfolioSchema,
    primaryFinancialGoal: {
      type: String,
      enum: [
        "Saving for a House",
        "Retirement Planning",
        "Debt Free Living",
        "Building an Emergency Fund",
        "Other",
      ],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the FinancialProfile model
const FinancialProfile = mongoose.model(
  "FinancialProfile",
  FinancialProfileSchema
);

module.exports = FinancialProfile;
