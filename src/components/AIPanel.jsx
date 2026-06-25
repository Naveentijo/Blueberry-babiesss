import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, X, SendHorizonal, BookOpen, Clock, BarChart2, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiRecommendations } from '../data/mockData';
import { aiAPI } from '../services/api';

/* Map data icons → Lucide */
const ICON_MAP = {
  brain: Brain, book: BookOpen, clock: Clock,
  chart: BarChart2, zap: Zap, sparkles: Sparkles,
};

export default function AIPanel() {
  const { showAIPanel, setShowAIPanel } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  /* FAB when closed */
  if (!showAIPanel) {
    return (
      <motion.button
        className="ai-fab"
        onClick={() => setShowAIPanel(true)}
        title="AI Assistant"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
      >
        <Brain size={24} color="white" />
      </motion.button>
    );
  }

  const handleAsk = async () => {
    const text = query.trim();
    if (!text || loading) return;

    setLoading(true);
    setAiResult(null);
    setAiError(null);

    try {
      // Detect intent from user query to pick the right AI type
      const type = detectType(text);
      const response = await aiAPI.generate(type, text);
      setAiResult({ type, data: response.result });
    } catch (err) {
      setAiError(err.message || 'AI request failed. Check your GROQ_API_KEY in server/.env');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <motion.div
      className="ai-panel"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* Header */}
      <div className="ai-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={19} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>CampusFlow AI</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Powered by Groq · Llama 3</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setShowAIPanel(false)}
          style={{ color: 'white' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          marginBottom: 14,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e', animation: 'pulse-slow 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
            AI is actively monitoring your progress
          </span>
        </div>

        {/* AI Result Panel */}
        <AnimatePresence mode="wait">
          {aiResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 14, padding: '12px 14px', borderRadius: 10,
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                maxHeight: 200, overflowY: 'auto',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                AI Response · {aiResult.type}
              </div>
              <AIResultDisplay result={aiResult} />
            </motion.div>
          )}
          {aiError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 14, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}
            >
              <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#ef4444', lineHeight: 1.5 }}>{aiError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        {!aiResult && !aiError && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              Today's Insights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
              {aiRecommendations.map((rec, i) => {
                const Icon = ICON_MAP[rec.iconKey] || Sparkles;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex', gap: 10, padding: '10px 12px',
                      borderRadius: 10, background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'var(--bg-hover)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} style={{ color: 'var(--blue-500)' }} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {rec.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Ask AI */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            Ask AI
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>
            Try: "summarize photosynthesis", "make flashcards about TCP/IP", "quiz me on OS scheduling"
          </div>
          <div style={{
            display: 'flex', gap: 8, padding: '10px 12px',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 10,
          }}>
            <input
              placeholder="Ask about any topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 13,
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              className="btn btn-primary btn-xs"
              style={{ flexShrink: 0, padding: '6px 10px' }}
              onClick={handleAsk}
              disabled={loading || !query.trim()}
            >
              {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <SendHorizonal size={13} />}
            </button>
          </div>
          {aiResult && (
            <button
              onClick={() => { setAiResult(null); setAiError(null); setQuery(''); }}
              style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}
            >
              ← Back to insights
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Sub-component: render AI result based on type ───────────────────────── */
function AIResultDisplay({ result }) {
  const { type, data } = result;

  if (type === 'summary') {
    return (
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>{data.summary}</p>
        {data.keyPoints?.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {data.keyPoints.slice(0, 4).map((pt, i) => (
              <li key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{pt}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (type === 'flashcards') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.flashcards?.slice(0, 4).map((fc, i) => (
          <div key={i} style={{ padding: '6px 8px', background: 'var(--bg-hover)', borderRadius: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-400)', marginBottom: 2 }}>Q: {fc.question}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>A: {fc.answer}</div>
          </div>
        ))}
        {data.flashcards?.length > 4 && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{data.flashcards.length - 4} more flashcards</div>
        )}
      </div>
    );
  }

  if (type === 'quiz') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.quiz?.slice(0, 2).map((q, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Q{i + 1}: {q.question}</div>
            {q.options?.map((opt, j) => (
              <div key={j} style={{
                fontSize: 11, padding: '2px 6px', marginBottom: 2, borderRadius: 4,
                background: j === q.correctIndex ? 'rgba(34,197,94,0.15)' : 'transparent',
                color: j === q.correctIndex ? '#22c55e' : 'var(--text-secondary)',
              }}>
                {String.fromCharCode(65 + j)}. {opt}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'notice') {
    return (
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 6 }}>{data.summary}</p>
        {data.actionRequired?.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>Action Required:</div>
            {data.actionRequired.map((a, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>• {a}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: show raw JSON prettified
  return (
    <pre style={{ fontSize: 10, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/* ── Detect AI type from natural language query ──────────────────────────── */
function detectType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('flashcard') || lower.includes('flash card')) return 'flashcards';
  if (lower.includes('quiz') || lower.includes('mcq') || lower.includes('question')) return 'quiz';
  if (lower.includes('study plan') || lower.includes('schedule') || lower.includes('plan for')) return 'studyplan';
  if (lower.includes('notice') || lower.includes('announcement') || lower.includes('circular')) return 'notice';
  if (lower.includes('study buddy') || lower.includes('full analysis') || lower.includes('everything about')) return 'studybuddy';
  return 'summary'; // default
}
