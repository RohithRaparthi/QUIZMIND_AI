import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X } from 'lucide-react';

const playSoftChime = () => {
  try {
    const isSoundEnabled = localStorage.getItem('quizmind-sound') === 'true';
    if (!isSoundEnabled) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a professional, soft double tone (E5 -> A5)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
    
    gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.04); // soft
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.25);
    
    osc2.start(audioCtx.currentTime + 0.12);
    osc2.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn("AudioContext failed to trigger", e);
  }
};

const AchievementUnlockModal = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      playSoftChime();
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '1.5rem'
    }}>
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0e0b1f',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '2rem',
          position: 'relative',
          boxShadow: '0 24px 48px -12px rgba(99, 102, 241, 0.18)',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={18} />
        </button>

        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Award size={28} />
        </div>

        <span style={{
          fontSize: '0.75rem',
          color: 'var(--secondary)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Credential Awarded
        </span>

        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'white',
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.02em'
        }}>
          {achievement.name}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: '0 0 1.5rem 0',
          lineHeight: 1.5,
          padding: '0 0.5rem'
        }}>
          {achievement.description}
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '8px',
          padding: '0.5rem 1.25rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'white',
          marginBottom: '1.75rem'
        }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>+{achievement.xp_reward} XP Awarded</span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(90deg, var(--primary) 0%, #6366f1 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          Close Credentials
        </button>
      </motion.div>
    </div>
  );
};

export default AchievementUnlockModal;
export { playSoftChime };
