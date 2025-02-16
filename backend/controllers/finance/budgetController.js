const Budget = require("../../models/Budget");
const User = require("../../models/User");

const createBudget = async(req, res) => {
    const { userId, budgetAmount, expectedExpenseAmount, budgetPeriod } = req.body;

    if (!budgetAmount || !expectedExpenseAmount) {
        return res.status(400).json({
            message: "Budget Amount and/or Expected Expense Amount are required"
        });
    }

    if (budgetAmount < expectedExpenseAmount) {
        return res.status(400).json({
            message : "Budget Amount must be greater than Expected Expense"
        });
    }

    if (budgetAmount <= 0 || expectedExpenseAmount <=0 ){
        return res.status(400).json({
            message : "Budget Amount and/or Expected Expense Amount must be greater than 0"
        });
    }


}

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({userId: req.user.id}).sort({date: -1});

        if (!expenses || expenses.length === 0){
            return res.status(200).json({
                message: "No Budget found", expenses: []
            })
        }

        res.status(200).json({ expenses });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error", error: error.message
        });
    }

}

const editBudget = async (req, res) => {
    const { budgetId } = req.params;
    const { budgetAmount, expectedExpenseAmount, budgetPeriod } = req.body;

    try {
        const budget = await Budget.findOne({ _id: budgetId, userId: req.user.id});
        if (!budget) {
            return res.status(400).json({
                message: "Budget not found"
            })
        }



        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
const removeBudget = async (req, res) => {
    const { budgetId } = req.params;

    try {
        const budget = await Budget.findOneAndDelete({
            _id : budgetId, username: req.user.username
        });
        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }
        res.status(200).json({
            message: "Goal deleted successfully"
        });
    }
    catch(error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports = { createBudget, getBudgets, editBudget, removeBudget };