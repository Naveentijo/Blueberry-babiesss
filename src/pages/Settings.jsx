import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/mockData';

export default function Settings() {
  const { darkMode, setDarkMode } = useApp();
  const [notifs, setNotifs] = useState({ whatsapp: true, calendar: true, deadlines: true, attendance: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Customize your CampusFlow experience</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Profile */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>👤 Profile</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'var(--grad-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: 'white',
            }}>
              {currentUser.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{currentUser.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{currentUser.email}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentUser.branch} · {currentUser.semester}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['Full Name', currentUser.name], ['Roll Number', currentUser.rollNo], ['Branch', currentUser.branch]].map(([l, v]) => (
              <div className="form-group" key={l} style={{ marginBottom: 0 }}>
                <label className="label">{l}</label>
                <input className="input" defaultValue={v} />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>🎨 Appearance</div>
            {[
              {
                label: 'Dark Mode',
                desc: 'Use dark color scheme',
                value: darkMode,
                onChange: () => setDarkMode(v => !v),
              },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <button className={`toggle ${item.value ? 'on' : ''}`} onClick={item.onChange} />
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>🔔 Notifications</div>
            {[
              { key: 'whatsapp', label: 'WhatsApp Reminders', desc: 'Deadline & attendance alerts' },
              { key: 'calendar', label: 'Calendar Sync', desc: 'Auto-create Google Calendar events' },
              { key: 'deadlines', label: 'Deadline Alerts', desc: 'Notify 24h and 1h before deadlines' },
              { key: 'attendance', label: 'Attendance Alerts', desc: 'Warn when attendance drops below threshold' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <button
                  className={`toggle ${notifs[item.key] ? 'on' : ''}`}
                  onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>🔗 Integrations</div>
          {[
            { name: 'Google Calendar', icon: '📅', status: 'Connected', color: '#22c55e' },
            { name: 'WhatsApp Business', icon: '💬', status: 'Connected', color: '#22c55e' },
            { name: 'Google Drive', icon: '📁', status: 'Not Connected', color: 'var(--text-muted)' },
          ].map(item => (
            <div key={item.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.status}</div>
              </div>
              <button className={`btn btn-sm ${item.status === 'Connected' ? 'btn-secondary' : 'btn-primary'}`}>
                {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Academic Settings */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📚 Academic Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Default Required Attendance %</label>
              <select className="input">
                {[60, 65, 70, 75, 80].map(v => <option key={v} value={v}>{v}%</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Daily Study Goal (hours)</label>
              <input className="input" type="number" defaultValue={5} min={1} max={12} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">WhatsApp Phone Number</label>
              <input className="input" placeholder="+91 9876543210" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Timezone</label>
              <select className="input">
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary">Reset to Defaults</button>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✅ Saved!' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
}
