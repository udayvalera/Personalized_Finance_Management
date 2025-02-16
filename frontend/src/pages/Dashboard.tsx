import React from 'react';
import { LineChart, PieChart, Wallet, TrendingUp, Target, Brain } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Hardcoded data for demonstration
  const data = {
    bank_balance: 25000,
    total_savings: 15000,
    monthly_budget: 5000,
    monthly_expenses: 3500,
    portfolio_value: 50000,
    karma_score: 85,
    goals: [
      { name: 'New Car', target: 30000, current: 24000 },
      { name: 'Emergency Fund', target: 10000, current: 7000 },
      { name: 'Vacation', target: 5000, current: 2500 }
    ]
  };

  const getHighestProgressGoal = () => {
    return data.goals.reduce((prev, current) => {
      const prevProgress = (prev.current / prev.target) * 100;
      const currentProgress = (current.current / current.target) * 100;
      return currentProgress > prevProgress ? current : prev;
    });
  };

  const highestProgressGoal = getHighestProgressGoal();
  const progressPercentage = (highestProgressGoal.current / highestProgressGoal.target) * 100;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bank Balance</p>
              <h3 className="text-2xl font-bold">${data.bank_balance.toLocaleString()}</h3>
            </div>
            <Wallet className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
              <h3 className="text-2xl font-bold">${data.total_savings.toLocaleString()}</h3>
            </div>
            <LineChart className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
              <h3 className="text-2xl font-bold">${data.portfolio_value.toLocaleString()}</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Financial Karma Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Financial Karma Score</h3>
            </div>
            <p className="text-sm opacity-80 mt-1">AI-driven financial wellness indicator</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold">{data.karma_score}</span>
            <span className="text-xl">/100</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${data.karma_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Monthly Budget Summary</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
            <p className="text-lg font-semibold">${data.monthly_budget.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
            <p className="text-lg font-semibold">${data.monthly_expenses.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
            <p className="text-lg font-semibold">${(data.monthly_budget - data.monthly_expenses).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(data.monthly_expenses / data.monthly_budget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Goal Progress */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Top Goal Progress</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progressPercentage.toFixed(1)}% Complete
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{highestProgressGoal.name}</span>
            <span>${highestProgressGoal.current.toLocaleString()} / ${highestProgressGoal.target.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;