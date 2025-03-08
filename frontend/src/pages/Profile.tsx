import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Shield, Settings, Bell, Download, Users, HelpCircle,
  Camera, Check, Lock, CreditCard, Trash2, Award, Flame,
  Moon, Sun, Globe, DollarSign, Share2, MessageCircle
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  // Hardcoded data for demonstration
  const userData = {
    fullName: user?.username,
    email: user?.email,
    accountType: 'Basic',
    memberSince: '2024-01-01',
    healthScore: 85,
    streak: 10,
    balance: 25000,
    recentTransactions: [
      { id: 1, type: 'expense', amount: 50, category: 'Food', date: '2024-01-15' },
      { id: 2, type: 'income', amount: 2000, category: 'Salary', date: '2024-01-10' },
      { id: 3, type: 'expense', amount: 100, category: 'Transport', date: '2024-01-08' },
    ],
    goals: [
      { id: 1, name: 'New Car', target: 20000, current: 15000 },
      { id: 2, name: 'Vacation', target: 5000, current: 2500 },
    ],
    achievements: [
      { id: 1, name: 'Budget Master', icon: '🎯' },
      { id: 2, name: 'Saving Star', icon: '⭐' },
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userData.fullName}</h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                  {userData.email} <Check className="w-4 h-4 text-green-500 ml-1" />
                </p>
                <p className="text-sm text-gray-500">Member since {userData.memberSince}</p>
              </div>
            </div>

            {/* Financial Health Score */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Financial Health Score</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{userData.healthScore}/100</span>
                <div className="h-4 w-48 bg-white/20 rounded-full">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${userData.healthScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak & Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center space-x-2 text-orange-500">
                  <Flame className="w-6 h-6" />
                  <span className="text-xl font-bold">0 Day Streak!</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Current Balance</h3>
                <p className="text-2xl font-bold">${userData.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {userData.recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" /> Security
              </h3>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Change Password
                </button>
                <div className="flex items-center justify-between px-4 py-2 border rounded-lg">
                  <span>Two-Factor Authentication</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <h3 className="text-red-600 font-semibold mb-4">Danger Zone</h3>
              <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40">
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'info'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}