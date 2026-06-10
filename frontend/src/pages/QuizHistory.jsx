import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { History, BookOpen, AlertCircle, FileText, Sparkles, Trophy } from 'lucide-react';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/quiz-history');
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to load history", err);
        setError("Could not load your quiz history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your quiz history..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Quiz History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review all your previous quiz attempts and scores.</p>
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

      {history.length === 0 ? (
        <GlassCard style={{ padding: '3rem', textAlign: 'center' }}>
          <History size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>No quiz history</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
            You haven't completed any quizzes yet. Go ahead and generate a quiz now!
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/topic-quiz')}
          >
            Create Topic Quiz
          </button>
        </GlassCard>
      ) : (
        <GlassCard className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Provider</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const isDoc = item.quiz_type === 'document';
                return (
                  <tr key={item.attempt_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isDoc ? (
                          <FileText size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        ) : (
                          <Sparkles size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                        )}
                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.quiz_title}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {item.quiz_type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${item.difficulty.toLowerCase()}`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.score} / {item.question_count}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 700, 
                        color: item.percentage >= 70 ? 'var(--success)' : item.percentage >= 40 ? 'var(--warning)' : 'var(--error)'
                      }}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${item.provider_used.toLowerCase()}`}>
                        {item.provider_used.toLowerCase() === 'grok' ? 'xAI Grok' : item.provider_used.toLowerCase() === 'groq' ? 'Groq' : 'Google Gemini'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(item.attempted_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};

export default QuizHistory;
