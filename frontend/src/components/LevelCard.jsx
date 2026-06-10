import React from 'react';
import GlassCard from './GlassCard';
import { Shield, Award, CheckCircle } from 'lucide-react';

const LevelCard = ({ progress, profile }) => {
  if (!progress || !profile) return null;

  const { level_number, level_name } = progress;

  // Choose level icon based on level bracket
  const getLevelIcon = () => {
    if (level_number >= 7) return <Award size={28} style={{ color: 'var(--secondary)' }} />;
    if (level_number >= 4) return <Shield size={28} style={{ color: 'var(--primary)' }} />;
    return <CheckCircle size={28} style={{ color: 'var(--success)' }} />;
  };

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '2px solid var(--primary)',
        boxShadow: '0 0 15px var(--primary-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative'
      }}>
        {getLevelIcon()}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: 'white',
          fontSize: '0.675rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {level_number}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Credentials
        </span>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: '0.1rem 0' }}>
          {level_name}
        </h4>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          {profile.quizzes_completed} Assessment{profile.quizzes_completed !== 1 && 's'} Completed
        </span>
      </div>
    </GlassCard>
  );
};

export default LevelCard;
