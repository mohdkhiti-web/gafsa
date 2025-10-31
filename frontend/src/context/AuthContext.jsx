import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const openAuthDialog = () => {
    setIsAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const persistSession = (token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setIsAuthenticated(true);
    setUser(userData);
  };

  const extractErrorMessage = (error, fallback) => {
    const responseMessage = error?.response?.data?.message;
    if (Array.isArray(responseMessage)) {
      return responseMessage[0] || fallback;
    }
    if (typeof responseMessage === 'string') {
      return responseMessage;
    }
    return fallback;
  };

  const login = async (email, password) => {
    try {
      const data = await apiService.auth.login(email, password);
      if (data?.access_token && data?.user) {
        persistSession(data.access_token, data.user);
      }
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Login failed.'));
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiService.auth.register(userData);
      if (data?.access_token && data?.user) {
        persistSession(data.access_token, data.user);
      }
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Registration failed.'));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthDialogOpen,
    openAuthDialog,
    closeAuthDialog,
    isAuthenticated,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
