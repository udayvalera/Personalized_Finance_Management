import React from 'react';
import { Trophy, Star, Target, Heart, Calendar, Brain, Rocket, Award } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  earned: boolean;
  progress: number;
  date?: string;
}

export default function Achievements() {
  // Hardcoded achievements data for demonstration
  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Goal Crusher',
      description: 'Hit your first savings goal',
      points: 50,
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      earned: true,
      progress: 100,
      date: '2025-01-15'
    },
    {
      id: '2',
      name: 'Helper Hero',
      description: 'Made your first community donation',
      points: 30,
      icon: <Heart className="w-8 h-8 text-red-500" />,
      earned: true,
      progress: 100,
      date: '2025-01-10'
    },
    {
      id: '3',
      name: 'Consistency Champ',
      description: 'Maintained budget for 3 months',
      points: 100,
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      earned: false,
      progress: 66
    },
    {
      id: '4',
      name: 'Wise Mentor',
      description: 'Received 10 upvotes on financial advice',
      points: 20,
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      earned: false,
      progress: 70
    },
    {
      id: '5',
      name: 'Debt Destroyer',
      description: 'Reduced debt by 10%',
      points: 75,
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      earned: true,
      progress: 100,
      date: '2025-01-01'
    }
  ];

  const totalPoints = achievements.reduce((sum, achievement) => 
    sum + (achievement.earned ? achievement.points : 0), 0);

  const getTrophyTier = (points: number) => {
    if (points >= 1000) return { name: 'Money Master', icon: '🌟', color: 'text-yellow-500' };
    if (points >= 501) return { name: 'Finance Guru', icon: '🏅', color: 'text-yellow-600' };
    if (points >= 201) return { name: 'Rising Star', icon: '💼', color: 'text-blue-500' };
    return { name: 'Seed Saver', icon: '🌱', color: 'text-green-500' };
  };

  const currentTier = getTrophyTier(totalPoints);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Trophy Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Karma</h1>
            <p className="text-gray-600 dark:text-gray-400">Your journey to financial mastery</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentTier.icon} {totalPoints} pts
            </p>
            <p className={`font-semibold ${currentTier.color}`}>{currentTier.name}</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Current Tier</span>
            <span>Next Tier</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalPoints % 500) / 5, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 ${
              achievement.earned ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{achievement.points} pts</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
                {achievement.earned && achievement.date && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Earned on {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unlocked Features */}
      {totalPoints >= 1000 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Unlocked Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Detailed insights into your financial patterns</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white">Tax Calculator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Premium tax optimization tools</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white">Investment Advisor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered investment recommendations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}