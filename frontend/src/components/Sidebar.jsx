import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, History, Target, Compass } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';

const Sidebar = () => {
  const { mode, switchMode } = useChallenge();
  const navigate = useNavigate();

  const navItems = [
    { name: mode === 'challenge' ? 'Arena Home' : 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Quiz', path: '/document-quiz', icon: FileText },
    { name: 'Topic Quiz', path: '/topic-quiz', icon: BookOpen },
    { name: 'Quiz History', path: '/history', icon: History },
  ];

  return (
    <aside className="sidebar" style={{
      borderRight: mode === 'challenge' ? '1px solid rgba(99, 102, 241, 0.15)' : 'var(--panel-border)',
      boxShadow: mode === 'challenge' ? 'inset -10px 0 30px -15px rgba(99, 102, 241, 0.05)' : 'none',
      transition: 'var(--transition)'
    }}>
      {/* Brand logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem',
        padding: '0.5rem 0'
      }}>
        <img 
          src="/favicon.svg" 
          alt="QuizMind AI Logo" 
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain'
          }}
        />
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          transition: 'var(--transition)'
        }}>
          QuizMind AI
        </span>
      </div>

      {/* Navigation links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive 
                  ? (mode === 'challenge' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(124, 58, 237, 0.15)') 
                  : 'transparent',
                border: isActive 
                  ? (mode === 'challenge' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(124, 58, 237, 0.25)') 
                  : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 500 : 400,
                fontSize: '0.95rem',
                transition: 'var(--transition)'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Divider */}
        <div style={{ 
          margin: '1.5rem 0', 
          height: '1px', 
          background: 'rgba(255, 255, 255, 0.08)',
          border: 'none'
        }} />

        {/* Mode Switcher */}
        {mode === 'learn' ? (
          <button
            onClick={() => {
              navigate('/dashboard');
              switchMode('challenge');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'var(--transition)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <Target size={18} style={{ color: 'var(--secondary)' }} />
            <span>Challenge Arena</span>
          </button>
        ) : (
          <button
            onClick={() => {
              navigate('/dashboard');
              switchMode('learn');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--primary)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'var(--transition)',
              width: '100%',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            <Compass size={18} />
            <span>Exit Challenge Arena</span>
          </button>
        )}
      </nav>

      {/* Footer copyright */}
      <div style={{ padding: '0.5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2026 QuizMind AI
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
