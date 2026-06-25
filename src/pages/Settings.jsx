import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon, User, Palette, Bell, Link2, BookOpen,
  CheckCircle2, Save, Calendar, MessageSquare, Folder, LogOut
} from 'lucide-react';

export default function Settings() {
  const { darkMode, setDarkMode } = useApp();
  const { user, logout } = useAuth();
  const [notifs, setNotifs] = useState({ whatsapp: true, calendar: true, deadlines: true, attendance: true });
  const [saved, setSaved] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student';
  const displayEmail = user?.email || '—';
  const displayBranch = user?.branch || '—';
  const displaySemester = user?.semester || '—';
  const displayRollNo = user?.rollNo || '—';
  const displayPhone = user?.phone || '';
  const avatarInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SettingsIcon size={28} style={{ color: 'var(--brand-blue)' }} />
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your CampusFlow experience</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Profile */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={15} style={{ color: 'var(--brand-blue)' }} /> Profile
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'var(--grad-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: 'white',
            }}>
              {avatarInitials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{displayName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{displayEmail}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {displayBranch !== '—' && displaySemester !== '—'
                  ? `${displayBranch} · ${displaySemester}`
                  : displayBranch !== '—' ? displayBranch
                  : displaySemester !== '—' ? displaySemester
                  : 'CampusFlow Student'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Full Name',    displayName],
              ['Roll Number',  displayRollNo],
              ['Branch',       displayBranch],
              ['Semester',     displaySemester],
              ['University',   user?.university || '—'],
            ].map(([l, v]) => (
              <div className="form-group" key={l} style={{ marginBottom: 0 }}>
                <label className="label">{l}</label>
                <input className="input" defaultValue={v === '—' ? '' : v} placeholder={l} />
              </div>
            ))}
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{ marginTop: 20, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {/* Appearance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Palette size={15} style={{ color: 'var(--brand-pink)' }} /> Appearance
            </div>
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
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bell size={15} style={{ color: 'var(--brand-purple)' }} /> Notifications
            </div>
            {[
              { key: 'whatsapp',   label: 'WhatsApp Reminders',  desc: 'Deadline & attendance alerts' },
              { key: 'calendar',   label: 'Calendar Sync',        desc: 'Auto-create Google Calendar events' },
              { key: 'deadlines',  label: 'Deadline Alerts',      desc: 'Notify 24h and 1h before deadlines' },
              { key: 'attendance', label: 'Attendance Alerts',    desc: 'Warn when attendance drops below threshold' },
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
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link2 size={15} style={{ color: 'var(--brand-blue)' }} /> Integrations
          </div>
          {[
            { name: 'Google Calendar',    icon: Calendar,       status: 'Connected',     color: '#22c55e' },
            { name: 'WhatsApp Business',  icon: MessageSquare,  status: 'Connected',     color: '#22c55e' },
            { name: 'Google Drive',       icon: Folder,         status: 'Not Connected', color: 'var(--text-muted)' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <Icon size={22} style={{ color: 'var(--text-secondary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.status}</div>
                </div>
                <button className={`btn btn-sm ${item.status === 'Connected' ? 'btn-secondary' : 'btn-primary'}`}>
                  {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Academic Settings */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={15} style={{ color: 'var(--brand-purple)' }} /> Academic Settings
          </div>
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
              <input className="input" defaultValue={displayPhone} placeholder="+91 9876543210" />
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
        <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
