import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { attendanceData as mockAttendance } from '../data/mockData';
import {
  BarChart3, Edit3, Search, MessageSquare, Brain, Bell,
  CheckCircle2, AlertTriangle, Lightbulb, TrendingUp
} from 'lucide-react';

// Circular Gauge
function CircularGauge({ value, max = 100, color, size = 120, stroke = 12, label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(value / max), 200);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: size > 100 ? 24 : 16, fontWeight: 800, color, lineHeight: 1 }}>{value}%</div>
        {label && <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>}
      </div>
    </div>
  );
}

// Trend mini chart (SVG bars)
function TrendChart({ data, color }) {
  const max = Math.max(...data, 1);
  const h = 50;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: h }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            borderRadius: '3px 3px 0 0',
            background: i === data.length - 1 ? color : `${color}50`,
            transition: `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms`,
            minHeight: 4,
          }}
        />
      ))}
    </div>
  );
}

// Attendance input form
function AttendanceForm({ onAnalyze }) {
  const [form, setForm] = useState({
    subject: '', conducted: '', attended: '', required: 75,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.subject || !form.conducted || !form.attended) return;
    const pct = Math.round((Number(form.attended) / Number(form.conducted)) * 100);
    const req = Number(form.required);
    let risk = 'safe';
    if (pct < req - 5) risk = 'critical';
    else if (pct < req) risk = 'warning';

    const needed = Math.max(0, Math.ceil((req * form.conducted - 100 * form.attended) / (100 - req)));
    onAnalyze({
      id: Date.now(),
      subject: form.subject,
      code: form.subject.slice(0, 4).toUpperCase(),
      currentPercent: pct,
      classesConducted: Number(form.conducted),
      classesAttended: Number(form.attended),
      requiredPercent: req,
      risk,
      color: risk === 'critical' ? '#ef4444' : risk === 'warning' ? '#f59e0b' : '#22c55e',
      trend: [pct - 10, pct - 8, pct - 5, pct - 3, pct - 1, pct].map(v => Math.max(0, v)),
      classesNeeded: needed,
      maxCanMiss: risk === 'safe' ? Math.floor((pct - req) * form.conducted / 100) : 0,
      recoveryWeeks: needed > 0 ? Math.ceil(needed / 3) : 0,
      strategy: risk === 'critical'
        ? `Attend all ${needed} upcoming classes without any absence.`
        : risk === 'warning'
        ? `Attend the next ${needed} classes to reach safe zone.`
        : `Great! You can miss up to ${Math.floor((pct - req) * form.conducted / 100)} more classes.`,
    });
  };

  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit3 size={15} style={{ color: 'var(--blue-400)' }} /> Attendance Input
        </div>
        <div className="section-subtitle">Enter your attendance details for AI analysis</div>
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="form-group">
          <label className="label">Subject Name *</label>
          <input className="input" placeholder="e.g. Database Management" value={form.subject} onChange={e => set('subject', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Required Attendance %</label>
          <select className="input" value={form.required} onChange={e => set('required', e.target.value)}>
            {[60, 65, 70, 75, 80, 85].map(v => <option key={v} value={v}>{v}%</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Classes Conducted *</label>
          <input className="input" type="number" min={1} placeholder="50" value={form.conducted} onChange={e => set('conducted', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Classes Attended *</label>
          <input className="input" type="number" min={0} placeholder="38" value={form.attended} onChange={e => set('attended', e.target.value)} />
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={!form.subject || !form.conducted || !form.attended}
        style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Search size={14} /> Analyze Attendance
      </button>
    </div>
  );
}

// Subject Attendance Card
function SubjectCard({ s }) {
  const riskLabels = { critical: 'Critical', warning: 'Warning', safe: 'Safe' };
  const bgMap = { critical: 'rgba(239,68,68,0.06)', warning: 'rgba(245,158,11,0.06)', safe: 'rgba(34,197,94,0.06)' };
  const glowMap = { critical: 'glow-red', warning: 'glow-amber', safe: 'glow-green' };

  return (
    <div className={`card ${glowMap[s.risk]}`} style={{ padding: 22, background: bgMap[s.risk] }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <CircularGauge value={s.currentPercent} color={s.color} size={80} stroke={7} label="current" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.subject}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            {s.classesAttended}/{s.classesConducted} classes attended
          </div>
          <span className={`badge badge-${s.risk}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="dot" style={{ background: s.color, width: 6, height: 6 }} /> {riskLabels[s.risk]}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Required</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.requiredPercent}%</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        {s.risk !== 'safe' && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{s.classesNeeded}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Classes Needed</div>
          </div>
        )}
        {s.risk === 'safe' && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{s.maxCanMiss}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Can Miss</div>
          </div>
        )}
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--blue-400)' }}>{s.recoveryWeeks}w</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Recovery</div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--purple-400)' }}>{s.currentPercent - s.requiredPercent > 0 ? '+' : ''}{s.currentPercent - s.requiredPercent}%</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Vs Required</div>
        </div>
      </div>

      {/* Trend */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
          Attendance Trend
        </div>
        <TrendChart data={s.trend} color={s.color} />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Attendance Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{s.currentPercent}% / {s.requiredPercent}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: 'var(--border)', overflow: 'hidden', position: 'relative' }}>
          {/* Required marker */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${s.requiredPercent}%`,
            width: 2, background: 'white', opacity: 0.5, zIndex: 2,
          }} />
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${s.currentPercent}%`,
            background: s.risk === 'critical' ? 'var(--grad-danger)' : s.risk === 'warning' ? 'var(--grad-warning)' : 'var(--grad-success)',
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Strategy */}
      <div style={{
        padding: '12px 14px', borderRadius: 10,
        background: `${s.color}10`, border: `1px solid ${s.color}30`,
        fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.5,
      }}>
        <span style={{ fontWeight: 700, color: s.color }}>AI Strategy: </span>{s.strategy}
      </div>
    </div>
  );
}

// WhatsApp Automation workflow
function WhatsAppWorkflow() {
  const steps = [
    { icon: CheckCircle2, label: 'Attendance Updated', color: '#3b82f6' },
    { icon: Brain, label: 'AI Risk Analysis', color: '#8b5cf6' },
    { icon: MessageSquare, label: 'WhatsApp Reminder', color: '#22c55e' },
    { icon: Bell, label: 'Dashboard Notification', color: '#f59e0b' },
  ];
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MessageSquare size={15} style={{ color: '#22c55e' }} /> Weekly WhatsApp Automation
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: i < steps.length - 1 ? 0 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${step.color}18`, border: `1.5px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: step.color, flexShrink: 0,
                }}>
                  <Icon size={18} />
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom, ${step.color}, ${steps[i+1].color})`, opacity: 0.4 }} />
                )}
              </div>
              <div style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 16, padding: '12px 14px', borderRadius: 10,
        background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse-slow 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--emerald-400)' }}>Automation Active · Visual Preview Only</span>
      </div>
    </div>
  );
}

