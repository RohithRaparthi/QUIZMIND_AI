import React from 'react';
import GlassCard from './GlassCard';
import { Flame, Calendar, Award } from 'lucide-react';

const StreakCard = ({ profile }) => {
  if (!profile) return null;

  const { current_streak, best_streak } = profile;

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '2px solid var(--secondary)',
        boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'var(--secondary)'
      }}>
        <Flame size={28} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Consistency Streak
        </span>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: '0.1rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {current_streak} Day{current_streak !== 1 && 's'}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Calendar size={12} />
          <span>Best Streak: <strong>{best_streak} Days</strong></span>
        </div>
      </div>
    </GlassCard>
  );
};

export default StreakCard;
