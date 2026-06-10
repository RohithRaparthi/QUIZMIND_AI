import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, ArrowRight, CheckSquare, Clock, 
  HelpCircle, AlertCircle, ShieldAlert 
} from 'lucide-react';

const QuizPage = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);

  // 1. Load Quiz Data
  useEffect(() => {
    setError(null);
    let quizData = location.state?.quizData;

    // Fallback to localStorage if state is missing (on browser refresh)
    if (!quizData) {
      const cached = localStorage.getItem(`active_quiz_${quizId}`);
      if (cached) {
        try {
          quizData = JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse cached quiz", e);
        }
      }
    }

    if (quizData) {
      setQuiz(quizData);
      localStorage.setItem(`active_quiz_${quizId}`, JSON.stringify(quizData));
      
      // Initialize timer: 2 minutes (120s) per question
      const totalQuestions = quizData.questions.length;
      setTimeLeft(totalQuestions * 120);

      // Restore answered questions if any
      const savedAnswers = localStorage.getItem(`answers_quiz_${quizId}`);
      if (savedAnswers) {
        try {
          setSelectedAnswers(JSON.parse(savedAnswers));
        } catch (e) {
          console.error("Failed to parse saved answers", e);
        }
      }
    } else {
      setError("Quiz questions could not be retrieved. Please generate a new quiz from the Dashboard.");
    }
  }, [quizId, location.state]);

  // 2. Countdown Timer Loop
  useEffect(() => {
    if (quiz && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto-submit when timer expires
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz, timeLeft, isSubmitting]);

  // 3. Auto-save Answers to LocalStorage
  const handleSelectOption = (questionId, optionLetter) => {
    const updated = {
      ...selectedAnswers,
      [questionId]: optionLetter
    };
    setSelectedAnswers(updated);
    localStorage.setItem(`answers_quiz_${quizId}`, JSON.stringify(updated));
  };

  const handleAutoSubmit = () => {
    // If modal is open, close it
    setShowConfirmModal(false);
    logger.warning("Quiz timer expired. Auto submitting...");
    submitQuizAnswers();
  };

  const submitQuizAnswers = async () => {
    setIsSubmitting(true);
    setError(null);

    // Format answers array: List of { question_id, selected_answer }
    const answersPayload = quiz.questions.map((q) => ({
      question_id: q.id,
      selected_answer: selectedAnswers[q.id] || "" // empty string for skipped
    }));

    try {
      const response = await api.post('/submit-quiz', {
        quiz_id: parseInt(quizId),
        answers: answersPayload
      });

      // Clear cached state for this quiz
      localStorage.removeItem(`active_quiz_${quizId}`);
      localStorage.removeItem(`answers_quiz_${quizId}`);

      // Navigate to results page
      navigate(`/results/${quizId}`, { state: { results: response.data } });
    } catch (err) {
      console.error("Failed to submit answers", err);
      setError("Could not submit your quiz answers. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <GlassCard style={{ padding: '2.5rem', textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Error</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </GlassCard>
      </div>
    );
  }

  if (!quiz) return <LoadingSpinner message="Loading quiz details..." />;

  const questions = quiz.questions;
  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  
  // Stats for the confirmation modal
  const answeredCount = Object.keys(selectedAnswers).filter(id => selectedAnswers[id]).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Format Time: MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress Bar percentage
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div>
      {/* Header bar with timer and details */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {quiz.difficulty} Level • {quiz.title.replace(' Quiz', '')}
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.15rem' }}>Active Quiz Session</h1>
        </div>

        {/* Timer Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
          border: timeLeft < 60 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          color: timeLeft < 60 ? 'var(--error)' : 'white',
          fontWeight: 600,
          transition: 'var(--transition)'
        }}>
          <Clock size={16} />
          <span style={{ fontSize: '1.1rem' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
          <span>Quiz Progress</span>
          <span>{answeredCount} of {totalQuestions} answered ({Math.round(progressPercent)}%)</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Question Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard style={{ padding: '2.5rem', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
            {/* Question header */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: 700, 
                color: 'var(--primary)',
                background: 'rgba(124, 58, 237, 0.1)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                height: 'fit-content'
              }}>
                Q{currentIdx + 1}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 }}>
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d }
              ].map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(124, 58, 237, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }
                    }}
                  >
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--text-muted)',
                      background: isSelected ? 'var(--primary)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {opt.key}
                    </span>
                    <span style={{ fontSize: '0.95rem' }}>{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
            >
              <ArrowLeft size={16} /> Previous
            </Button>
            
            {currentIdx < totalQuestions - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentIdx(prev => prev + 1)}
              >
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={() => setShowConfirmModal(true)}
              >
                <CheckSquare size={16} /> Submit Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Question Navigation */}
        <GlassCard style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Questions Grid</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = !!selectedAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    height: '38px',
                    borderRadius: '6px',
                    border: isCurrent ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                    background: isCurrent 
                      ? 'rgba(124, 58, 237, 0.15)' 
                      : isAnswered 
                      ? 'rgba(6, 182, 212, 0.1)' 
                      : 'rgba(255,255,255,0.02)',
                    color: isCurrent 
                      ? 'white' 
                      : isAnswered 
                      ? 'var(--secondary)' 
                      : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'var(--transition)'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(124, 58, 237, 0.15)', border: '1px solid var(--primary)' }}></div>
              <span>Active Question</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}></div>
              <span>Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}></div>
              <span>Unanswered</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 6, 17, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <GlassCard style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <ShieldAlert size={36} style={{ color: 'var(--warning)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Submit Quiz?</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                You are about to submit your answers for evaluation.
              </p>
            </div>

            {/* Questions statistics */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Questions:</span>
                <span style={{ fontWeight: 600 }}>{totalQuestions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Answered:</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>{answeredCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Unanswered / Skipped:</span>
                <span style={{ fontWeight: 600, color: unansweredCount > 0 ? 'var(--error)' : 'var(--text-secondary)' }}>
                  {unansweredCount}
                </span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--warning)',
                marginBottom: '1.5rem',
                textAlign: 'center',
                background: 'rgba(245, 158, 11, 0.05)',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                Warning: You have unanswered questions.
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="secondary"
                style={{ flex: 1 }}
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Keep Testing
              </Button>
              <Button
                variant="accent"
                style={{ flex: 1 }}
                onClick={submitQuizAnswers}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating...' : 'Yes, Submit'}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
