import React, { useState, useEffect, memo } from 'react';
import { HandCoins, Plus, X, Check } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useAsyncValue } from 'react-router-dom';

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

const BudgetPlanner: React.FC = memo(() => {
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIBudgetRecommendation | null>(null);
  const [budgetDescription, setBudgetDescription] = useState('');
  const [budgetDetails, setBudgetDetails] = useState({
    monthlyIncome: 0,
    savings: 0,
    expectedExpenses: [],
  });
  
  const [newExpense, setNewExpense] = useState({
    category: '',
    subcategory: '',
    amount: 0,
    description: ''
  });

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('http://localhost:5050/api/v1/finance/get-budget', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch budget');
      }

      const data = await response.json();
      const { monthlyIncome, savings, expectedExpenses } = data.budget;

      // Update budget details state
      setBudgetDetails({
        monthlyIncome,
        savings,
        expectedExpenses: expectedExpenses.map((exp: any) => ({
          category: exp.category,
          subcategory: exp.subcategory || '',
          amount: exp.amount,
          description: exp.description || '',
        })),
      });

      // Map expected expenses to expenses state
      const mappedExpenses: Expense[] = expectedExpenses.map((exp: any) => ({
        category: exp.category,
        subcategory: exp.subcategory || exp.category,
        amount: exp.amount,
        description: exp.description || '',
      }));

      setExpenses(mappedExpenses);
    } catch (error) {
      console.error('Error fetching budget:', error);
      // Optionally show error to user
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);


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
      console.log('API Response:', response.body);
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

  const handleAddExpense = async () => {
    const { monthlyIncome, savings, expectedExpenses } = budgetDetails;

    if (!monthlyIncome || !savings || !expectedExpenses || expectedExpenses.length === 0) {
      alert('Monthly Income, Savings, and Expected Expenses are required');
      return;
    }

    if (monthlyIncome <= 0 || savings < 0) {
      alert('Monthly Income must be greater than 0 and Savings cannot be negative');
      return;
    }

    const totalExpectedExpense = expectedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    if (monthlyIncome < totalExpectedExpense + savings) {
      alert('Monthly Income must be greater than the sum of Expected Expenses and Savings');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await fetch('http://localhost:5050/api/v1/finance/create-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monthlyIncome,
          savings,
          expectedExpenses: expectedExpenses.map((expense) => ({
            category: expense.category,
            subcategory: expense.subcategory,
            amount: expense.amount,
            description: expense.description || '',
          })),
          budgetPeriod: 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create budget');
      }

      const data = await response.json();
      console.log('Budget created:', data);

      await fetchBudget();
      setShowModal(false);
      setBudgetDetails({ monthlyIncome: 0, savings: 0, expectedExpenses: [] });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Budget creation error:', error);
      alert(error.message || 'An error occurred while creating the budget');
    }
  };

  const handleConfirmBudget = async () => {
    if (!aiRecommendation) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');
  
      // Map AI recommendations to backend expected format
      const expectedExpenses = aiRecommendation.expenses.map(expense => {
        const matchingCategory = expenseCategories.find(cat => 
          cat.name.toLowerCase().includes(expense.category.toLowerCase()) ||
          cat.subcategories.some(sub => sub.toLowerCase().includes(expense.category.toLowerCase()))
        );
  
        return {
          category: matchingCategory?.name || 'Miscellaneous',
          subcategory: expense.category,
          amount: expense.allocated_amount,
          description: `AI recommended: ${expense.allocated_amount}`
        };
      });
  
      // Send request to create/update budget
      const response = await fetch('http://localhost:5050/api/v1/finance/create-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monthlyIncome: aiRecommendation.income,
          savings: aiRecommendation.savings,
          expectedExpenses: expectedExpenses,
          budgetPeriod: 30
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save budget');
      }
  
      // Refresh budget data and UI
      await fetchBudget();
      
      setShowConfirmationModal(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Budget save error:', error);
      alert(error.message || 'Error saving budget to server');
    }
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
        <h2 className="text-xl font-semibold">Add Budget Details</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Income</label>
          <input
            type="number"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            value={budgetDetails.monthlyIncome}
            onChange={(e) =>
              setBudgetDetails({ ...budgetDetails, monthlyIncome: Number(e.target.value) })
            }
          />
        </div>

        {/* Savings */}
        <div>
          <label className="block text-sm font-medium mb-1">Savings</label>
          <input
            type="number"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            value={budgetDetails.savings}
            onChange={(e) =>
              setBudgetDetails({ ...budgetDetails, savings: Number(e.target.value) })
            }
          />
        </div>

        {/* Expected Expenses */}
        <div>
          <h3 className="text-lg font-semibold">Expected Expenses</h3>
          {budgetDetails.expectedExpenses.map((expense, index) => (
            <div key={index} className="space-y-2">
              {/* Category Dropdown */}
              <label className="block text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={expense.category}
                onChange={(e) => {
                  const newExpenses = [...budgetDetails.expectedExpenses];
                  newExpenses[index].category = e.target.value;
                  newExpenses[index].subcategory = ''; // Reset subcategory
                  setBudgetDetails({ ...budgetDetails, expectedExpenses: newExpenses });
                }}
              >
                <option value="">Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Subcategory Dropdown */}
              <label className="block text-sm font-medium">Subcategory</label>
              <select
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={expense.subcategory}
                onChange={(e) => {
                  const newExpenses = [...budgetDetails.expectedExpenses];
                  newExpenses[index].subcategory = e.target.value;
                  setBudgetDetails({ ...budgetDetails, expectedExpenses: newExpenses });
                }}
                disabled={!expense.category}
              >
                <option value="">Select Subcategory</option>
                {expense.category &&
                  expenseCategories
                    .find((cat) => cat.name === expense.category)
                    ?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
              </select>

              {/* Amount Input */}
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={expense.amount}
                onChange={(e) => {
                  const newExpenses = [...budgetDetails.expectedExpenses];
                  newExpenses[index].amount = Number(e.target.value);
                  setBudgetDetails({ ...budgetDetails, expectedExpenses: newExpenses });
                }}
              />
            </div>
          ))}

          {/* Add Expense Button */}
          <button
            onClick={() =>
              setBudgetDetails((prev) => ({
                ...prev,
                expectedExpenses: [...prev.expectedExpenses, { category: '', subcategory: '', amount: 0 }]
              }))
            }
            className="mt-2 text-blue-600 hover:underline"
          >
            + Add Expense
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddExpense}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Budget
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
});

export default BudgetPlanner;