import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setCurrentTheme, themes } = useTheme();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', zIndex: 1000 }}>
      {/* Selector Icon Button */}
      <button
        onClick={toggleDropdown}
        title="Choose Theme"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'var(--transition)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        <Palette size={18} />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '0.5rem',
          width: '210px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(124, 58, 237, 0.05)',
          backdropFilter: 'blur(16px)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          zIndex: 1010,
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.4rem 0.6rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            marginBottom: '0.25rem'
          }}>
            Select Theme
          </div>

          {Object.entries(themes).map(([key, theme]) => {
            const isSelected = currentTheme === key;
            return (
              <button
                key={key}
                onClick={() => selectTheme(key)}
                style={{
                  width: '100%',
                  background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  color: isSelected ? 'white' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 500 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {/* Visual Swatch Circle (Split Primary / Secondary) */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    background: theme.primaryColor
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '50%',
                    height: '100%',
                    background: theme.secondaryColor
                  }}></div>
                </div>

                <span style={{ flex: 1 }}>{theme.name}</span>

                {isSelected && (
                  <Check size={14} style={{ color: 'var(--primary)' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
