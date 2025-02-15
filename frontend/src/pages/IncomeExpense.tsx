import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
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

const IncomeExpense: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    receipt: null as File | null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      Promise.all([
        axios.get('http://localhost:5050/api/v1/finance/get-incomes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5050/api/v1/finance/get-expenses', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]).then(([incomesRes, expensesRes]) => {
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
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  const incomeData = {
    labels: Array.from(new Set(entries.filter(e => e.type === 'income').map(e => e.category))),
    datasets: [{
      data: Array.from(new Set(entries.filter(e => e.type === 'income').map(e => e.category)))
        .map(category =>
          entries
            .filter(e => e.type === 'income' && e.category === category)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };

  const expenseData = {
    labels: Array.from(new Set(entries.filter(e => e.type === 'expense').map(e => e.category))),
    datasets: [{
      data: Array.from(new Set(entries.filter(e => e.type === 'expense').map(e => e.category)))
        .map(category =>
          entries
            .filter(e => e.type === 'expense' && e.category === category)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(231, 233, 237, 0.8)'
      ]
    }]
  };

  // console.log(incomeData, expenseData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Income & Expenses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Income Distribution</h2>
          <Pie data={incomeData} options={{ responsive: true }} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
          <Pie data={expenseData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.type === 'income'
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div>
                <h3 className="font-semibold">{entry.category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</p>
              </div>
              <span className={`text-lg font-semibold ${
                entry.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
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
    </div>
  );
};

export default IncomeExpense;