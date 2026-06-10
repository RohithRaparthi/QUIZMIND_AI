import React from 'react';

const LoadingSpinner = ({ fullPage = false, message = "Generating smart quiz..." }) => {
  const containerStyle = fullPage ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(9, 9, 11, 0.75)',
    backdropFilter: 'blur(12px)',
    zIndex: 9999
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    gap: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
