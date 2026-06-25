import { useState } from 'react';
import { calendarEvents, deadlines } from '../data/mockData';

function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventMap = {};
  calendarEvents.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(e);
    }
  });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button className="btn btn-ghost btn-icon" onClick={prevMonth}>←</button>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          {viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
        <button className="btn btn-ghost btn-icon" onClick={nextMonth}>→</button>
      </div>

      {/* Day headers */}
      <div className="calendar-grid" style={{ marginBottom: 8 }}>
        {dayNames.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: 'var(--text-muted)', padding: '4px 0', textTransform: 'uppercase',
          }}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="calendar-grid">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const events = eventMap[day] || [];
          return (
            <div
              key={day}
              className={`calendar-day${isToday ? ' today' : ''}`}
              style={{
                flexDirection: 'column',
                padding: '6px 2px',
                fontSize: 13,
                fontWeight: isToday ? 700 : 500,
                minHeight: 42,
                alignItems: 'center',
              }}
            >
              <span>{day}</span>
              {events.length > 0 && (
                <div style={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {events.slice(0, 3).map((e, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: e.color }} />
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

export default function Calendar() {
  const upcoming = deadlines.slice(0, 6).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">📅 Academic Calendar</h1>
        <p className="page-subtitle">All deadlines, study sessions, and exams in one place</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Main Calendar */}
        <div className="card" style={{ padding: 28 }}>
          <MiniCalendar />

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { color: '#ef4444', label: 'Deadline' },
              { color: '#3b82f6', label: 'Exam' },
              { color: '#22c55e', label: 'Study Session' },
              { color: '#f59e0b', label: 'Assignment' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming events */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>⏰ Upcoming Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.map(d => (
                <div key={d.id} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px',
                  borderRadius: 10, background: 'var(--bg-card2)', border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: d.daysLeft <= 2 ? '#ef444418' : '#3b82f618',
                    border: `1px solid ${d.daysLeft <= 2 ? '#ef444440' : '#3b82f640'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: d.daysLeft <= 2 ? '#ef4444' : '#3b82f6', lineHeight: 1 }}>{d.daysLeft}</div>
                    <div style={{ fontSize: 7, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>days</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.subject} · {new Date(d.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
                  </div>
                  <span className={`badge badge-${d.priority}`}>{d.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's schedule */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📌 Today's Schedule</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { time: '09:00', event: 'OS Lecture', type: 'lecture', color: '#3b82f6' },
                { time: '11:00', event: 'ML Lab', type: 'lab', color: '#8b5cf6' },
                { time: '14:00', event: 'DBMS Study Session', type: 'study', color: '#22c55e' },
                { time: '16:00', event: 'CN Assignment', type: 'assignment', color: '#f59e0b' },
                { time: '20:00', event: 'Revision: OS Chapter 3', type: 'study', color: '#22c55e' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px',
                  borderRadius: 10, background: 'var(--bg-card2)', border: `1px solid ${item.color}30`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', width: 40, flexShrink: 0 }}>{item.time}</div>
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
