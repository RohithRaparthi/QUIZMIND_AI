import React, { useState } from 'react';
import AchievementCard from './AchievementCard';
import { Award, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

const AchievementGallery = ({ achievements }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'earned', 'locked'

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'earned') return ach.earned;
    if (filter === 'locked') return !ach.earned;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: 0 }}>Verified Credentials</h3>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Earned <strong>{earnedCount}</strong> of {totalCount} professional milestones
          </span>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '0.2rem'
        }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'earned', label: 'Certified' },
            { id: 'locked', label: 'Locked' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: filter === tab.id ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                color: filter === tab.id ? 'white' : 'var(--text-secondary)',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAchievements.length === 0 ? (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px dashed rgba(255,255,255,0.05)',
          borderRadius: '12px',
          color: 'var(--text-secondary)'
        }}>
          <Layers size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No achievements match this filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredAchievements.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;
