const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/finance/expenseController");
const {
  createGoal,
  getGoals,
  editGoal,
  removeGoal,
} = require("../controllers/finance/goalController");
const {
  createBudget,
  getBudget,
  editBudget,
  removeBudget,
} = require("../controllers/finance/budgetController");
const {
  createIncome,
  getIncomes,
  editIncome,
  removeIncome,
} = require("../controllers/finance/incomeController");

//Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Finance route" });
});

router.post("/create-expense", createExpense);
router.get("/get-expenses", getExpenses);
router.post("/update-expense/:id", updateExpense);
router.delete("/delete-expense/:id", deleteExpense);

router.post("/create-goal", createGoal);
router.get("/get-goals", getGoals);
router.post("/edit-goal/:goalId", editGoal);
router.delete("/remove-goal/:goalId", removeGoal);

router.post("/create-budget", createBudget);
router.get("/get-budget", getBudget);
router.post("/edit-budget/:budgetId", editBudget);
router.delete("/remove-budget/:budgetId", removeBudget);

router.post("/create-income", createIncome);
router.get("/get-incomes", getIncomes);
router.post("/edit-income/:incomeId", editIncome);
router.delete("/remove-income/:incomeId", removeIncome);

module.exports = router;
