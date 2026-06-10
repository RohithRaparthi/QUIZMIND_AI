import React from 'react';
import GlassCard from './GlassCard';
import { BookOpen, TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';

const LearningInsightsCard = ({ insights }) => {
  if (!insights) return null;

  const { strongest_topic, weakest_topic, avg_accuracy, improvement_trend } = insights;
  const isPositive = improvement_trend >= 0;

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>Learning Insights</h3>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          AI-generated diagnostics based on your response history
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Strongest Topic */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Brain size={12} style={{ color: 'var(--success)' }} /> Strongest
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={strongest_topic}>
            {strongest_topic}
          </span>
        </div>

        {/* Weakest Topic */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <BookOpen size={12} style={{ color: 'var(--error)' }} /> Focus Area
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={weakest_topic}>
            {weakest_topic}
          </span>
        </div>

        {/* Accuracy */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Target size={12} style={{ color: 'var(--primary)' }} /> Avg Accuracy
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
            {avg_accuracy}%
          </span>
        </div>

        {/* Improvement Trend */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {isPositive ? <TrendingUp size={12} style={{ color: 'var(--success)' }} /> : <TrendingDown size={12} style={{ color: 'var(--error)' }} />} Trend (14d)
          </span>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            color: isPositive ? 'var(--success)' : 'var(--error)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.15rem'
          }}>
            {isPositive ? '+' : ''}{improvement_trend}%
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default LearningInsightsCard;
