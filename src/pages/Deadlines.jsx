import { useState } from 'react';
import { useApp } from '../context/AppContext';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const defaultForm = {
  title: '', subject: '', deadline: '', deadlineTime: '11:59',
  priority: 'medium', difficulty: 'medium', estimatedHours: 4, notes: '',
};

function generateAIPlan(form) {
  const today = new Date();
  const due = new Date(form.deadline);
  const diff = Math.max(1, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
  const days = Math.min(diff, 5);
  const taskTemplates = {
    easy: ['Review materials', 'Complete draft', 'Proofread & submit'],
    medium: ['Read theory', 'Practice exercises', 'Complete assignment', 'Review & finalize'],
    hard: ['Study theory deeply', 'Setup environment', 'Implement core logic', 'Testing & debugging', 'Report writing'],
  };
  const templates = taskTemplates[form.difficulty] || taskTemplates.medium;
  const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  return Array.from({ length: days }, (_, i) => ({
    day: dayNames[i] || `Day ${i + 1}`,
    task: templates[Math.floor((i / days) * templates.length)] || templates[templates.length - 1],
    hours: Math.ceil(form.estimatedHours / days),
  }));
}

function DeadlineForm({ onClose }) {
  const { addDeadline, addNotification } = useApp();
  const [form, setForm] = useState(defaultForm);
  const [aiPlan, setAiPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = () => {
    if (!form.title || !form.deadline) return;
    setGenerating(true);
    setTimeout(() => {
      setAiPlan(generateAIPlan(form));
      setGenerating(false);
    }, 1800);
  };

  const handleSave = () => {
    if (!form.title || !form.deadline) return;
    const today = new Date();
    const due = new Date(form.deadline);
    const daysLeft = Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
    addDeadline({
      ...form,
      completionPercent: 0,
      daysLeft,
      studyPlan: aiPlan || generateAIPlan(form),
      aiStats: {
        estimatedCompletion: Math.floor(70 + Math.random() * 25),
        remainingHours: form.estimatedHours,
        productivityScore: Math.floor(75 + Math.random() * 20),
        suggestedDailyHours: +(form.estimatedHours / Math.max(daysLeft, 1)).toFixed(1),
        confidenceLevel: Math.floor(80 + Math.random() * 15),
      },
    });
    addNotification({ type: 'calendar', title: 'Calendar Event Created', message: `${form.title} synced to Google Calendar` });
    addNotification({ type: 'whatsapp', title: 'WhatsApp Reminder Scheduled', message: `Reminder set for ${form.title}` });
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="card animate-slide-in" style={{
        width: '100%', maxWidth: 680, maxHeight: '90vh',
        overflowY: 'auto', padding: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              ✨ Add New Deadline
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              AI will generate an optimized study plan
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="label">Task Title *</label>
            <input className="input" placeholder="e.g. Machine Learning Assignment" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Subject *</label>
            <input className="input" placeholder="e.g. Machine Learning" value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Deadline Date *</label>
            <input className="input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label className="label">Deadline Time</label>
            <input className="input" type="time" value={form.deadlineTime} onChange={e => set('deadlineTime', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Difficulty</label>
            <select className="input" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="label">Estimated Study Hours: <strong style={{ color: 'var(--blue-400)' }}>{form.estimatedHours}h</strong></label>
            <input
              type="range" min={1} max={40} value={form.estimatedHours}
              onChange={e => set('estimatedHours', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>1h</span><span>40h</span>
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="label">Notes</label>
            <textarea className="input" rows={3} placeholder="Additional notes, topics to cover..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={!form.title || !form.deadline || generating}
            style={{ flex: 1 }}
          >
            {generating ? (
              <><span style={{ animation: 'spin 1s linear infinite', display:'inline-block' }}>⟳</span> Generating…</>
            ) : '🤖 Generate AI Study Plan'}
          </button>
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={!form.title || !form.deadline || saved}
            style={{ flex: 1 }}
          >
            {saved ? '✅ Saved!' : '💾 Save Deadline'}
          </button>
        </div>

        {/* AI Plan Preview */}
        {generating && (
          <div style={{ marginTop: 24 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>🤖 AI is analyzing your deadline…</div>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8, borderRadius: 12 }} />
            ))}
          </div>
        )}

        {aiPlan && !generating && (
          <div style={{ marginTop: 24, animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>🤖</div>
              <div>
                <div className="section-title" style={{ marginBottom: 0 }}>AI Study Plan Generated</div>
                <div style={{ fontSize: 11, color: 'var(--purple-400)', fontWeight: 600 }}>Optimized for your schedule</div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Est. Completion', value: '87%', color: '#22c55e' },
                { label: 'Daily Hours', value: `${+(form.estimatedHours / aiPlan.length).toFixed(1)}h`, color: '#3b82f6' },
                { label: 'Productivity', value: '84', color: '#f59e0b' },
                { label: 'Confidence', value: '91%', color: '#8b5cf6' },
                { label: 'Study Days', value: aiPlan.length, color: '#ec4899' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: `${s.color}12`, border: `1px solid ${s.color}30`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Study plan days */}
            <div className="timeline">
              {aiPlan.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: `hsl(${220 + i*20},80%,60%)` }}>●</div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10,
                  }}>
                    <div style={{
                      minWidth: 70, fontSize: 11, fontWeight: 700,
                      color: `hsl(${220 + i*20},80%,60%)`, textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      {item.day}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{item.task}</div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: 'rgba(59,130,246,0.12)', color: 'var(--blue-400)',
                    }}>{item.hours}h</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Automation preview */}
            <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald-400)', marginBottom: 12 }}>⚡ Automations Scheduled</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { icon: '📅', text: 'Google Calendar event created' },
                  { icon: '💬', text: 'WhatsApp reminder (24h before)' },
                  { icon: '💬', text: 'WhatsApp reminder (1h before)' },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                    background: 'var(--bg-card2)', borderRadius: 8, border: '1px solid var(--border)',
                    fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                  }}>
                    <span>{a.icon}</span>{a.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mini Calendar
function MiniCalendar({ events }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const eventMap = {};
  events.forEach(e => {
    const d = new Date(e.date).getDate();
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(e);
  });

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'flex', gap: 6, fontSize: 11, fontWeight: 600 }}>
          {[['var(--rose-500)', 'Deadline'], ['var(--blue-400)', 'Exam'], ['var(--emerald-400)', 'Study']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />{l}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-grid" style={{ marginBottom: 8 }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isToday = day === today.getDate();
          const hasEvents = eventMap[day];
          return (
            <div key={day} className={`calendar-day${isToday ? ' today' : ''}`}
              style={{ flexDirection: 'column', fontSize: 12, position: 'relative' }}>
              {day}
              {hasEvents && (
                <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
                  {hasEvents.slice(0,3).map((e, i) => (
                    <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: e.color }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Deadline card
function DeadlineCard({ d, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const { updateDeadlineCompletion } = useApp();
  const priorityColors = { critical: '#ef4444', high: '#f59e0b', medium: '#8b5cf6', low: '#22c55e' };
  const pc = priorityColors[d.priority] || '#8b5cf6';
  const glowClass = d.priority === 'critical' ? 'glow-red' : d.priority === 'high' ? 'glow-amber' : '';

  return (
    <div className={`card ${glowClass}`} style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: `${pc}18`, border: `1.5px solid ${pc}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: pc, lineHeight: 1 }}>{d.daysLeft}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>days</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.title}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.subject}</span>
            <span className={`badge badge-${d.priority}`}>{d.priority}</span>
            <span className={`badge badge-${d.difficulty === 'medium' ? 'medium-diff' : d.difficulty}`}>{d.difficulty}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Due</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
            {new Date(d.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.deadlineTime || '11:59 PM'}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Completion</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-400)' }}>{d.completionPercent}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${d.completionPercent}%`,
            background: d.completionPercent >= 75 ? 'var(--grad-success)' : d.completionPercent >= 40 ? 'var(--grad-warning)' : 'var(--grad-danger)',
          }} />
        </div>
      </div>

      {/* AI Stats mini */}
      {d.aiStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'AI Score', value: d.aiStats.productivityScore, color: '#f59e0b' },
            { label: 'Daily Hours', value: `${d.aiStats.suggestedDailyHours}h`, color: '#3b82f6' },
            { label: 'Confidence', value: `${d.aiStats.confidenceLevel}%`, color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '8px 10px', borderRadius: 8,
              background: 'var(--bg-card2)', border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Expand/collapse */}
      {d.studyPlan && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(v => !v)}
          style={{ width: '100%', justifyContent: 'center', marginBottom: expanded ? 12 : 0 }}
        >
          {expanded ? '▲ Hide Study Plan' : '▼ View AI Study Plan'}
        </button>
      )}

      {expanded && d.studyPlan && (
        <div className="timeline" style={{ marginTop: 4 }}>
          {d.studyPlan.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" style={{ background: `hsl(${200 + i*25},75%,55%)` }}>●</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8,
              }}>
                <div style={{ minWidth: 60, fontSize: 10, fontWeight: 700, color: `hsl(${200 + i*25},75%,55%)`, textTransform: 'uppercase' }}>{item.day}</div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{item.task}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-400)' }}>{item.hours}h</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button className="btn btn-ghost btn-xs" style={{ flex: 1 }}>✏️ Edit</button>
        <button
          className="btn btn-ghost btn-xs"
          style={{ flex: 1 }}
          onClick={() => updateDeadlineCompletion(d.id, Math.min(100, d.completionPercent + 10))}
        >
          ✅ Progress
        </button>
        <button className="btn btn-ghost btn-xs" onClick={() => onDelete(d.id)} style={{ color: 'var(--rose-400)' }}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default function Deadlines() {
  const { deadlines, deleteDeadline } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = deadlines.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'critical') return d.priority === 'critical';
    if (filter === 'upcoming') return d.daysLeft <= 7;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">📋 Smart Deadline Manager</h1>
          <p className="page-subtitle">AI-powered study planning for all your assignments & exams</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Deadline
        </button>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar">
        {[['all', 'All Deadlines'], ['upcoming', 'This Week'], ['critical', 'Critical']].map(([k, l]) => (
          <button key={k} className={`tab ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Deadline cards */}
        <div>
          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-title">No deadlines found</div>
                <div className="empty-state-text">Add your first deadline and let AI build your study plan</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {filtered.map(d => (
                <DeadlineCard key={d.id} d={d} onDelete={deleteDeadline} />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mini Calendar */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              fontWeight: 700, fontSize: 14,
            }}>📅 Calendar Preview</div>
            <MiniCalendar events={[
              { date: '2026-06-27', color: '#ef4444' },
              { date: '2026-06-30', color: '#8b5cf6' },
              { date: '2026-07-03', color: '#ef4444' },
              { date: '2026-07-10', color: '#3b82f6' },
              { date: '2026-06-25', color: '#22c55e' },
              { date: '2026-06-26', color: '#22c55e' },
              { date: '2026-06-28', color: '#22c55e' },
            ]} />
          </div>

          {/* Automation Status */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>⚡ Automation Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📅', label: 'Google Calendar', status: 'Connected', color: '#22c55e' },
                { icon: '💬', label: 'WhatsApp Reminder', status: '24h Before', color: '#22c55e' },
                { icon: '💬', label: 'WhatsApp Reminder', status: '1h Before', color: '#22c55e' },
                { icon: '🤖', label: 'AI Planner', status: 'Active', color: '#3b82f6' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: item.color,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, animation: 'pulse-slow 1.5s ease-in-out infinite' }} />
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🗓️ Deadline Timeline</div>
            <div className="timeline">
              {[
                { label: 'Deadline Created', icon: '✅', color: '#22c55e' },
                { label: 'AI Plan Generated', icon: '🤖', color: '#8b5cf6' },
                { label: 'Calendar Event Created', icon: '📅', color: '#3b82f6' },
                { label: 'WhatsApp (24h before)', icon: '💬', color: '#f59e0b' },
                { label: 'WhatsApp (1h before)', icon: '💬', color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} className="timeline-item" style={{ paddingBottom: 16 }}>
                  <div className="timeline-dot" style={{ background: item.color, width: 20, height: 20, left: -24, fontSize: 9, color: 'white' }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', paddingTop: 1 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && <DeadlineForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
