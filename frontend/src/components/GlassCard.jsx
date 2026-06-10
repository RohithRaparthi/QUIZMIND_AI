import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div 
      className={`glass-panel ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
