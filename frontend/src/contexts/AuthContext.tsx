import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the user object
interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  hasFilledAdditionalInfo: boolean;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5050/api/v1/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save the token to localStorage
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5050/api/v1/auth/register', {
        username,
        email,
        password,
      });

      // Handle success (e.g., show a message to check email for OTP)
      console.log('Registration successful:', response.data.message);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Validate token on initial load
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/v1/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};