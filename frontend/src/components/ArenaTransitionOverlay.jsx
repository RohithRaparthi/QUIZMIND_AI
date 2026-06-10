import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChallenge } from '../context/ChallengeContext';

const ArenaTransitionOverlay = () => {
  const { isTransitioning, transitionType } = useChallenge();

  const isEnter = transitionType === 'enter';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: isEnter 
              ? 'radial-gradient(circle at center, #11102b 0%, #070617 100%)' 
              : 'radial-gradient(circle at center, #1b1735 0%, #0c0f1d 100%)',
            color: 'white',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              background: isEnter
                ? 'linear-gradient(90deg, #ffffff, #818cf8)'
                : 'linear-gradient(90deg, #ffffff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}
          >
            {isEnter ? 'Entering Challenge Arena' : 'Exiting Challenge Arena'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{
              fontSize: '0.95rem',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 400
            }}
          >
            {isEnter 
              ? 'Preparing your progression workspace...' 
              : 'Returning to standard assessments...'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArenaTransitionOverlay;
