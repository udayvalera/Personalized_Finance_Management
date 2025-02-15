// src/pages/Goals.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Goal {
  _id: string;
  goalName: string;
  goalAmount: number;
  currentSavings: number;
}

const API_BASE_URL = 'http://localhost:5050/api/v1/finance';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<{ goalName: string; goalAmount: number }>({ goalName: '', goalAmount: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user may not be authenticated.");
        return;
      }


      const response = await axios.get(`${API_BASE_URL}/get-goals`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Goals fetched successfully:", response.data);
      setGoals(response.data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddGoal = async () => {
    if (!newGoal.goalName || newGoal.goalAmount <= 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user may not be authenticated.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/create-goal`,
        { ...newGoal },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals([...goals, response.data]);
      setNewGoal({ goalName: '', goalAmount: 0 });
    } catch (error) {
      console.error('Error adding goal:', error.response?.data || error.message);
    }
  };


  const handleDeleteGoal = async (goalId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user may not be authenticated.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/remove-goal/${goalId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error.response?.data || error.message);
    }
  };


  const calculateGoalProgress = (goal: Goal) => {
    return (goal.currentSavings / goal.goalAmount) * 100;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Financial Goals</h1>

      {/* Goal Creation Form */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Create New Goal</h2>
        <input
          type="text"
          className="p-2 w-full mt-2 mb-4 border rounded"
          placeholder="Goal Name"
          value={newGoal.goalName}
          onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
        />
        <input
          type="number"
          className="p-2 w-full mb-4 border rounded"
          placeholder="Goal Price"
          value={newGoal.goalAmount}
          onChange={(e) => setNewGoal({ ...newGoal, goalAmount: +e.target.value })}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAddGoal}
        >
          Add Goal
        </button>
      </div>

      {/* List of Goals */}
      <div>
        {goals.length === 0 ? (
          <p>No goals set yet. Add a new goal above.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal._id} className="bg-gray-100 p-4 rounded shadow mb-6">
              <h3 className="text-xl font-semibold">{goal.goalName}</h3>
              <p className="text-lg">Goal Price: <strong>${goal.goalAmount.toFixed(2)}</strong></p>
              <p className="text-lg">Current Savings: <strong>${goal.currentSavings.toFixed(2)}</strong></p>
              <div className="mt-4">
                <p>Progress: {calculateGoalProgress(goal).toFixed(2)}%</p>
                <div className="h-2 bg-gray-300 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${calculateGoalProgress(goal).toFixed(2)}%` }}
                  ></div>
                </div>
              </div>
              <button
                className="bg-red-500 text-white p-2 rounded mt-4"
                onClick={() => handleDeleteGoal(goal._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
