// Authentication / session state for ScholarGen Live.
//
// Holds the signed-in user and keeps it resilient:
//  • On launch it restores the last user from storage (so the session survives
//    reloads) and then revalidates against /users/me in the background.
//  • login() trusts the /auth/login response and only *enriches* it with
//    /users/me — a blocked or failed /users/me never wipes a valid login.
//    (The API sets a SameSite=Lax cookie, which some cross-site web contexts
//    won't replay on XHR; persisting the user keeps the app usable there.)
//  • It mirrors the authenticated identity into the AppContext profiles so the
//    dashboards/profile screens show real data.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../services/api';
import { getItem, removeItem, setItem } from '../services/storage';
import { useApp } from './AppContext';

const AuthContext = createContext(null);
const STORAGE_KEY = 'sg_auth_user';

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

  // Persist + set the user in one step.
  const applyUser = useCallback((u) => {
    setUser(u || null);
    if (u) setItem(STORAGE_KEY, u);
    else removeItem(STORAGE_KEY);
  }, []);

  // Restore the cached user, then revalidate in the background.
  useEffect(() => {
    let active = true;
    (async () => {
      const cached = await getItem(STORAGE_KEY);
      if (active && cached) {
        setUser(cached);
        syncProfile(cached);
      }
      try {
        const data = await api.users.me();
        if (active && data?.user) {
          applyUser(data.user);
          syncProfile(data.user, data.profile);
        }
      } catch {
        // Keep the cached user if the session check is blocked/offline.
      }
      if (active) setBootstrapping(false);
    })();
    return () => {
      active = false;
    };
  }, [applyUser, syncProfile]);

  const login = useCallback(
    async (email, password) => {
      // /auth/login returns the user and sets the session cookie.
      const loggedIn = await api.auth.login({ email, password });
      let finalUser = loggedIn;
      // Best-effort enrichment with the full profile; never wipes the login.
      try {
        const me = await api.users.me();
        if (me?.user) {
          finalUser = me.user;
          syncProfile(me.user, me.profile);
        } else {
          syncProfile(loggedIn);
        }
      } catch {
        syncProfile(loggedIn);
      }
      applyUser(finalUser);
      return finalUser;
    },
    [applyUser, syncProfile],
  );

  // Register does not create a session by itself; the caller logs in after.
  const register = useCallback((payload) => api.auth.register(payload), []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      applyUser(null);
    }
  }, [applyUser]);

  const refresh = useCallback(async () => {
    try {
      const data = await api.users.me();
      if (data?.user) {
        applyUser(data.user);
        syncProfile(data.user, data.profile);
      }
      return data;
    } catch {
      return null;
    }
  }, [applyUser, syncProfile]);

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
