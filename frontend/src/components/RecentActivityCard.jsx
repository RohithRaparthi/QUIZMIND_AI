import React from 'react';
import GlassCard from './GlassCard';
import { Target, Award, ArrowUp, Calendar, Zap } from 'lucide-react';

const RecentActivityCard = ({ recentActivity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'QUIZ_COMPLETED':
        return <Zap size={14} style={{ color: 'var(--secondary)' }} />;
      case 'ACHIEVEMENT_UNLOCKED':
        return <Award size={14} style={{ color: '#fbbf24' }} />;
      case 'LEVEL_UP':
        return <ArrowUp size={14} style={{ color: 'var(--success)' }} />;
      case 'STREAK_MILESTONE':
        return <Calendar size={14} style={{ color: 'var(--primary)' }} />;
      default:
        return <Target size={14} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const formatActivityText = (act) => {
    const meta = act.metadata || {};
    switch (act.activity_type) {
      case 'QUIZ_COMPLETED':
        return (
          <>
            Completed <strong>{meta.quiz_title || 'AI Quiz'}</strong> assessment. Score: {meta.score}/{meta.total}.
          </>
        );
      case 'ACHIEVEMENT_UNLOCKED':
        return (
          <>
            Unlocked achievement: <strong>{meta.achievement_name || 'Badge'}</strong>.
          </>
        );
      case 'LEVEL_UP':
        return (
          <>
            Leveled Up to <strong>{meta.level_name || 'Next Tier'}</strong> (Level {meta.to_level}).
          </>
        );
      case 'STREAK_MILESTONE':
        return (
          <>
            Reached consistency milestone: <strong>{meta.streak_days} Day Streak</strong>!
          </>
        );
      default:
        return 'Completed progress activity.';
    }
  };

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>Recent Activity</h3>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Progression logs and consistency tracking
        </span>
      </div>

      {(!recentActivity || recentActivity.length === 0) ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          padding: '2rem 0',
          border: '1px dashed rgba(255, 255, 255, 0.05)',
          borderRadius: '8px'
        }}>
          No recent progression logs found.
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingLeft: '0.5rem'
        }}>
          {/* Vertical line indicator */}
          <div style={{
            position: 'absolute',
            top: '8px',
            bottom: '8px',
            left: '19px',
            width: '2px',
            background: 'rgba(255, 255, 255, 0.04)'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentActivity.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  flexShrink: 0
                }}>
                  {getActivityIcon(act.activity_type)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {formatActivityText(act)}
                    </p>
                    {act.xp_earned > 0 && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        background: 'rgba(99, 102, 241, 0.08)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        flexShrink: 0
                      }}>
                        +{act.xp_earned} XP
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(act.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default RecentActivityCard;
