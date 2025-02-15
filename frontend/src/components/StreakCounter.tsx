import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full">
      <Flame className="w-5 h-5 animate-pulse" />
      <span className="font-bold">{streak} day streak!</span>
    </div>
  );
}