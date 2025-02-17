import React, { useState } from 'react';
import { HandCoins, Plus, X, Check } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseCategory {
  name: string;
  subcategories: string[];
}

const expenseCategories: ExpenseCategory[] = [
  {
    name: 'Essential Living',
    subcategories: ['Rent', 'Utilities', 'Groceries', 'Transport']
  },
  {
    name: 'Loans & Debts',
    subcategories: ['Credit Card', 'Car Loan', 'Student Loan']
  },
  {
    name: 'Subscriptions',
    subcategories: ['Netflix', 'Spotify', 'Cloud Storage']
  },
  {
    name: 'Insurance',
    subcategories: ['Health', 'Car', 'Life']
  },
  {
    name: 'Investments & Savings',
    subcategories: ['Retirement', 'Stocks', 'Emergency Fund']
  },
  {
    name: 'Family & Childcare',
    subcategories: ['School Fees', 'Pet Expenses', 'Elderly Care']
  },
  {
    name: 'Miscellaneous',
    subcategories: ['Donations', 'Club Memberships', 'Household Help']
  }
];

interface Expense {
  category: string;
  subcategory: string;
  amount: number;
  description: string;
}

interface AIBudgetRecommendation {
  income: number;
  savings: number;
  expenses: Array<{
    category: string;
    allocated_amount: number;
    actual_spent?: number;
  }>;
}

const BudgetPlanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIBudgetRecommendation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetDescription, setBudgetDescription] = useState('');
  const [newExpense, setNewExpense] = useState({
    category: '',
    subcategory: '',
    amount: 0,
    description: ''
  });
  const handleAIBudgetPlan = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: budgetDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI budget recommendations');
      }
      console.log('API Response:', response);
      const data = await response.json();
      setAiRecommendation(data);
      setShowAIModal(false);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };
  // Hardcoded expenses data
  // Update expenses state to be mutable
  const [expenses, setExpenses] = useState<Expense[]>([
    { category: 'Essential Living', subcategory: 'Rent', amount: 1500, description: 'Monthly rent' },
    { category: 'Essential Living', subcategory: 'Utilities', amount: 200, description: 'Electricity and water' },
    { category: 'Subscriptions', subcategory: 'Netflix', amount: 15, description: 'Monthly subscription' },
    { category: 'Insurance', subcategory: 'Health', amount: 300, description: 'Health insurance' }
  ]);

  const chartData = {
    labels: Array.from(new Set(expenses.map(e => e.category))),
    datasets: [
      {
        data: Array.from(new Set(expenses.map(e => e.category))).map(category =>
          expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(231, 233, 237, 0.8)'
        ]
      }
    ]
  };

  const handleAddExpense = () => {
    // Add expense logic here
    setShowModal(false);
    setNewExpense({ category: '', subcategory: '', amount: 0, description: '' });
  };

  const handleConfirmBudget = () => {
    if (!aiRecommendation) return;

    // Map AI recommendations to expense format
    const newExpenses: Expense[] = aiRecommendation.expenses.map(expense => {
      // Find the closest matching category from expenseCategories
      const matchingCategory = expenseCategories.find(cat => 
        cat.name.toLowerCase().includes(expense.category.toLowerCase()) ||
        cat.subcategories.some(sub => sub.toLowerCase().includes(expense.category.toLowerCase()))
      );

      return {
        category: matchingCategory?.name || 'Miscellaneous',
        subcategory: expense.category, // Use the API category as subcategory
        amount: expense.allocated_amount,
        description: `AI recommended budget: ${expense.allocated_amount}`
      };
    });

    // Update expenses state
    setExpenses(newExpenses);
    
    // Close confirmation modal and show success message
    setShowConfirmationModal(false);
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Planner</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <HandCoins className="w-5 h-5" />
            <span>AI Budget Planner</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expected Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
        <div className="w-full max-w-md mx-auto">
          <Pie data={chartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Expense List</h2>
        <div className="space-y-4">
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{expense.subcategory}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expense.description}</p>
              </div>
              <span className="text-lg font-semibold">${expense.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Expected Expense</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subcategory</label>
                <select
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newExpense.subcategory}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, subcategory: e.target.value })
                  }
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory &&
                    expenseCategories
                      .find((cat) => cat.name === selectedCategory)
                      ?.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, description: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleAddExpense}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Budget Planner Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">AI Budget Planner</h2>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Describe Your Budget Needs</label>
                <textarea
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[150px]"
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                  placeholder="Example: I earn $5000 monthly and need help planning my budget. My main expenses are:
- $1500 for rent
- $400 for utilities
- $600 for groceries
- $300 for car payment
I want to save for retirement and build an emergency fund. Please help me create a balanced budget plan."
                />
              </div>

              <button
                onClick={handleAIBudgetPlan}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get AI Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Budget plan successfully applied!</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && aiRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Budget Plan</h2>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Monthly Income:</p>
                <p className="text-lg">${aiRecommendation.income}</p>
              </div>

              <div className="border-b pb-2">
                <p className="font-medium">Recommended Savings:</p>
                <p className="text-lg">${aiRecommendation.savings}</p>
              </div>

              <div>
                <p className="font-medium mb-2">Recommended Expenses:</p>
                <div className="space-y-2">
                  {aiRecommendation.expenses.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span>{expense.category}</span>
                      <span>${expense.allocated_amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBudget}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;