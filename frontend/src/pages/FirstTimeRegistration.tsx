import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Wallet, PiggyBank, LineChart, Target, ArrowRight, DollarSign, Building, Briefcase } from 'lucide-react';

interface InvestmentAsset {
  type: string;
  percentage: number;
}

interface FinancialProfile {
  monthlyIncome: number;
  currentDebt: number;
  debtType: string;
  portfolioValue: number;
  investments: InvestmentAsset[];
  primaryGoal: string;
}

// Updated INVESTMENT_TYPES (remove incompatible entries)
const INVESTMENT_TYPES = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'real_estate', label: 'Real Estate' },
];

// Updated FINANCIAL_GOALS (match backend enum exactly)
const FINANCIAL_GOALS = [
  { id: 'Saving for a House', label: 'Saving for a House', icon: Building },
  { id: 'Retirement Planning', label: 'Retirement Planning', icon: Briefcase },
  { id: 'Debt Free Living', label: 'Debt Free Living', icon: DollarSign },
  { id: 'Building an Emergency Fund', label: 'Building an Emergency Fund', icon: PiggyBank },
  { id: 'Other', label: 'Other', icon: Wallet },
];

export default function FirstTimeRegistration() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState<FinancialProfile>({
    monthlyIncome: 0,
    currentDebt: 0,
    debtType: '',
    portfolioValue: 0,
    investments: [],
    primaryGoal: '',
  });

  const handleInvestmentChange = (type: string, percentage: number) => {
    const updatedInvestments = [...profile.investments];
    const existingIndex = updatedInvestments.findIndex((inv) => inv.type === type);

    if (existingIndex >= 0) {
      if (percentage === 0) {
        updatedInvestments.splice(existingIndex, 1);
      } else {
        updatedInvestments[existingIndex].percentage = percentage;
      }
    } else if (percentage > 0) {
      updatedInvestments.push({ type, percentage });
    }

    setProfile({ ...profile, investments: updatedInvestments });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('No user found');

      // Prepare the data for the backend
      const financialData = {
        monthlyIncome: profile.monthlyIncome,
        currentDebts: [
          {
            amount: profile.currentDebt,
            debtType: profile.debtType,
          },
        ],
        investmentPortfolio: {
          totalValue: profile.portfolioValue,
          allocation: {
            stocks: profile.investments.find((inv) => inv.type === 'stocks')?.percentage || 0,
            bonds: profile.investments.find((inv) => inv.type === 'bonds')?.percentage || 0,
            realEstate: profile.investments.find((inv) => inv.type === 'real_estate')?.percentage || 0,
          },
        },
        primaryFinancialGoal: profile.primaryGoal,
      };

      // Send the data to the backend
      const response = await axios.post(
        'http://localhost:5050/api/v1/auth/add-financial-info',
        financialData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 201) {
        navigate('/dashboard');
      } else {
        throw new Error('Failed to save financial profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to FinanceAI</h1>
            <p className="mt-2 text-gray-600">Let's personalize your financial journey</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Monthly Income */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Monthly Income</h2>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={profile.monthlyIncome || ''}
                  onChange={(e) => setProfile({ ...profile, monthlyIncome: Number(e.target.value) })}
                  className="pl-8 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Current Debt */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <PiggyBank className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Current Debt</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={profile.currentDebt || ''}
                    onChange={(e) => setProfile({ ...profile, currentDebt: Number(e.target.value) })}
                    className="pl-8 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <select
                  value={profile.debtType}
                  onChange={(e) => setProfile({ ...profile, debtType: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Debt Type</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Portfolio Value */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <LineChart className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Investment Portfolio</h2>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={profile.portfolioValue || ''}
                    onChange={(e) => setProfile({ ...profile, portfolioValue: Number(e.target.value) })}
                    className="pl-8 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Total portfolio value"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {INVESTMENT_TYPES.map((type) => (
                    <div key={type.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {type.label} %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={profile.investments.find((inv) => inv.type === type.id)?.percentage || ''}
                        onChange={(e) => handleInvestmentChange(type.id, Number(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Goals */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Primary Financial Goal</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FINANCIAL_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, primaryGoal: goal.id })}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        profile.primaryGoal === goal.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${
                        profile.primaryGoal === goal.id ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        profile.primaryGoal === goal.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {goal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}