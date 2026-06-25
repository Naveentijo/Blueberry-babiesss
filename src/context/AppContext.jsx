import React, { createContext, useContext, useState, useCallback } from 'react';
import { deadlines as initialDeadlines, attendanceData as initialAttendance, notifications as initialNotifications } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ id: Date.now(), ...notif, time: 'Just now', read: false }, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addDeadline = useCallback((deadline) => {
    setDeadlines(prev => [{ id: Date.now(), ...deadline }, ...prev]);
    addNotification({ type: 'success', title: 'Deadline Added Successfully', message: `${deadline.title} added for ${deadline.deadline}` });
  }, [addNotification]);

  const deleteDeadline = useCallback((id) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
  }, []);

  const updateDeadlineCompletion = useCallback((id, percent) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, completionPercent: percent } : d));
  }, []);

  return (
    <AppContext.Provider value={{
      activeView, setActiveView,
      darkMode, setDarkMode,
      sidebarOpen, setSidebarOpen,
      deadlines, setDeadlines, addDeadline, deleteDeadline, updateDeadlineCompletion,
      attendance, setAttendance,
      notifications, addNotification, markAllRead, unreadCount,
      showNotifications, setShowNotifications,
      showAIPanel, setShowAIPanel,
      selectedDeadline, setSelectedDeadline,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
