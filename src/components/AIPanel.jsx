import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, X, SendHorizonal, BookOpen, Clock, BarChart2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiRecommendations } from '../data/mockData';

/* Map data icons → Lucide */
const ICON_MAP = {
  brain: Brain, book: BookOpen, clock: Clock,
  chart: BarChart2, zap: Zap, sparkles: Sparkles,
};

export default function AIPanel() {
  const { showAIPanel, setShowAIPanel } = useApp();

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
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Your academic co-pilot</div>
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

        {/* Recommendations */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
          Today's Insights
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
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

        {/* Ask AI */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            Ask AI
          </div>
          <div style={{
            display: 'flex', gap: 8, padding: '10px 12px',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 10,
          }}>
            <input
              placeholder="Ask about deadlines, attendance..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 13,
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button className="btn btn-primary btn-xs" style={{ flexShrink: 0, padding: '6px 10px' }}>
              <SendHorizonal size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
