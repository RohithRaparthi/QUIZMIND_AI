import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { Upload, File, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const DocumentQuiz = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      setFile(null);
      return;
    }
    // Limit file size to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size too large. Max size allowed is 10MB.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or upload a study file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_questions', numQuestions);
    formData.append('difficulty', difficulty);

    try {
      const response = await api.post('/generate-document-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const quizId = response.data.quiz_id;
      // Redirect to quiz page
      navigate(`/quiz/${quizId}`, { state: { quizData: response.data } });
    } catch (err) {
      console.error("Quiz generation failed", err);
      const msg = err.response?.data?.detail || "AI failed to generate quiz. Your file text may be too short or complex. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Reading study materials and generating smart quiz. Please do not close this window..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Document Quiz Generator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload your notes or textbooks to generate grounded multiple-choice questions.</p>
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
            {/* File Upload Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                border: dragActive ? '2px dashed var(--primary)' : '2px dashed rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                background: dragActive ? 'rgba(124, 58, 237, 0.05)' : 'rgba(15, 23, 42, 0.3)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                marginBottom: '2rem'
              }}
              onClick={handleButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleChange}
              />
              
              {!file ? (
                <>
                  <Upload size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Drag and drop your study document here
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Supports PDF, DOCX, and TXT up to 10MB
                  </p>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {file.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to generate
                  </p>
                </div>
              )}
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
              variant="primary"
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={!file}
            >
              Generate Grounded Quiz
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default DocumentQuiz;
