import React, { useState, useEffect, memo, useMemo } from 'react';
import axios from 'axios';
import { Plus, X, HandCoins } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Entry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
}

const IncomeExpense: React.FC = memo(() => {
  const AI_URL = 'http://localhost:8080/api/receipt';
  const BASE_URL = 'http://localhost:5050/api/v1/finance/create-expense';

  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    receipt: null as File | null,
  });
  const [aiFile, setAIFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<{ name: string; price: number } | null>(null);
  const [aiCategory, setAICategory] = useState('');
  const [aiDate, setAIDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchData(token);
  }, []);

  const fetchData = async (token: string | null) => {
    if (!token) return;

    try {
      const [incomesRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5050/api/v1/finance/get-incomes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5050/api/v1/finance/get-expenses', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const incomes = incomesRes.data.incomes.map((income: any) => ({
        id: income.id || `income-${Date.now()}-${Math.random()}`,
        type: 'income' as const,
        category: income.category,
        amount: income.amount,
        date: income.date,
      }));

      const expenses = expensesRes.data.expenses.map((expense: any) => ({
        id: expense.id || `expense-${Date.now()}-${Math.random()}`,
        type: 'expense' as const,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
      }));

      setEntries([...incomes, ...expenses]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const incomeData = {
    labels: Array.from(new Set(entries.filter((e) => e.type === 'income').map((e) => e.category))),
    datasets: [
      {
        data: Array.from(new Set(entries.filter((e) => e.type === 'income').map((e) => e.category))).map((category) =>
          entries
            .filter((e) => e.type === 'income' && e.category === category)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)'],
      },
    ],
  };

  const expenseData = {
    labels: Array.from(new Set(entries.filter((e) => e.type === 'expense').map((e) => e.category))),
    datasets: [
      {
        data: Array.from(new Set(entries.filter((e) => e.type === 'expense').map((e) => e.category))).map((category) =>
          entries
            .filter((e) => e.type === 'expense' && e.category === category)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(231, 233, 237, 0.8)',
        ],
      },
    ],
  };

  const memoizedIncomePie = useMemo(() => <Pie data={incomeData} options={{ responsive: true }} />, [incomeData]);
  const memoizedExpensePie = useMemo(() => <Pie data={expenseData} options={{ responsive: true }} />, [expenseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add entries.');
      return;
    }
  
    const { type, category, amount, date } = newEntry;
  
    // Frontend validation
    if (!category || amount <= 0) {
      alert('Category is required and amount must be greater than zero.');
      return;
    }
  
    try {
      const url = type === 'income' 
        ? 'http://localhost:5050/api/v1/finance/create-income' 
        : 'http://localhost:5050/api/v1/finance/create-expense';
  
      const requestBody = type === 'income' 
        ? { amount, category, description: category } // Using category as description
        : { amount, category, description: category, date };
  
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201 || response.status === 200) {
        await fetchData(token); // Refresh data
        setNewEntry({
          type: 'expense',
          category: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          receipt: null,
        });
        setShowModal(false);
        alert('Entry added successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const processReceipt = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Key must be 'file' as expected by Flask
  
    try {
      const response = await axios.post(AI_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setParsedData(response.data);
      setAICategory(response.data.name);
    } catch (error) {
      console.error('AI Processing Error:', error);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
      alert('Failed to process receipt. Please try again.');
    }
  };

  const handleAIConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !parsedData || !aiFile) return;
  
    const expenseData = {
      type: 'expense',
      category: aiCategory || parsedData.name, // Use AI-extracted name if no category is provided
      amount: parsedData.price,
      date: aiDate,
    };
  
    try {
      const expenseResponse = await axios.post(BASE_URL, expenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (expenseResponse.status === 200 || expenseResponse.status === 201) {
        // Refresh data and reset state
        fetchData(token);
        setShowAIModal(false);
        setAIFile(null);
        setParsedData(null);
        setAICategory('');
        setAIDate(new Date().toISOString().split('T')[0]);
        alert('Expense added successfully!');
      } else {
        throw new Error('Failed to create expense');
      }
    } catch (error) {
      console.error('Expense Creation Error:', error);
      alert('Failed to create expense. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Income & Expenses</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Entry</span>
          </button>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <HandCoins className="w-5 h-5" />
            <span>AI Receipt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Income Distribution</h2>
          {memoizedIncomePie}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
          {memoizedExpensePie}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div>
                <h3 className="font-semibold">{entry.category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</p>
              </div>
              <span
                className={`text-lg font-semibold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
              >
                {entry.type === 'income' ? '+' : '-'}${entry.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'income' | 'expense' })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Receipt (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  onChange={(e) => setNewEntry({ ...newEntry, receipt: e.target.files?.[0] || null })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{parsedData ? 'Confirm Expense' : 'Upload Receipt'}</h2>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setParsedData(null);
                  setAIFile(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!parsedData ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiFile) processReceipt(aiFile);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Receipt File</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) => setAIFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Process Receipt
                </button>
              </form>
            ) : (
              <form onSubmit={handleAIConfirm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    value={aiCategory}
                    onChange={(e) => setAICategory(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    value={parsedData.price}
                    onChange={(e) => setParsedData({ ...parsedData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    value={aiDate}
                    onChange={(e) => setAIDate(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Expense
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default IncomeExpense;