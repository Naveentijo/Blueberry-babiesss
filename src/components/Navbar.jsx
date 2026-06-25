import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Brain, Sun, Moon, Bell,
  CheckCircle, Calendar, MessageSquare, AlertTriangle, Sparkles,
  LogOut, User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/mockData';

const NOTIF_ICONS = {
  success:  CheckCircle,
  calendar: Calendar,
  whatsapp: MessageSquare,
  warning:  AlertTriangle,
  ai:       Sparkles,
};

export default function Navbar() {
  const {
    darkMode, setDarkMode,
    sidebarOpen, setSidebarOpen,
    notifications, unreadCount,
    showNotifications, setShowNotifications,
    showAIPanel, setShowAIPanel,
    markAllRead,
  } = useApp();
  const [search, setSearch] = useState('');
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <header className="navbar">
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
          <div className="search-bar">
            <Search size={15} style={{ opacity: 0.45, flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search deadlines, subjects..."
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
              Ctrl K
            </span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* AI Toggle */}
          <button className="nav-btn" onClick={() => setShowAIPanel(v => !v)} title="AI Assistant">
            <Brain size={17} style={{ color: showAIPanel ? 'var(--blue-500)' : 'currentColor' }} />
          </button>

          {/* Theme */}
          <button className="nav-btn" onClick={() => setDarkMode(v => !v)} title="Toggle Theme">
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <button className="nav-btn" onClick={() => setShowNotifications(v => !v)} title="Notifications">
            <Bell size={17} />
            {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
          </button>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginLeft: 4 }}>
            <div className="avatar" title={currentUser.name}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{currentUser.branch}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="notif-panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Notifications</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{unreadCount} unread</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-xs" onClick={markAllRead}>Mark all read</button>
                <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setShowNotifications(false)}>
                  ✕
                </button>
              </div>
            </div>
            <div>
              {notifications.map(n => {
                const NIcon = NOTIF_ICONS[n.type] || Bell;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      background: !n.read ? 'rgba(79,124,255,0.04)' : 'transparent',
                      transition: 'background var(--transition)',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--bg-hover)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <NIcon size={16} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue-500)', flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
