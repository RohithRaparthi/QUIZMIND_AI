import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Upload, 
  Check, 
  Zap, 
  ShieldCheck, 
  Play, 
  Layers 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import ThemeSelector from '../components/ThemeSelector';

const LandingPage = () => {
  const [activeMockOption, setActiveMockOption] = useState('b');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);

  // Soft animation loop for the mockup upload state
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUploading(true);
      setUploadProgress(0);
      
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
        }
      }, 100);
      
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Document Quiz Generator",
      desc: "Upload PDFs, Word docs, or text files. Our grounded AI reads them and crafts multiple-choice questions referencing only facts in your material.",
      icon: FileSpreadsheet,
      color: "var(--primary)",
      badge: "Zero Hallucination"
    },
    {
      title: "Topic Quiz Generator",
      desc: "Type in any academic subject—Python, Machine Learning, Operating Systems—and get custom, calibrated question sets generated instantly.",
      icon: Sparkles,
      color: "var(--secondary)",
      badge: "Instant Generation"
    },
    {
      title: "Learning Analytics",
      desc: "Track attempts, analyze chronological score progression, view difficulty distributions, and inspect detailed breakdowns of past answers.",
      icon: TrendingUp,
      color: "#10b981",
      badge: "Mastery Metrics"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Upload Materials",
      desc: "Drag and drop your syllabus, class notes, slides, or textbook chapters (PDF, DOCX, TXT)."
    },
    {
      num: "02",
      title: "Configure & Generate",
      desc: "Select difficulty, set question counts, and let Groq or Gemini compile your custom quiz."
    },
    {
      num: "03",
      title: "Calibrate & Retain",
      desc: "Take quizzes, study source-grounded explanations, and track your progress over time."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: 'var(--bg-dark)',
      backgroundImage: 'var(--bg-gradient)',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '45vw',
        height: '45vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Grid Pattern overlay for tech aesthetic */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 1.5rem',
        zIndex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {/* Header Branding */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          marginBottom: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/favicon.svg" 
              alt="QuizMind AI Logo" 
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }}
            />
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              QuizMind AI
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeSelector />
            <Link to="/login" style={{ 
              textDecoration: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 500, 
              fontSize: '0.95rem',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Sign In
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                Get Started
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          {/* Animated Promo Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            borderRadius: '9999px',
            color: '#c084fc',
            fontSize: '0.825rem',
            fontWeight: 500,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)'
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#c084fc', animation: 'pulse 2s infinite' }}></span>
            Powered by Groq Llama 3.3 & Google Gemini
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em'
          }}>
            Transform Study Notes<br />
            <span style={{ 
              background: 'linear-gradient(90deg, #a78bfa 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Into Smart Interactive Quizzes
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Supercharge your active recall. Upload slides, textbooks, or notes, and let our grounded AI compile custom multi-choice quizzes. Zero hallucinations, complete citations, full analytics.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
                Create Free Account <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive App Mockup (SaaS Tech Preview) */}
        <div style={{
          marginBottom: '7rem',
          perspective: '1000px',
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px 0 rgba(124, 58, 237, 0.1)',
            overflow: 'hidden',
            width: '100%',
            transition: 'transform 0.5s ease',
            transformStyle: 'preserve-3d'
          }} className="glass-panel">
            
            {/* Mock Window Title Bar */}
            <div style={{
              height: '40px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              gap: '0.5rem',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>QuizMind AI - Interactive Console</span>
              <div style={{ width: '40px' }}></div>
            </div>

            {/* Mock Workspace Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              minHeight: '440px'
            }}>
              
              {/* Mock Sidebar */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderRight: '1px solid rgba(255, 255, 255, 0.04)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.85 }}>
                  <img src="/favicon.svg" style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: 600 }}>QuizMind Workspace</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', color: 'white', fontWeight: 500 }}>Dashboard</div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>Document Quiz</div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>Topic Quiz</div>
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>Quiz History</div>
                </div>
                
                {/* Active Providers Mock */}
                <div style={{ marginTop: 'auto', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active LLM nodes:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                      <span>groq: llama-3.3</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                      <span>gemini-2.5-flash</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Main Panel */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
                {/* Upload Section Mock */}
                <div style={{
                  border: '1px dashed rgba(124, 58, 237, 0.3)',
                  background: 'rgba(124, 58, 237, 0.02)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Upload size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 500, color: 'white' }}>
                        {isUploading ? "Uploading file..." : "deep_learning_principles.pdf"}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', width: `${uploadProgress}%`, transition: 'width 0.2s ease' }}></div>
                    </div>
                  </div>
                  {!isUploading && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#34d399',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <Check size={12} /> Grounded
                    </span>
                  )}
                </div>

                {/* Generated Question Area Mock */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question 1 of 5</span>
                    <span style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      color: 'var(--secondary)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '99px',
                      fontSize: '#06b6d4',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                      Source: Chapter 3, Page 14
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', lineHeight: '1.4' }}>
                    Which mechanism is primarily used in Transformer models to allow the network to focus on different parts of the input sequence?
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { key: 'a', text: 'Recurrent Neural Connections (RNN)' },
                      { key: 'b', text: 'Self-Attention Mechanism', correct: true },
                      { key: 'c', text: 'Max Pooling layers' },
                      { key: 'd', text: 'Batch Normalization layers' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setActiveMockOption(opt.key)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          background: activeMockOption === opt.key 
                            ? (opt.correct ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)')
                            : 'rgba(255, 255, 255, 0.02)',
                          border: activeMockOption === opt.key
                            ? (opt.correct ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)')
                            : '1px solid rgba(255, 255, 255, 0.04)',
                          color: activeMockOption === opt.key
                            ? (opt.correct ? '#34d399' : '#f87171')
                            : 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'var(--transition)'
                        }}
                      >
                        <span><strong style={{ marginRight: '0.5rem', textTransform: 'uppercase' }}>{opt.key}.</strong> {opt.text}</span>
                        {activeMockOption === opt.key && opt.correct && <Check size={16} />}
                      </button>
                    ))}
                  </div>

                  {activeMockOption === 'b' && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.04)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      borderRadius: '8px',
                      padding: '1rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
                        <ShieldCheck size={16} /> Grounded Citation
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                        "...the core feature of the Transformer is the self-attention mechanism, which computes a representation of the sequence by relating different positions of a single sequence..."
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '6rem' }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            Designed for Active Recall and Mastery
          </h3>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 4rem auto',
            fontSize: '1rem'
          }}>
            Combining grounded retrieval with advanced language models to provide custom, instant study assessments.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <GlassCard key={index} className="glass-panel-hover" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `rgba(255,255,255,0.02)`,
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: feat.color,
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`
                  }}>
                    <Icon size={22} />
                  </div>
                  
                  <span style={{
                    fontSize: '0.75rem',
                    color: feat.color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>
                    {feat.badge}
                  </span>

                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                    {feat.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div style={{ marginBottom: '7rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '5rem' }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            How QuizMind AI Works
          </h3>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto 4rem auto',
            fontSize: '1rem'
          }}>
            Three simple steps to transform your static study materials into interactive memory tests.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.15) 0%, transparent 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'absolute',
                  top: '-1.5rem',
                  left: 0,
                  zIndex: 0,
                  fontFamily: 'system-ui'
                }}>
                  {step.num}
                </div>
                <div style={{ position: 'relative', zIndex: 1, paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action Card */}
        <div style={{ marginBottom: '6rem' }}>
          <GlassCard style={{
            background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), rgba(15, 23, 42, 0.45))',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '20px'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Ready to Accelerate Your Learning?
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '550px',
              margin: '0 auto 2.5rem auto',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}>
              Create your account today and generate high-fidelity, interactive assessments instantly. Free forever for students.
            </p>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="accent" style={{ fontSize: '1.1rem', padding: '0.85rem 2.5rem' }}>
                Start Gen-AI Quizzes
              </Button>
            </Link>
          </GlassCard>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '2.5rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 QuizMind AI. Built for accelerated retention.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