export default function Attendance() {
  const { addNotification } = useApp();
  const [subjects, setSubjects] = useState(mockAttendance);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = (newSubject) => {
    setAnalyzing(true);
    setTimeout(() => {
      setSubjects(prev => [newSubject, ...prev]);
      addNotification({ type: 'warning', title: 'Attendance Alert Generated', message: `${newSubject.subject}: ${newSubject.currentPercent}% — ${newSubject.risk}` });
      setAnalyzing(false);
    }, 1200);
  };

  const critical = subjects.filter(s => s.risk === 'critical').length;
  const warning = subjects.filter(s => s.risk === 'warning').length;
  const safe = subjects.filter(s => s.risk === 'safe').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BarChart3 size={28} style={{ color: 'var(--brand-blue)' }} />
        <div>
          <h1 className="page-title">Attendance Risk Alerter</h1>
          <p className="page-subtitle">AI-powered attendance monitoring to prevent eligibility issues</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Critical', count: critical, color: '#ef4444', icon: AlertTriangle, bg: 'rgba(239,68,68,0.06)' },
          { label: 'Warning', count: warning, color: '#f59e0b', icon: AlertTriangle, bg: 'rgba(245,158,11,0.06)' },
          { label: 'Safe', count: safe, color: '#22c55e', icon: CheckCircle2, bg: 'rgba(34,197,94,0.06)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card stat-card" style={{ background: s.bg, padding: 24, borderColor: `${s.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={28} style={{ color: s.color }} />
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label} Subjects</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Input form */}
          <AttendanceForm onAnalyze={handleAnalyze} />

          {/* Loading skeleton */}
          {analyzing && (
            <div className="card" style={{ padding: 24 }}>
              <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 80, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 60 }} />
            </div>
          )}

          {/* Subject cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {subjects.map(s => (
              <SubjectCard key={s.id} s={s} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Overall attendance gauge */}
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={15} style={{ color: '#8b5cf6' }} /> Overall Attendance
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CircularGauge
                value={Math.round(subjects.reduce((a, s) => a + s.currentPercent, 0) / subjects.length)}
                color="#8b5cf6"
                size={140}
                stroke={14}
                label="avg"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {subjects.map(s => (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{s.code}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.currentPercent}%</span>
                  </div>
                  <div className="progress-track" style={{ height: 5 }}>
                    <div className="progress-fill" style={{
                      width: `${s.currentPercent}%`,
                      background: s.risk === 'critical' ? 'var(--grad-danger)' : s.risk === 'warning' ? 'var(--grad-warning)' : 'var(--grad-success)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp workflow */}
          <WhatsAppWorkflow />

          {/* Recovery Tips */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lightbulb size={15} style={{ color: '#fbbf24' }} /> Recovery Tips
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Attend all classes for 2 weeks straight to recover critical subjects',
                'Contact professor if you have a genuine reason for absences',
                'Join study groups to make up for missed content',
                'Set daily alarm reminders for each lecture',
              ].map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 12px',
                  borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)',
                  alignItems: 'flex-start',
                }}>
                  <Lightbulb size={14} style={{ color: '#fbbf24', marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
