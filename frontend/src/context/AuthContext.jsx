import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user-profile');
      setUser(response.data);
    } catch (err) {
      console.error("Failed to load user profile", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.access_token);
      await fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid credentials. Please try again.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (username, password) => {
    setError(null);
    try {
      await api.post('/register', { username, password });
      // Automatically login on registration success
      return await login(username, password);
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Username may be taken.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
