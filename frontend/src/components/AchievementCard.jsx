import React from 'react';
import { Award, ShieldAlert, Check, Calendar } from 'lucide-react';
import GlassCard from './GlassCard';

const AchievementCard = ({ achievement }) => {
  const { name, description, category, xp_reward, icon_name, earned, earned_at } = achievement;

  return (
    <GlassCard
      style={{
        padding: '1.25rem',
        background: earned 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)' 
          : 'rgba(255, 255, 255, 0.005)',
        border: earned 
          ? '1px solid rgba(255, 255, 255, 0.12)' 
          : '1px solid rgba(255, 255, 255, 0.03)',
        boxShadow: earned ? '0 8px 20px 0 rgba(0, 0, 0, 0.2)' : 'none',
        opacity: earned ? 1 : 0.45,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '160px',
        position: 'relative',
        transition: 'var(--transition)'
      }}
      className={earned ? "glass-panel-hover" : ""}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.675rem',
            color: earned ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: earned ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: earned ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid rgba(255,255,255,0.05)'
          }}>
            {category}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: earned ? 'white' : 'var(--text-muted)'
          }}>
            +{xp_reward} XP
          </span>
        </div>

        <h4 style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: earned ? 'white' : 'var(--text-secondary)',
          margin: '0 0 0.35rem 0',
          letterSpacing: '-0.01em'
        }}>
          {name}
        </h4>
        <p style={{
          fontSize: '0.775rem',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.4
        }}>
          {description}
        </p>
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem'
      }}>
        {earned ? (
          <>
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
              <Check size={12} /> Certified
            </span>
            {earned_at && (
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={12} />
                {new Date(earned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldAlert size={12} /> Locked Credential
          </span>
        )}
      </div>
    </GlassCard>
  );
};

export default AchievementCard;
