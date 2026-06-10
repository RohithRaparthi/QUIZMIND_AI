import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import ArenaWelcomeCard from '../components/ArenaWelcomeCard';
import LevelCard from '../components/LevelCard';
import XPProgressCard from '../components/XPProgressCard';
import StreakCard from '../components/StreakCard';
import LearningInsightsCard from '../components/LearningInsightsCard';
import RecentActivityCard from '../components/RecentActivityCard';
import HeatmapCard from '../components/HeatmapCard';
import AchievementGallery from '../components/AchievementGallery';
import LoadingSpinner from '../components/LoadingSpinner';

const ChallengeDashboard = () => {
  const {
    profile,
    progress,
    achievements,
    recentActivity,
    heatmap,
    insights,
    loading
  } = useChallenge();

  if (loading && !profile) {
    return <LoadingSpinner message="Entering progression workspace..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. Header Welcome Ribbon */}
      <ArenaWelcomeCard profile={profile} progress={progress} />

      {/* 2. Top-level KPI Progress Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <LevelCard progress={progress} profile={profile} />
        <StreakCard profile={profile} />
        <XPProgressCard progress={progress} />
      </div>

      {/* 3. Main Split Dashboard Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="challenge-columns">
        {/* Left Column (Heatmap + Achievements) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <HeatmapCard heatmap={heatmap} />
          <AchievementGallery achievements={achievements} />
        </div>

        {/* Right Column (Insights + Recent Activity) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <LearningInsightsCard insights={insights} />
          <RecentActivityCard recentActivity={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDashboard;
