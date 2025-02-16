import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Trophy, Flame, Medal, Crown, Star, Users } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  current_streak: number;
  tier: string;
  total_points: number;
  email: string;
  isFriend?: boolean; // Added to distinguish friends
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const getBadgeForStreak = (streak: number) => {
  if (streak >= 24) return { name: 'Financial Guru', color: 'text-purple-600' };
  if (streak >= 12) return { name: 'Wealth Builder', color: 'text-yellow-600' };
  if (streak >= 6) return { name: 'Disciplined Saver', color: 'text-blue-600' };
  return { name: 'Novice Saver', color: 'text-green-600' };
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Hardcoded data for demonstration
  const [users] = useState<User[]>([
    { id: '1', full_name: 'John Doe', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', current_streak: 25, tier: 'platinum', total_points: 1200, email: 'john@example.com', isFriend: true },
    { id: '2', full_name: 'Jane Smith', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', current_streak: 15, tier: 'gold', total_points: 800, email: 'jane@example.com', isFriend: false },
    { id: '3', full_name: 'Mike Johnson', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', current_streak: 8, tier: 'silver', total_points: 400, email: 'mike@example.com', isFriend: true },
    { id: '4', full_name: 'Alice Brown', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', current_streak: 30, tier: 'platinum', total_points: 1500, email: 'alice@example.com', isFriend: true },
    { id: '5', full_name: 'Bob White', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', current_streak: 10, tier: 'gold', total_points: 700, email: 'bob@example.com', isFriend: false },
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: '1', name: '100 Days of Savings', description: 'Save consistently for 100 days', icon: '💰', unlocked: true },
    { id: '2', name: '6-Month Money Master', description: 'Maintain a 6-month saving streak', icon: '🏆', unlocked: true },
    { id: '3', name: '1-Year Wealth Champion', description: 'Complete one year of consistent savings', icon: '👑', unlocked: false },
    { id: '4', name: 'Unbreakable Streak', description: 'Maintain a streak for 2 years', icon: '⭐', unlocked: false },
  ]);

  const currentUser = users[0]; // Simulating current user

  // Filter users based on search and only show friends
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && user.isFriend;
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Personal Streak Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Flame className="w-8 h-8 mr-2 animate-pulse" />
              Your Saving Streak
            </h2>
            <p className="text-lg mt-2">
              You're on a {currentUser.current_streak}-month streak! Keep going!
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{currentUser.total_points} pts</p>
            <p className="text-sm opacity-75">Total Points</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(currentUser.current_streak % 12) * 8.33}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 opacity-75">
            {12 - (currentUser.current_streak % 12)} months until next rank
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Friends Tab */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Your Friends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{user.full_name}</h4>
                <p className={`text-sm ${getBadgeForStreak(user.current_streak).color}`}>
                  {getBadgeForStreak(user.current_streak).name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Savings Streak Leaderboard
        </h3>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div 
              key={user.id}
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 animate-pulse' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-4">
                {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                {index === 1 && <Medal className="w-5 h-5 text-gray-500" />}
                {index === 2 && <Medal className="w-5 h-5 text-orange-500" />}
                {index > 2 && <span className="font-semibold">{index + 1}</span>}
              </div>
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{user.full_name}</h4>
                <p className={`text-sm ${getBadgeForStreak(user.current_streak).color}`}>
                  {getBadgeForStreak(user.current_streak).name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{user.current_streak} months</p>
                <p className="text-sm text-gray-500">{user.total_points} points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Star className="w-6 h-6 mr-2" />
          Your Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg text-center transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                  : 'bg-gray-100 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-semibold">{achievement.name}</h4>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}