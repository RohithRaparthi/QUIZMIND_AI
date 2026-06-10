import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  midnight: {
    name: 'Midnight Neon',
    primaryColor: '#7c3aed',
    secondaryColor: '#06b6d4',
    colors: {
      '--bg-dark': '#0f172a',
      '--bg-gradient': 'radial-gradient(circle at top right, #1e1b4b, #0f172a 60%, #020617)',
      '--panel-bg': 'rgba(30, 41, 59, 0.45)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.08)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      '--primary': '#7c3aed',
      '--primary-glow': 'rgba(124, 58, 237, 0.35)',
      '--secondary': '#06b6d4',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--input-bg': 'rgba(15, 23, 42, 0.6)',
      '--input-border': 'rgba(255, 255, 255, 0.1)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(124, 58, 237, 0.3)',
      '--hover-shadow': '0 12px 40px 0 rgba(124, 58, 237, 0.15)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  emerald: {
    name: 'Deep Forest',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    colors: {
      '--bg-dark': '#061614',
      '--bg-gradient': 'radial-gradient(circle at top right, #022c22, #061614 65%, #020f0e)',
      '--panel-bg': 'rgba(20, 35, 30, 0.5)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.06)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      '--primary': '#10b981',
      '--primary-glow': 'rgba(16, 185, 129, 0.35)',
      '--secondary': '#14b8a6',
      '--text-primary': '#f0fdf4',
      '--text-secondary': '#86efac',
      '--text-muted': '#4d7c0f',
      '--input-bg': 'rgba(15, 23, 42, 0.6)',
      '--input-border': 'rgba(255, 255, 255, 0.08)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(16, 185, 129, 0.3)',
      '--hover-shadow': '0 12px 40px 0 rgba(16, 185, 129, 0.15)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  sunset: {
    name: 'Sunset Crimson',
    primaryColor: '#db2777',
    secondaryColor: '#f59e0b',
    colors: {
      '--bg-dark': '#1c0c16',
      '--bg-gradient': 'radial-gradient(circle at top right, #4c0519, #1c0c16 65%, #0f050b)',
      '--panel-bg': 'rgba(40, 20, 30, 0.5)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.07)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      '--primary': '#db2777',
      '--primary-glow': 'rgba(219, 39, 119, 0.35)',
      '--secondary': '#f59e0b',
      '--text-primary': '#fdf2f8',
      '--text-secondary': '#fbcfe8',
      '--text-muted': '#a21caf',
      '--input-bg': 'rgba(15, 23, 42, 0.6)',
      '--input-border': 'rgba(255, 255, 255, 0.08)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(219, 39, 119, 0.3)',
      '--hover-shadow': '0 12px 40px 0 rgba(219, 39, 119, 0.15)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  steel: {
    name: 'Steel Minimalist',
    primaryColor: '#f4f4f5',
    secondaryColor: '#a1a1aa',
    colors: {
      '--bg-dark': '#18181b',
      '--bg-gradient': 'radial-gradient(circle at top right, #27272a, #09090b 70%)',
      '--panel-bg': 'rgba(39, 39, 42, 0.45)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.05)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      '--primary': '#f4f4f5',
      '--primary-glow': 'rgba(244, 244, 245, 0.25)',
      '--secondary': '#a1a1aa',
      '--text-primary': '#fafafa',
      '--text-secondary': '#d4d4d8',
      '--text-muted': '#71717a',
      '--input-bg': 'rgba(9, 9, 11, 0.6)',
      '--input-border': 'rgba(255, 255, 255, 0.08)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(244, 244, 245, 0.2)',
      '--hover-shadow': '0 12px 40px 0 rgba(244, 244, 245, 0.1)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  frost: {
    name: 'Nordic Frost',
    primaryColor: '#3a86c8',
    secondaryColor: '#8ecae6',
    colors: {
      '--bg-dark': '#0b132b',
      '--bg-gradient': 'radial-gradient(circle at top right, #1c2541, #0b132b 65%, #050811)',
      '--panel-bg': 'rgba(28, 37, 65, 0.5)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.07)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      '--primary': '#3a86c8',
      '--primary-glow': 'rgba(58, 134, 200, 0.35)',
      '--secondary': '#8ecae6',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#475569',
      '--input-bg': 'rgba(11, 19, 43, 0.6)',
      '--input-border': 'rgba(255, 255, 255, 0.08)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(58, 134, 200, 0.3)',
      '--hover-shadow': '0 12px 40px 0 rgba(58, 134, 200, 0.15)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  glassFrost: {
    name: 'Glass Frost (Light)',
    primaryColor: '#4f46e5',
    secondaryColor: '#0ea5e9',
    colors: {
      '--bg-dark': '#f8fafc',
      '--bg-gradient': 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 50%, #f8fafc 100%)',
      '--panel-bg': 'rgba(255, 255, 255, 0.65)',
      '--panel-border': '1px solid rgba(15, 23, 42, 0.08)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      '--primary': '#4f46e5',
      '--primary-glow': 'rgba(79, 70, 229, 0.15)',
      '--secondary': '#0ea5e9',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#64748b',
      '--input-bg': 'rgba(255, 255, 255, 0.9)',
      '--input-border': 'rgba(15, 23, 42, 0.12)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(79, 70, 229, 0.2)',
      '--hover-shadow': '0 12px 40px 0 rgba(79, 70, 229, 0.1)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  mintSorbet: {
    name: 'Mint Sorbet (Light)',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    colors: {
      '--bg-dark': '#f0fdf4',
      '--bg-gradient': 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
      '--panel-bg': 'rgba(255, 255, 255, 0.70)',
      '--panel-border': '1px solid rgba(6, 78, 59, 0.08)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      '--primary': '#059669',
      '--primary-glow': 'rgba(5, 150, 105, 0.15)',
      '--secondary': '#10b981',
      '--text-primary': '#064e3b',
      '--text-secondary': '#047857',
      '--text-muted': '#4b5563',
      '--input-bg': 'rgba(255, 255, 255, 0.9)',
      '--input-border': 'rgba(6, 78, 59, 0.12)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(5, 150, 105, 0.2)',
      '--hover-shadow': '0 12px 40px 0 rgba(5, 150, 105, 0.1)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  nordicLight: {
    name: 'Nordic Light (Light)',
    primaryColor: '#0284c7',
    secondaryColor: '#06b6d4',
    colors: {
      '--bg-dark': '#f0f9ff',
      '--bg-gradient': 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
      '--panel-bg': 'rgba(255, 255, 255, 0.70)',
      '--panel-border': '1px solid rgba(3, 105, 161, 0.08)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      '--primary': '#0284c7',
      '--primary-glow': 'rgba(2, 132, 199, 0.15)',
      '--secondary': '#06b6d4',
      '--text-primary': '#0c4a6e',
      '--text-secondary': '#0369a1',
      '--text-muted': '#4b5563',
      '--input-bg': 'rgba(255, 255, 255, 0.9)',
      '--input-border': 'rgba(3, 105, 161, 0.12)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(2, 132, 199, 0.2)',
      '--hover-shadow': '0 12px 40px 0 rgba(2, 132, 199, 0.1)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  sunsetCream: {
    name: 'Sunset Cream (Light)',
    primaryColor: '#ea580c',
    secondaryColor: '#f59e0b',
    colors: {
      '--bg-dark': '#fff7ed',
      '--bg-gradient': 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)',
      '--panel-bg': 'rgba(255, 255, 255, 0.75)',
      '--panel-border': '1px solid rgba(124, 45, 18, 0.08)',
      '--panel-blur': 'blur(16px)',
      '--card-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      '--primary': '#ea580c',
      '--primary-glow': 'rgba(234, 88, 12, 0.15)',
      '--secondary': '#f59e0b',
      '--text-primary': '#7c2d12',
      '--text-secondary': '#9a3412',
      '--text-muted': '#4b5563',
      '--input-bg': 'rgba(255, 255, 255, 0.9)',
      '--input-border': 'rgba(124, 45, 18, 0.12)',
      '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '--hover-border-color': 'rgba(234, 88, 12, 0.2)',
      '--hover-shadow': '0 12px 40px 0 rgba(234, 88, 12, 0.1)',
      '--hover-transform': 'translateY(-2px)'
    }
  },
  hyperGlass: {
    name: 'HyperGlass Luminous',
    primaryColor: '#ff2d55',
    secondaryColor: '#00f0ff',
    colors: {
      '--bg-dark': '#090514',
      '--bg-gradient': 'linear-gradient(135deg, #1e0b36 0%, #0c071a 35%, #580c30 70%, #032b30 100%)',
      '--panel-bg': 'rgba(255, 255, 255, 0.06)',
      '--panel-border': '1px solid rgba(255, 255, 255, 0.18)',
      '--panel-blur': 'blur(20px)',
      '--card-shadow': '0 20px 50px 0 rgba(0, 0, 0, 0.45)',
      '--primary': '#ff2d55',
      '--primary-glow': 'rgba(255, 45, 85, 0.35)',
      '--secondary': '#00f0ff',
      '--text-primary': '#ffffff',
      '--text-secondary': '#d1c4e9',
      '--text-muted': '#8e82a8',
      '--input-bg': 'rgba(255, 255, 255, 0.04)',
      '--input-border': 'rgba(255, 255, 255, 0.1)',
      '--transition': 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      '--hover-border-color': 'rgba(255, 255, 255, 0.45)',
      '--hover-shadow': '0 30px 60px 0 rgba(0, 0, 0, 0.65), 0 0 25px 0 rgba(255, 255, 255, 0.1)',
      '--hover-transform': 'scale(1.04) translate3d(0, -6px, 0)'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'midnight';
  });

  useEffect(() => {
    const themeData = themes[currentTheme] || themes.midnight;
    Object.entries(themeData.colors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
