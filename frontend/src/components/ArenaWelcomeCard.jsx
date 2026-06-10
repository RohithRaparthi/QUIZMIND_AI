import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Sparkles } from 'lucide-react';

const ArenaWelcomeCard = ({ profile, progress }) => {
  if (!profile || !progress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.35) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.05)'
      }}
    >
      {/* Background glow blob */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', zIndex: 1, position: 'relative' }}>
        <div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.35rem 0.75rem',
            borderRadius: '99px',
            marginBottom: '0.75rem',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            <Sparkles size={12} /> Challenge Arena Active
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'white', letterSpacing: '-0.03em' }}>
            Welcome Back, {profile.username}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', maxWidth: '500px' }}>
            Continue building consistency and progressing your technical expertise.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Level Tier</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
              Level {progress.level_number} • {progress.level_name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Experience</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
              {progress.total_xp} XP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Consistency Streak</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Flame size={18} /> {profile.current_streak} Day{profile.current_streak !== 1 && 's'}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1.75rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Target size={14} style={{ color: 'var(--primary)' }} />
        <span>
          {progress.xp_remaining > 0 
            ? `${progress.xp_remaining} XP remaining to unlock Level ${progress.level_number + 1} (${LEVEL_CONFIGS[progress.level_number + 1]?.name || 'Next level'}).`
            : 'You have attained the ultimate Master rank!'}
        </span>
      </div>
    </motion.div>
  );
};

// Re-expose LEVEL_CONFIGS mapping to helper files
export const LEVEL_CONFIGS = {
  1: { name: "Beginner" },
  2: { name: "Learner" },
  3: { name: "Explorer" },
  4: { name: "Analyst" },
  5: { name: "Practitioner" },
  6: { name: "Engineer" },
  7: { name: "Specialist" },
  8: { name: "Expert" },
  9: { name: "Advanced Expert" },
  10: { name: "Master" },
};

export default ArenaWelcomeCard;
