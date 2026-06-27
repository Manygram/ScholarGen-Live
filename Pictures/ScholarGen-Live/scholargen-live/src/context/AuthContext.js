// Authentication / session state for ScholarGen Live.
//
// Holds the signed-in user, bootstraps the session from the cookie on launch
// (GET /users/me), and exposes login / register / logout. It also mirrors the
// authenticated user's name & email into the AppContext profiles so the
// existing dashboards/profile screens display real data without each screen
// needing to know about the network layer.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../services/api';
import { useApp } from './AppContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { updateStudentProfile, updateTutorProfile } = useApp();

  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Push the authenticated identity into the role-appropriate local profile.
  const syncProfile = useCallback(
    (u, profile) => {
      if (!u) return;
      const patch = {
        name: u.full_name || profile?.full_name || profile?.name,
        email: u.email || profile?.email,
      };
      if (u.role === 'tutor') updateTutorProfile(patch);
      else updateStudentProfile(patch);
    },
    [updateStudentProfile, updateTutorProfile],
  );

  // Load the current session user (if the cookie is valid).
  const refresh = useCallback(async () => {
    try {
      const data = await api.users.me();
      setUser(data?.user || null);
      syncProfile(data?.user, data?.profile);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, [syncProfile]);

  useEffect(() => {
    let active = true;
    (async () => {
      await refresh();
      if (active) setBootstrapping(false);
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const login = useCallback(
    async (email, password) => {
      const loggedIn = await api.auth.login({ email, password });
      setUser(loggedIn || null);
      // Pull the full profile (role-specific) now that the cookie is set.
      const me = await refresh();
      return me?.user || loggedIn;
    },
    [refresh],
  );

  // Register does not create a session by itself; the caller can log in after.
  const register = useCallback((payload) => api.auth.register(payload), []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      isAuthenticated: !!user,
      role: user?.role || null,
      login,
      register,
      logout,
      refresh,
    }),
    [user, bootstrapping, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
