import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const ChallengeContext = createContext(null);

export const ChallengeProvider = ({ children }) => {
  const { user } = useAuth();
  const { currentTheme, themes } = useTheme();
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('quizmind-mode') || 'learn';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('enter'); // 'enter' or 'exit'

  // Dashboard Data
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic Theme Evolution based on levels
  useEffect(() => {
    if (mode === 'challenge' && progress) {
      const lvl = progress.level_number || 1;
      let primary = '#3b82f6';
      let primaryGlow = 'rgba(59, 130, 246, 0.25)';
      let secondary = '#06b6d4';
      let bgGradient = 'radial-gradient(circle at top right, #14112e, #0a0718 60%, #030209)';
      
      if (lvl >= 7) {
        primary = '#a855f7'; // Purple (Expert+)
        primaryGlow = 'rgba(168, 85, 247, 0.25)';
        secondary = '#ec4899'; // Pink
        bgGradient = 'radial-gradient(circle at top right, #240b36, #0c051c 65%, #05020c)';
      } else if (lvl >= 5) {
        primary = '#6366f1'; // Indigo-Purple (Engineer)
        primaryGlow = 'rgba(99, 102, 241, 0.25)';
        secondary = '#8b5cf6';
        bgGradient = 'radial-gradient(circle at top right, #190e35, #080517 65%, #04020c)';
      } else if (lvl >= 3) {
        primary = '#4f46e5'; // Indigo (Analyst)
        primaryGlow = 'rgba(79, 70, 229, 0.25)';
        secondary = '#3b82f6';
        bgGradient = 'radial-gradient(circle at top right, #11153b, #07091d 65%, #03040e)';
      }
      
      document.documentElement.style.setProperty('--primary', primary);
      document.documentElement.style.setProperty('--primary-glow', primaryGlow);
      document.documentElement.style.setProperty('--secondary', secondary);
      document.documentElement.style.setProperty('--bg-gradient', bgGradient);
      document.documentElement.style.setProperty('--bg-dark', '#080512');
    } else {
      // Restore standard theme settings
      const themeData = themes[currentTheme] || themes.midnight;
      if (themeData) {
        Object.entries(themeData.colors).forEach(([variable, value]) => {
          document.documentElement.style.setProperty(variable, value);
        });
      }
    }
  }, [mode, progress, currentTheme, themes]);

  const fetchDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/challenge/dashboard');
      const { profile, progress, achievements, recent_activity, heatmap, insights } = response.data;
      setProfile(profile);
      setProgress(progress);
      setAchievements(achievements);
      setRecentActivity(recent_activity);
      setHeatmap(heatmap);
      setInsights(insights);
    } catch (error) {
      console.error('Failed to load challenge dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      // Clear data on logout
      setProfile(null);
      setProgress(null);
      setAchievements([]);
      setRecentActivity([]);
      setHeatmap([]);
      setInsights(null);
    }
  }, [user]);

  const switchMode = (newMode) => {
    if (newMode === mode || isTransitioning) return;

    setTransitionType(newMode === 'challenge' ? 'enter' : 'exit');
    setIsTransitioning(true);

    // Apply overlay and start transition
    setTimeout(() => {
      setModeState(newMode);
      localStorage.setItem('quizmind-mode', newMode);
      if (newMode === 'challenge') {
        fetchDashboard();
      }
    }, 350); // Wait 350ms to toggle the state (mid-transition)

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800); // 800ms total transition time
  };

  // Inline update progress when a quiz is submitted
  const handleQuizSubmissionSuccess = (xpUpdates) => {
    if (!xpUpdates) return;
    
    // Update local context state immediately
    if (profile) {
      setProfile((prev) => ({
        ...prev,
        total_xp: xpUpdates.new_total_xp,
        quizzes_completed: prev.quizzes_completed + 1
      }));
    }
    
    // Refresh full dashboard in background
    fetchDashboard();
  };

  return (
    <ChallengeContext.Provider
      value={{
        mode,
        switchMode,
        isTransitioning,
        transitionType,
        profile,
        progress,
        achievements,
        recentActivity,
        heatmap,
        insights,
        loading,
        fetchDashboard,
        handleQuizSubmissionSuccess
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => useContext(ChallengeContext);
