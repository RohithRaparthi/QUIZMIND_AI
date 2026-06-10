import React, { useMemo } from 'react';
import GlassCard from './GlassCard';

const HeatmapCard = ({ heatmap }) => {
  // Convert API heatmap list to a quick lookup map
  const heatmapLookup = useMemo(() => {
    const lookup = {};
    if (Array.isArray(heatmap)) {
      heatmap.forEach(item => {
        lookup[item.date] = item.count;
      });
    }
    return lookup;
  }, [heatmap]);

  // Generate 91 days (13 weeks) of data ending on today
  const weeks = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    // Find the day of the week for the date 90 days ago
    const startOffset = new Date(today);
    startOffset.setDate(today.getDate() - 90);
    
    // Adjust start offset to the preceding Sunday to align weeks
    const startDay = startOffset.getDay(); // 0 is Sunday
    const startDate = new Date(startOffset);
    startDate.setDate(startOffset.getDate() - startDay);
    
    // Generate 13 weeks * 7 days = 91 days
    const current = new Date(startDate);
    for (let i = 0; i < 91; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    // Split into 13 weeks of 7 days
    const weeksArray = [];
    for (let w = 0; w < 13; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        weekDays.push(dates[w * 7 + d]);
      }
      weeksArray.push(weekDays);
    }
    
    return weeksArray;
  }, []);

  const getDayColor = (count) => {
    if (!count || count === 0) return 'rgba(255, 255, 255, 0.02)'; // Locked/empty
    if (count === 1) return 'rgba(99, 102, 241, 0.25)'; // Light blue/indigo
    if (count === 2) return 'rgba(99, 102, 241, 0.55)'; // Medium
    return 'rgba(99, 102, 241, 0.95)'; // Intense (3+)
  };

  const getTooltipText = (date, count) => {
    const countText = count ? `${count} quiz${count !== 1 ? 'zes' : ''}` : 'No activity';
    const dateText = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${countText} on ${dateText}`;
  };

  return (
    <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>Consistency Grid</h3>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Assessment frequency and study streak patterns (last 90 days)
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {/* Day of Week Labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '112px',
          fontSize: '0.675rem',
          color: 'var(--text-muted)',
          paddingRight: '0.25rem',
          lineHeight: '16px'
        }}>
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {weeks.map((week, wIndex) => (
            <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((day, dIndex) => {
                const dateStr = day.toISOString().split('T')[0];
                const count = heatmapLookup[dateStr] || 0;
                
                return (
                  <div
                    key={dIndex}
                    title={getTooltipText(day, count)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      background: getDayColor(count),
                      border: count > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 255, 255, 0.01)',
                      transition: 'background 0.2s ease'
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        paddingTop: '0.75rem'
      }}>
        <span>90 days ago</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Less</span>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.02)' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(99, 102, 241, 0.25)' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(99, 102, 241, 0.55)' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(99, 102, 241, 0.95)' }} />
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </GlassCard>
  );
};

export default HeatmapCard;
