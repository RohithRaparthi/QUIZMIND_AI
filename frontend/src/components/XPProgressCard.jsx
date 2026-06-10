import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const XPProgressCard = ({ progress }) => {
  if (!progress) return null;

  const {
    level_number,
    level_name,
    total_xp,
    xp_for_current_level,
    xp_for_next_level,
    progress_percent,
    xp_remaining
  } = progress;

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>Level Progression</h3>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Tier: <strong>{level_name}</strong> (Level {level_number})
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
            {total_xp} <span style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-muted)' }}>XP</span>
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', margin: '0.5rem 0' }}>
        {/* Progress Track */}
        <div style={{
          height: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '99px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Animated Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress_percent}%` }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '99px',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.25)'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span>{xp_for_current_level} XP</span>
        <span>{progress_percent}% Complete</span>
        <span>{level_number < 10 ? `${xp_for_next_level} XP` : 'Max Level'}</span>
      </div>
      
      {level_number < 10 && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px', 
          padding: '0.6rem 0.75rem',
          fontSize: '0.775rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          Need <strong>{xp_remaining} XP</strong> to reach level {level_number + 1}
        </div>
      )}
    </GlassCard>
  );
};

export default XPProgressCard;
