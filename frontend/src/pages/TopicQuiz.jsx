import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, AlertCircle, BookOpen } from 'lucide-react';

const TopicQuiz = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to generate a quiz.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/generate-topic-quiz', {
        topic: topic.trim(),
        num_questions: numQuestions,
        difficulty: difficulty
      });
      
      const quizId = response.data.quiz_id;
      // Redirect to quiz page
      navigate(`/quiz/${quizId}`, { state: { quizData: response.data } });
    } catch (err) {
      console.error("Quiz generation failed", err);
      const msg = err.response?.data?.detail || "AI failed to generate quiz. Please check your network or try a different topic.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sampleTopics = ["Python", "Machine Learning", "DBMS", "Java", "Operating Systems", "Data Structures"];

  if (loading) return <LoadingSpinner message="Synthesizing general knowledge and generating smart quiz. Please do not close this window..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Topic Quiz Generator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Enter any topic to generate targeted multiple-choice question sheets instantly.</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
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
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <GlassCard style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Topic Input */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="topic">Quiz Topic</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <BookOpen size={16} />
                </span>
                <input
                  id="topic"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Machine Learning, ReactJS, European History..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Popular Topics:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {sampleTopics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      padding: '0.35rem 0.85rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.target.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Number of Questions</label>
                <select 
                  className="form-input" 
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select 
                  className="form-input" 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              <Sparkles size={16} /> Generate AI Quiz
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default TopicQuiz;
