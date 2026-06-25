export default function Automations() {
  const integrations = [
    {
      name: 'Google Calendar',
      icon: '📅',
      status: 'Connected',
      statusColor: '#22c55e',
      description: 'Automatically creates calendar events for every deadline and study session',
      features: ['Auto-create events', 'Reminders 1 day before', 'Study blocks'],
      stats: { label: 'Events Created', value: 24 },
    },
    {
      name: 'WhatsApp Bot',
      icon: '💬',
      status: 'Active',
      statusColor: '#22c55e',
      description: 'Sends intelligent reminders via WhatsApp at the right time',
      features: ['24h deadline reminders', '1h deadline reminders', 'Attendance alerts'],
      stats: { label: 'Messages Sent', value: 37 },
    },
    {
      name: 'AI Study Planner',
      icon: '🤖',
      status: 'Running',
      statusColor: '#3b82f6',
      description: 'Generates optimized study schedules based on your workload and deadlines',
      features: ['Smart scheduling', 'Difficulty-aware plans', 'Progress tracking'],
      stats: { label: 'Plans Generated', value: 8 },
    },
    {
      name: 'Attendance Monitor',
      icon: '📊',
      status: 'Monitoring',
      statusColor: '#f59e0b',
      description: 'Tracks attendance across all subjects and predicts risk levels',
      features: ['Real-time tracking', 'Risk prediction', 'Weekly reports'],
      stats: { label: 'Alerts Sent', value: 5 },
    },
  ];

  const recentActions = [
    { time: '10:23 AM', action: 'WhatsApp reminder sent for CN Lab Report', icon: '💬', color: '#22c55e' },
    { time: '09:45 AM', action: 'Google Calendar updated with DBMS Project event', icon: '📅', color: '#3b82f6' },
    { time: '08:30 AM', action: 'AI Study plan regenerated for ML Assignment', icon: '🤖', color: '#8b5cf6' },
    { time: 'Yesterday', action: 'Attendance alert triggered: DBMS at 68%', icon: '⚠️', color: '#f59e0b' },
    { time: 'Yesterday', action: 'WhatsApp digest: Weekly attendance summary', icon: '💬', color: '#22c55e' },
    { time: '2 days ago', action: 'OS Exam added to Google Calendar', icon: '📅', color: '#3b82f6' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">⚡ Automations</h1>
        <p className="page-subtitle">AI-powered integrations that work in the background for you</p>
      </div>

      {/* Integrations */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {integrations.map(item => (
          <div key={item.name} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'var(--bg-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.statusColor, animation: 'pulse-slow 1.5s ease-in-out infinite' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.statusColor }}>{item.status}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-400)' }}>{item.stats.value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.stats.label}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
              {item.description}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {item.features.map(f => (
                <div key={f} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: 'var(--emerald-400)', fontSize: 10 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Workflow diagram */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 24 }}>🔄 Automation Workflow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { icon: '📝', label: 'Student Adds Deadline', desc: 'Enter task, subject, date, difficulty & hours', color: '#3b82f6' },
              { icon: '🤖', label: 'AI Analyzes Workload', desc: 'Considers existing deadlines, attendance, study hours', color: '#8b5cf6' },
              { icon: '📋', label: 'Study Plan Generated', desc: 'Day-by-day schedule optimized for success', color: '#a855f7' },
              { icon: '📅', label: 'Google Calendar Synced', desc: 'Events auto-created for all study sessions', color: '#22c55e' },
              { icon: '💬', label: 'WhatsApp Reminders Set', desc: '24h and 1h before deadline notifications', color: '#f59e0b' },
              { icon: '✅', label: 'Student Stays on Track', desc: 'Progress tracked, AI updates plan if needed', color: '#ec4899' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${step.color}18`, border: `1.5px solid ${step.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>
                    {step.icon}
                  </div>
                  {i < 5 && <div style={{ width: 2, height: 28, background: `linear-gradient(to bottom, ${step.color}, ${['#8b5cf6','#a855f7','#22c55e','#f59e0b','#ec4899','#3b82f6'][i+1]})`, opacity: 0.4 }} />}
                </div>
                <div style={{ paddingBottom: 28, paddingTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: step.color, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent actions */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🕐 Recent Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActions.map((action, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderBottom: i < recentActions.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${action.color}18`, border: `1px solid ${action.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{action.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{action.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
