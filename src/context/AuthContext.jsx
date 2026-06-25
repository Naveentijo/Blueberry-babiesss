import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Mock auth — always succeeds
    await new Promise(r => setTimeout(r, 1200));
    setUser({ email, name: email.split('@')[0], avatar: email[0].toUpperCase() });
    setIsAuthenticated(true);
    setHasOnboarded(true); // existing users skip onboarding
    return { success: true };
  };

  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 1400));
    setUser({ email, name, avatar: name[0].toUpperCase() });
    setIsAuthenticated(true);
    setHasOnboarded(false); // new users go through onboarding
    return { success: true };
  };

  const completeOnboarding = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    setHasOnboarded(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasOnboarded(false);
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
