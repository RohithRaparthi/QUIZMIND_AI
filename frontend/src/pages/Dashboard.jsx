import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Trophy, BookOpen, GraduationCap, Percent, Flame, 
  ArrowUpRight, FileText, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (err) {
        console.error("Error loading analytics data", err);
        setError("Could not load dashboard metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const stats = data?.stats || {
    total_attempts: 0,
    avg_score: 0.0,
    highest_score: 0.0,
    lowest_score: 0.0,
    accuracy_percentage: 0.0
  };

  const recentAttempts = data?.recent_attempts || [];
  const topicPerformance = data?.topic_performance || [];
  const difficultyPerformance = data?.difficulty_performance || [];
  const accuracyTrend = data?.accuracy_trend || [];

  const cards = [
    {
      label: "Total Quizzes",
      value: stats.total_attempts,
      icon: GraduationCap,
      color: "var(--primary)",
      bgColor: "rgba(124, 58, 237, 0.1)"
    },
    {
      label: "Average Score",
      value: `${stats.avg_score}%`,
      icon: Percent,
      color: "var(--secondary)",
      bgColor: "rgba(6, 182, 212, 0.1)"
    },
    {
      label: "Highest Score",
      value: `${stats.highest_score}%`,
      icon: Trophy,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      label: "Lowest Score",
      value: `${stats.lowest_score}%`,
      icon: Flame,
      color: "var(--error)",
      bgColor: "rgba(239, 68, 68, 0.1)"
    }
  ];

  // Colors for difficulty bars
  const getDiffColor = (diff) => {
    const d = diff.toLowerCase();
    if (d === 'easy') return '#10b981';
    if (d === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your progress and generate new study assessments.</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--error)'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats row */}
      <div className="dashboard-grid">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <GlassCard key={index} className="metric-card">
              <div className="metric-icon-wrapper" style={{ background: card.bgColor, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-value">{card.value}</span>
                <span className="metric-label">{card.label}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <GlassCard hoverEffect={true} style={{ padding: '1.75rem', display: 'flex', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(124, 58, 237, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Document Quiz Generator</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                Upload study PDF, DOCX or TXT files to create targeted grounded assessments.
              </p>
            </div>
            <Link to="/document-quiz" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ width: '100%', fontSize: '0.875rem', padding: '0.6rem' }}>
                Upload & Generate
              </Button>
            </Link>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} style={{ padding: '1.75rem', display: 'flex', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.1)',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>Topic Quiz Generator</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                Enter any topic to generate multiple-choice quizzes using AI general knowledge.
              </p>
            </div>
            <Link to="/topic-quiz" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ width: '100%', fontSize: '0.875rem', padding: '0.6rem' }}>
                Enter Topic
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>

      {stats.total_attempts === 0 ? (
        <GlassCard style={{ padding: '3rem', textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>No quiz attempts yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
            Get started by generating your first quiz from study materials or a custom topic!
          </p>
          <Link to="/topic-quiz" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Create First Quiz</Button>
          </Link>
        </GlassCard>
      ) : (
        <>
          {/* Charts section */}
          <div className="analytics-grid">
            {/* Accuracy Trend Chart */}
            <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Accuracy Trend</h3>
              <div style={{ flex: 1, width: '100%', height: '100%', minHeight: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Area type="monotone" dataKey="percentage" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorPercentage)" name="Score" unit="%" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Difficulty Chart */}
            <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Performance by Difficulty</h3>
              <div style={{ flex: 1, width: '100%', height: '100%', minHeight: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="difficulty" stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => val.toUpperCase()} />
                    <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(val) => [`${val}%`, 'Avg Score']}
                    />
                    <Bar dataKey="avg_percentage" radius={[4, 4, 0, 0]}>
                      {difficultyPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getDiffColor(entry.difficulty)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Topic Performance List */}
            <GlassCard style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Performance by Topic</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topicPerformance.map((topic, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 500 }}>{topic.topic}</span>
                      <span style={{ color: 'var(--secondary)' }}>{topic.avg_percentage}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${topic.avg_percentage}%`, 
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Recent Attempts Feed */}
            <GlassCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Quiz Attempts</h3>
                <Link to="/history" style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.1rem',
                  fontWeight: 500
                }}>
                  View All <ArrowUpRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentAttempts.map((attempt) => (
                  <div 
                    key={attempt.attempt_id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.15rem' }}>{attempt.quiz_title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(attempt.attempted_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '1rem', 
                        fontWeight: 700, 
                        color: attempt.percentage >= 70 ? 'var(--success)' : attempt.percentage >= 40 ? 'var(--warning)' : 'var(--error)'
                      }}>
                        {attempt.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
