const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    budgetAmount: {
        type: Number,
        required: true
    },
    expectedExpenseAmount: {
        type: Number,
        required: true,
    },
    budgetPeriod: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;