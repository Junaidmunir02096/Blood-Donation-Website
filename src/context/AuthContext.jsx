import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi, ApiError } from '../api/client';

/* ──────────────────────────────────────────────────────────────
   AuthContext
   ─────────────────────────────────────────────────────────────
   Provides global auth state to the whole app.

   Shape:
     isLoggedIn   boolean
     currentUser  { id, fullName, email, bloodGroup, role, phone, city } | null
     login(email, password)  → Promise<{ ok, error }>
     register(data)          → Promise<{ ok, error }>
     logout()                → void
     changePassword(data)    → Promise<{ ok, error }>
     resetPassword(data)     → Promise<{ ok, error }>
     updateCurrentUser(updates) → void
   ────────────────────────────────────────────────────────────── */

const AuthContext = createContext(null);

/* ── AuthProvider ─────────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = Boolean(currentUser);

  /* ── Check session on mount (rehydrate from server) ──────── */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.session();
        if (response.data.authenticated && response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        // Session check failed - user is not authenticated
        console.debug('No active session:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ── register ────────────────────────────────────────────── */
  const register = useCallback(async ({ fullName, email, password, confirmPassword, bloodGroup, phone, city }) => {
    setError(null);
    try {
      const response = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        bloodGroup: bloodGroup || undefined,
        phone: phone || undefined,
        city: city || undefined,
      });

      setCurrentUser(response.data.user);
      return { ok: true };
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    }
  }, []);

  /* ── login ───────────────────────────────────────────────── */
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setCurrentUser(response.data.user);
      return { ok: true };
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    }
  }, []);

  /* ── logout ──────────────────────────────────────────────── */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
    }
  }, []);

  /* ── changePassword ─────────────────────────────────────── */
  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setError(null);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      return { ok: true };
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to change password.';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    }
  }, []);

  /* ── resetPassword ──────────────────────────────────────── */
  const resetPassword = useCallback(async ({ email, newPassword }) => {
    setError(null);
    try {
      await authApi.resetPassword({ email: email.trim().toLowerCase(), newPassword });
      return { ok: true };
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to reset password.';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    }
  }, []);

  /* ── updateCurrentUser — refreshes session after profile edit */
  const updateCurrentUser = useCallback((updates) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const value = {
    isLoggedIn,
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    updateCurrentUser,
    changePassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;