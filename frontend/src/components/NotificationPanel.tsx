import React from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';

interface Notification {
  id: string;
  type: 'feature' | 'tip' | 'market' | 'alert' | 'reminder';
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'market',
    message: '🚀 Tesla stock is up 7% today! Check your investment portfolio for the latest insights.',
    time: '2 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'alert',
    message: '⚠️ You\'ve spent 80% of your monthly budget for dining out. Consider adjusting your expenses to stay on track!',
    time: '10 minutes ago',
    read: false
  },
  {
    id: '3',
    type: 'reminder',
    message: '🔥 You\'re on a 10-day streak! Keep tracking your expenses to unlock the \'Financial Guru\' badge.',
    time: '30 minutes ago',
    read: false
  },
  {
    id: '4',
    type: 'reminder',
    message: '🏆 Great job! You\'ve reached 50% of your savings goal for that new laptop. Keep going!',
    time: '1 hour ago',
    read: true
  },
  {
    id: '5',
    type: 'market',
    message: '📈 Bitcoin jumps 7% today! See how your portfolio is affected.',
    time: '2 hours ago',
    read: true
  }
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-blue-500" />
            <h3 className="ml-2 font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button className="w-full text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center">
          View All Notifications
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}