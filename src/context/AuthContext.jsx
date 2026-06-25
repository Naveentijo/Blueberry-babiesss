import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'cf_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const isAuthenticated = !!user;
  const hasOnboarded = !!user?.onboarded;

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 1200));
    const existingUser = loadUser();
    // If logging back in with same email, restore their profile
    const restoredUser = existingUser?.email === email
      ? existingUser
      : { email, name: email.split('@')[0], avatar: email[0].toUpperCase(), onboarded: true };
    setUser(restoredUser);
    return { success: true };
  };

  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 1400));
    const newUser = { email, name, avatar: name[0].toUpperCase(), onboarded: false };
    setUser(newUser);
    return { success: true };
  };

  /**
   * Called when onboarding completes.
   * Merges ALL onboarding fields (name, branch, phone, semester, university, rollNo, subjects)
   * into the user object and persists to localStorage.
   */
  const completeOnboarding = (data) => {
    setUser(prev => {
      const updated = {
        ...prev,
        // Use the fullName from onboarding if provided, fallback to existing
        name: data.fullName || prev?.name,
        avatar: (data.fullName || prev?.name || 'U')[0].toUpperCase(),
        // Academic details
        university: data.university || null,
        branch: data.branch || null,
        year: data.year || null,
        semester: data.semester ? `${data.semester}th Semester` : null,
        rollNo: data.rollNo || null,
        subjects: data.subjects || [],
        // Contact details
        phone: data.phone ? `${data.countryCode || '+91'}${data.phone}` : null,
        whatsapp: data.whatsapp || null,
        contactEmail: data.contactEmail || prev?.email,
        onboarded: true,
      };
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, hasOnboarded, user,
      login, register, completeOnboarding, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
