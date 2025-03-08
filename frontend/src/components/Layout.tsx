import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import ChatBot from './ChatBot';
import {
  LayoutDashboard,
  WalletCards,
  PiggyBank,
  TrendingUp,
  Target,
  Settings,
  Bell,
  User,
  LogOut,
  Trophy,
  Medal,
  Menu,
  X,
  HandHeart
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
}

function NavItem({ to, icon, label, isActive, isSidebarCollapsed }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      {!isSidebarCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={toggleMobileSidebar} />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside 
          className={`hidden md:block fixed top-16 bottom-0 left-0 z-30 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>

          <nav className="p-4 space-y-1">
            <NavItem
              to="/"
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              isActive={location.pathname === '/'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/income-expense"
              icon={<WalletCards className="w-5 h-5" />}
              label="Income & Expenses"
              isActive={location.pathname === '/income-expense'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/budget"
              icon={<PiggyBank className="w-5 h-5" />}
              label="Budget Planner"
              isActive={location.pathname === '/budget'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/investments"
              icon={<TrendingUp className="w-5 h-5" />}
              label="Investments"
              isActive={location.pathname === '/investments'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/goals"
              icon={<Target className="w-5 h-5" />}
              label="Goals"
              isActive={location.pathname === '/goals'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/crowdfunding"
              icon={<HandHeart className="w-5 h-5" />}
              label="Crowdfunding"
              isActive={location.pathname === '/crowdfunding'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/achievements"
              icon={<Trophy className="w-5 h-5" />}
              label="Achievements"
              isActive={location.pathname === '/achievements'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <NavItem
              to="/leaderboard"
              icon={<Medal className="w-5 h-5" />}
              label="Leaderboard"
              isActive={location.pathname === '/leaderboard'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <NavItem
              to="/settings"
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              isActive={location.pathname === '/settings'}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <button
              onClick={() => logout()}
              className={`flex items-center w-full mt-2 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
                isSidebarCollapsed ? 'justify-center' : 'space-x-3'
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={toggleMobileSidebar}
            />
            
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={toggleMobileSidebar}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                <NavItem
                  to="/"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                  isActive={location.pathname === '/'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/income-expense"
                  icon={<WalletCards className="w-5 h-5" />}
                  label="Income & Expenses"
                  isActive={location.pathname === '/income-expense'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/budget"
                  icon={<PiggyBank className="w-5 h-5" />}
                  label="Budget Planner"
                  isActive={location.pathname === '/budget'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/investments"
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Investments"
                  isActive={location.pathname === '/investments'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/goals"
                  icon={<Target className="w-5 h-5" />}
                  label="Goals"
                  isActive={location.pathname === '/goals'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/crowdfunding"
                  icon={<HandHeart className="w-5 h-5" />}
                  label="Crowdfunding"
                  isActive={location.pathname === '/crowdfunding'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/achievements"
                  icon={<Trophy className="w-5 h-5" />}
                  label="Achievements"
                  isActive={location.pathname === '/achievements'}
                  isSidebarCollapsed={false}
                />
                <NavItem
                  to="/leaderboard"
                  icon={<Medal className="w-5 h-5" />}
                  label="Leaderboard"
                  isActive={location.pathname === '/leaderboard'}
                  isSidebarCollapsed={false}
                />
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <NavItem
                  to="/settings"
                  icon={<Settings className="w-5 h-5" />}
                  label="Settings"
                  isActive={location.pathname === '/settings'}
                  isSidebarCollapsed={false}
                />
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-3 w-full mt-2 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating Components */}
      <ChatBot />
    </div>
  );
}