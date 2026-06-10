import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
      </div>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <User size={16} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.username}</span>
          </div>

          <button 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.85rem',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--error)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
