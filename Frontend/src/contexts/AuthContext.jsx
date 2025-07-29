import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authentication on app initialization
    const initializeAuth = () => {
      if (tokenUtils.isAuthenticated()) {
        const userInfo = tokenUtils.getUserFromToken();
        if (userInfo) {
          setUser(userInfo);
        } else {
          // Invalid token, remove it
          tokenUtils.removeToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    tokenUtils.setToken(token);
    const userInfo = tokenUtils.getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    }
  };

  const logout = () => {
    setUser(null);
    tokenUtils.removeToken();
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Check if token is expired and auto-logout
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (user && !tokenUtils.isAuthenticated()) {
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: tokenUtils.isAuthenticated(),
    token: tokenUtils.getToken(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
