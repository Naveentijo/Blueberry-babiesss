import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { dashboardStats, todayTasks, aiRecommendations } from '../data/mockData';
import {
  ClipboardList, BarChart3, Clock, Target, Pin, Brain,
  Sparkles, Zap, Calendar, MessageSquare, AlertTriangle, CheckCircle, BookOpen
} from 'lucide-react';

// Animated counter
function Counter({ target, suffix = '', duration = 1500 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

// Circular gauge
function CircularGauge({ value, max = 100, color, size = 80, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(value / max), 100);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

const statCards = [
  {
    key: 'upcomingDeadlines',
    label: 'Upcoming Deadlines',
    icon: ClipboardList,
    suffix: '',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    class: 'stat-card-purple',
    delta: '+2 this week',
    deltaColor: '#f87171',
  },
  {
    key: 'attendance',
    label: 'Avg. Attendance',
    icon: BarChart3,
    suffix: '%',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    class: 'stat-card-blue',
    delta: '↓ 2% vs last week',
    deltaColor: '#f87171',
  },
  {
    key: 'studyHoursToday',
    label: "Today's Study Hours",
    icon: Clock,
    suffix: 'h',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    class: 'stat-card-emerald',
    delta: 'Goal: 5h',
    deltaColor: '#4ade80',
  },
  {
    key: 'aiProductivityScore',
    label: 'AI Productivity Score',
    icon: Target,
    suffix: '',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    class: 'stat-card-amber',
    delta: '↑ 5 pts from yesterday',
    deltaColor: '#4ade80',
  },
];

export default function Dashboard() {
  const { deadlines, setActiveView } = useApp();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(todayTasks);

  const firstName = (user?.name || user?.email?.split('@')[0] || 'Student').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const priorityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#8b5cf6', low: '#22c55e' };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          {greeting}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="page-subtitle">Here's your academic overview for today · {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 stagger" style={{ marginBottom: 28 }}>
        {statCards.map(card => (
          <div key={card.key} className={`card stat-card ${card.class} animate-fade-in`} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
                <card.icon size={20} />
              </div>
              <CircularGauge
                value={dashboardStats[card.key]}
                max={card.key === 'upcomingDeadlines' ? 10 : card.key === 'studyHoursToday' ? 5 : 100}
                color={card.color}
                size={52}
                stroke={5}
              />
            </div>
            <div className="stat-value" style={{ color: card.color }}>
              <Counter
                target={typeof dashboardStats[card.key] === 'number' ? dashboardStats[card.key] : 0}
                suffix={card.suffix}
              />
            </div>
            <div className="stat-label">{card.label}</div>
            <div style={{ fontSize: 11, marginTop: 6, color: card.deltaColor, fontWeight: 600 }}>
              {card.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Today's Tasks */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Pin size={15} style={{ color: 'var(--blue-500)' }} /> Today's Tasks
              </div>
              <div className="section-subtitle">{tasks.filter(t => t.done).length}/{tasks.length} completed</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-400)', cursor: 'pointer' }}>+ Add task</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10,
                  background: task.done ? 'var(--bg-input)' : 'var(--bg-card2)',
                  border: `1px solid ${task.done ? 'var(--border)' : priorityColor[task.priority] + '30'}`,
                  cursor: 'pointer', transition: 'all var(--transition)',
                  opacity: task.done ? 0.6 : 1,
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${task.done ? 'var(--emerald-400)' : priorityColor[task.priority]}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: task.done ? 'var(--emerald-400)' : 'transparent',
                  flexShrink: 0, fontSize: 10,
                }}>
                  {task.done && '✓'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                    textDecoration: task.done ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.subject} · {task.time}</div>
                </div>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: 'var(--grad-success)',
              width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} style={{ color: 'var(--purple-400)' }} /> Upcoming Deadlines
              </div>
              <div className="section-subtitle">Next 10 days</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveView('deadlines')}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deadlines.slice(0, 4).map(d => (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: d.daysLeft <= 2 ? '#ef444418' : d.daysLeft <= 5 ? '#f59e0b18' : '#3b82f618',
                  border: `1px solid ${d.daysLeft <= 2 ? '#ef444440' : d.daysLeft <= 5 ? '#f59e0b40' : '#3b82f640'}`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: d.daysLeft <= 2 ? '#ef4444' : d.daysLeft <= 5 ? '#f59e0b' : '#3b82f6', lineHeight: 1 }}>
                    {d.daysLeft}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>days</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.subject}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--emerald-400)' }}>{d.completionPercent}%</div>
                  <div style={{ width: 60, height: 4, borderRadius: 99, background: 'var(--border)', marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--grad-primary)', width: `${d.completionPercent}%`, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* AI Recommendations */}
        <div className="card" style={{ padding: 24, borderColor: 'rgba(168,85,247,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <Brain size={18} />
            </div>
            <div>
              <div className="section-title">AI Recommendations</div>
              <div style={{ fontSize: 11, color: 'var(--purple-400)', fontWeight: 600 }}>● Updated 5 mins ago</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiRecommendations.slice(0, 4).map(rec => {
              const REC_ICONS = {
                zap:      Zap,
                book:     BookOpen,
                alert:    AlertTriangle,
                target:   Target,
                calendar: Calendar,
                check:    CheckCircle,
              };
              const RecIcon = REC_ICONS[rec.icon] || Sparkles;
              return (
                <div key={rec.id} style={{
                  display: 'flex', gap: 12, padding: '12px 14px',
                  borderRadius: 10, background: 'rgba(168,85,247,0.06)',
                  border: '1px solid rgba(168,85,247,0.15)',
                  alignItems: 'flex-start',
                }}>
                  <RecIcon size={16} style={{ color: '#c084fc', marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Automation Status */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Zap size={15} style={{ color: '#fbbf24' }} /> Automation Status
          </div>
          <div className="section-subtitle">Connected integrations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {[
              { name: 'Google Calendar', icon: Calendar, status: 'Connected', statusColor: '#22c55e', desc: '5 events synced today' },
              { name: 'WhatsApp Bot', icon: MessageSquare, status: 'Active', statusColor: '#22c55e', desc: '3 reminders scheduled' },
              { name: 'AI Study Planner', icon: Brain, status: 'Running', statusColor: '#3b82f6', desc: 'Processing 2 new deadlines' },
              { name: 'Attendance Monitor', icon: BarChart3, status: 'Monitoring', statusColor: '#f59e0b', desc: '1 critical alert pending' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', flexShrink: 0,
                  }}>
                    <Icon size={17} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 11, fontWeight: 700, color: item.statusColor,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.statusColor, animation: 'pulse-slow 1.5s ease-in-out infinite' }} />
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
