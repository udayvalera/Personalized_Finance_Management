const express = require("express");
const router = express.Router();

const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require("../controllers/finance/expenseController")
const { createGoal, editGoal, removeGoal } = require("../controllers/finance/goalController");


router.post("/create-expense", createExpense);
router.get("/get-expenses", getExpenses);
router.post("/update-expense/:id", updateExpense);
router.delete("/delete-expense/:id", deleteExpense);

router.post("/create-goal", createGoal);
router.post("/edit-goal/:goalId", editGoal);
router.delete("/remove-goal/:goalId", removeGoal);

module.exports = router;
