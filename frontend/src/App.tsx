import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import IncomeExpense from './pages/IncomeExpense';
import BudgetPlanner from './pages/BudgetPlanner';
import InvestmentPortfolio from './pages/InvestmentPortfolio';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Upgrade from './pages/Upgrade';
import Profile from './pages/Profile';
import FirstTimeRegistration from './pages/FirstTimeRegistration';
import Crowdfunding from './pages/Crowdfunding';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/first-time-setup" element={<FirstTimeRegistration />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/income-expense" element={<IncomeExpense />} />
              <Route path="/budget" element={<BudgetPlanner />} />
              <Route path="/investments" element={<InvestmentPortfolio />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/crowdfunding" element={<Crowdfunding />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App