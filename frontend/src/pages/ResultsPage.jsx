import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  Sparkles, Info, Quote, BrainCircuit, ChevronDown, ChevronUp 
} from 'lucide-react';

const ResultsPage = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const loadResults = async () => {
      setError(null);
      // Check if results were passed via navigation state
      if (location.state?.results) {
        setResults(location.state.results);
        setLoading(false);
      } else {
        // Since there is no GET /quiz-attempts/{id} endpoint in the specification, 
        // we can fetch the user's quiz-history and grab the matching quiz attempt.
        // Wait, does the quiz history contain the question level answers? No, history only lists overview score metadata.
        // But since we submitted and got results, if they refresh, how do we show it?
        // To be safe, we let them know they can view past history, or we fetch history.
        // Actually, we can fetch the quiz history, find the last attempt for this quiz, 
        // but wait! If they refreshed, we can just direct them to go back to the dashboard.
        // Let's check: if we don't have results in state, we display a friendly warning.
        setError("Quiz results are only available immediately after submission. Please view your overall scores on the History page.");
        setLoading(false);
      }
    };

    loadResults();
  }, [quizId, location.state]);

  const toggleExpand = (qId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleRetake = () => {
    if (!results) return;

    // Reconstruct the quiz question list structure expected by QuizPage.jsx
    const quizData = {
      quiz_id: results.quiz_id,
      title: "Quiz Retake",
      difficulty: "medium", // default
      questions: results.results.map(r => ({
        id: r.question_id,
        question_text: r.question_text,
        option_a: r.option_a,
        option_b: r.option_b,
        option_c: r.option_c,
        option_d: r.option_d
      }))
    };

    // Clean previous cached selections
    localStorage.removeItem(`answers_quiz_${results.quiz_id}`);

    navigate(`/quiz/${results.quiz_id}`, { state: { quizData } });
  };

  if (loading) return <LoadingSpinner message="Loading your results breakdown..." />;

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <GlassCard style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Info size={48} style={{ color: 'var(--secondary)', marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Results Expired</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => navigate('/history')}>Go to History</Button>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const totalQuestions = results.results.length;
  const correctCount = results.score;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = results.percentage;

  // Rating and Color
  const getRatingInfo = (pct) => {
    if (pct >= 85) return { text: "Outstanding! Master Class", color: "var(--success)" };
    if (pct >= 70) return { text: "Well Done! Strong Progress", color: "var(--secondary)" };
    if (pct >= 50) return { text: "Pass. Keep Studying", color: "var(--warning)" };
    return { text: "Needs Review. Try Again", color: "var(--error)" };
  };

  const rating = getRatingInfo(percentage);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Quiz Results</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review your answers and read the AI generated explanations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Score Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Top color accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, var(--primary), var(--secondary))`
            }}></div>

            <Trophy size={48} style={{ color: rating.color, marginBottom: '1rem' }} />
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
              {percentage}%
            </h2>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: rating.color, marginBottom: '1.5rem' }}>
              {rating.text}
            </h3>

            {/* Score breakdown metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              padding: '1rem 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Correct
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
                  {correctCount}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Incorrect
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--error)' }}>
                  {incorrectCount}
                </span>
              </div>
            </div>

            {/* Provider used info */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated using:</span>
              <span className={`badge badge-${results.provider_used.toLowerCase()}`}>
                {results.provider_used === 'grok' ? 'xAI Grok' : 'Google Gemini'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button variant="primary" style={{ width: '100%' }} onClick={handleRetake}>
                <RotateCcw size={16} /> Retake Quiz
              </Button>
              <Button variant="secondary" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>
                <Sparkles size={16} /> Generate New Quiz
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Detailed Question Review Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>Question Details</h3>
          
          {results.results.map((q, idx) => {
            const isCorrect = q.is_correct;
            const isExpanded = !!expandedQuestions[q.question_id];
            
            return (
              <GlassCard 
                key={q.question_id} 
                style={{ 
                  borderLeft: `3px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                  padding: '1.25rem 1.5rem',
                  transition: 'var(--transition)'
                }}
              >
                {/* Header: Clickable to expand */}
                <div 
                  onClick={() => toggleExpand(q.question_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{
                      color: isCorrect ? 'var(--success)' : 'var(--error)',
                      marginTop: '0.15rem',
                      flexShrink: 0
                    }}>
                      {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </span>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Question {idx + 1}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.1rem', lineHeight: 1.4 }}>
                        {q.question_text}
                      </h4>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
                    {/* Options Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.75rem',
                      marginBottom: '1.25rem'
                    }}>
                      {[
                        { key: 'A', text: q.option_a },
                        { key: 'B', text: q.option_b },
                        { key: 'C', text: q.option_c },
                        { key: 'D', text: q.option_d }
                      ].map((opt) => {
                        const isUserAnswer = q.selected_answer === opt.key;
                        const isCorrectAnswer = q.correct_answer === opt.key;
                        
                        let bgColor = 'rgba(255,255,255,0.01)';
                        let borderColor = 'rgba(255,255,255,0.05)';
                        let textColor = 'var(--text-secondary)';

                        if (isCorrectAnswer) {
                          bgColor = 'rgba(16, 185, 129, 0.08)';
                          borderColor = 'var(--success)';
                          textColor = 'white';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          bgColor = 'rgba(239, 68, 68, 0.08)';
                          borderColor = 'var(--error)';
                          textColor = 'white';
                        }

                        return (
                          <div
                            key={opt.key}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '6px',
                              background: bgColor,
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: isCorrectAnswer ? 'var(--success)' : isUserAnswer ? 'var(--error)' : 'rgba(255,255,255,0.05)',
                              color: isCorrectAnswer || isUserAnswer ? 'white' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              flexShrink: 0
                            }}>
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanations & Source Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Explanation box */}
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '6px',
                        padding: '0.85rem 1rem'
                      }}>
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                          <BrainCircuit size={14} style={{ color: 'var(--primary)' }} /> AI Explanation
                        </h5>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{q.explanation}</p>
                      </div>

                      {/* Source grounding citation */}
                      {q.source_text && (
                        <div style={{
                          background: 'rgba(6, 182, 212, 0.03)',
                          border: '1px solid rgba(6, 182, 212, 0.08)',
                          borderRadius: '6px',
                          padding: '0.85rem 1rem'
                        }}>
                          <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                            <Quote size={14} style={{ color: 'var(--secondary)' }} /> Grounded Source Text
                          </h5>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            "{q.source_text}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
