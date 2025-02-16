import React from 'react';
import { Crown, Check, Zap } from 'lucide-react';

export default function Upgrade() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Basic Tier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🆓 Basic Tier</h2>
            <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">Free</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Essential personal finance tracking tools</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Core Finance Management</h3>
              <ul className="space-y-2">
                {[
                  'Dashboard Overview',
                  'Income & Expense Tracking',
                  'Basic Budget Planner',
                  'Simple Investment Tracking',
                  'Goals Tracking'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Calendar & Notifications</h3>
              <ul className="space-y-2">
                {[
                  'Basic Calendar View',
                  'Transaction Reminders',
                  'Recurring Expenses'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Security & Data</h3>
              <ul className="space-y-2">
                {[
                  'Secure Login',
                  'Basic Data Export (CSV)',
                  'Manual Backup'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="w-full mt-8 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 px-4 py-1 rounded-bl-lg font-semibold">
            BEST VALUE
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Crown className="w-6 h-6 mr-2" />
              Premium Tier
            </h2>
            <div>
              <span className="text-2xl font-bold">$9.99</span>
              <span className="text-sm">/month</span>
            </div>
          </div>
          <p className="text-gray-100 mb-6">AI-powered insights & advanced features</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Advanced Finance Management</h3>
              <ul className="space-y-2">
                {[
                  'Smart AI Budgeting',
                  'Automated Categorization',
                  'Multi-Account Syncing',
                  'Advanced Investment Insights',
                  'Debt Management Tools'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">AI-Powered Features</h3>
              <ul className="space-y-2">
                {[
                  'Predictive Analysis',
                  'Smart Spending Insights',
                  'Automated Savings Plan',
                  'Fraud Detection',
                  'Advanced Data Visualization'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Premium Perks</h3>
              <ul className="space-y-2">
                {[
                  '24/7 Priority Support',
                  'Custom UI Themes',
                  'Early Access Features',
                  'Advanced Export Options',
                  'Cloud Backup'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="w-full mt-8 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}