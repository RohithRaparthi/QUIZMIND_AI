import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, FileSpreadsheet, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const LandingPage = () => {
  const features = [
    {
      title: "Document Quiz Generator",
      desc: "Upload PDFs, Word docs (DOCX), or text files. Our grounded AI will read them and craft multi-choice questions referencing only facts in your material.",
      icon: FileSpreadsheet,
      color: "var(--primary)"
    },
    {
      title: "Topic Quiz Generator",
      desc: "Type in any academic topic — Python, Machine Learning, Operating Systems — and get custom, calibrated question sets generated instantly.",
      icon: Sparkles,
      color: "var(--secondary)"
    },
    {
      title: "Learning Analytics",
      desc: "Track attempts, analyze chronological score progression, view difficulty distributions, and inspect detailed breakdowns of past answers.",
      icon: TrendingUp,
      color: "#10b981"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem 1rem'
    }}>
      {/* Decorative background glow blobs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(124, 58, 237, 0.15)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '15%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(6, 182, 212, 0.15)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Header Branding */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BrainCircuit size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>QuizMind AI</span>
          </div>
          <div>
            <Link to="/login" style={{ textDecoration: 'none', marginRight: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>
              Sign In
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Get Started</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em'
          }}>
            QuizMind AI
          </h1>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            background: 'linear-gradient(90deg, #a78bfa 0%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            "Transform Notes Into Smart Quizzes"
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Unlock the power of grounded study. Generate interactive study assessments based on notes, books, or specific topics using xAI Grok and Google Gemini.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.875rem 2rem' }}>
                Create Free Account <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
            fontWeight: 600
          }}>
            Designed for Active Recall and Mastery
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <GlassCard key={index} className="glass-panel-hover" style={{ padding: '2.5rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `rgba(255,255,255,0.03)`,
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: feat.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {feat.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
