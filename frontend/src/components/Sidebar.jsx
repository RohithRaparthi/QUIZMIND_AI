import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, History, BrainCircuit } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Quiz', path: '/document-quiz', icon: FileText },
    { name: 'Topic Quiz', path: '/topic-quiz', icon: BookOpen },
    { name: 'Quiz History', path: '/history', icon: History },
  ];

  return (
    <aside className="sidebar">
      {/* Brand logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem',
        padding: '0.5rem 0'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
        }}>
          <BrainCircuit size={20} color="white" />
        </div>
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          letterSpacing: '-0.03em',
          background: 'linear-gradient(90deg, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
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
                background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 500 : 400,
                fontSize: '0.95rem',
                transition: 'var(--transition)'
              })}
              onMouseEnter={(e) => {
                // If not active, apply light hover background
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
