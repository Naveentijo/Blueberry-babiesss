import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, LayoutDashboard, Clock, BarChart2,
  Calendar, Zap, Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'deadlines',   icon: Clock,           label: 'Deadlines',   badge: 5 },
  { id: 'attendance',  icon: BarChart2,        label: 'Attendance' },
  { id: 'calendar',    icon: Calendar,         label: 'Calendar' },
  { id: 'automations', icon: Zap,              label: 'Automations' },
  { id: 'settings',    icon: Settings,         label: 'Settings' },
];

export default function Sidebar() {
  const { activeView, setActiveView, sidebarOpen } = useApp();
  const { user } = useAuth();
  const [hoveredId, setHoveredId] = useState(null);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar" style={{ width: sidebarOpen ? 260 : 72 }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <GraduationCap size={20} color="white" />
        </div>
        {sidebarOpen && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
              Campus<span className="gradient-text">Flow</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              AI Productivity
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && <div className="nav-section-label">Navigation</div>}

      <nav className="sidebar-nav" onMouseLeave={() => setHoveredId(null)}>
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.id;
          const isHovered = hoveredId === item.id;
          return (
            <motion.button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ position: 'relative' }}
            >
              {isHovered && (
                <motion.div
                  layoutId="hover-pill-sidebar"
                  className="nav-item-hover-bg"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}

              {isActive && (
                <motion.div
                  layoutId="active-pill-sidebar"
                  className="nav-item-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
                <item.icon size={18} />
              </span>
              {sidebarOpen && <span className="sidebar-label" style={{ zIndex: 1 }}>{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  padding: '2px 7px', borderRadius: 99,
                  background: 'var(--grad-primary)', color: 'white',
                  zIndex: 1,
                }}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User card */}
      {sidebarOpen && (
        <div style={{
          margin: '12px 4px 0',
          padding: '14px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 14,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.semester || user?.branch || user?.email || 'CampusFlow'}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 1, background: 'var(--border)' }} />
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Roll No:</span> {user?.rollNo || '—'}
          </div>
        </div>
      )}
    </aside>
  );
}
