import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────
   AuthContext
   ─────────────────────────────────────────────────────────────
   Provides global auth state to the whole app.

   Shape:
     isLoggedIn   boolean
     currentUser  { id, fullName, email, bloodGroup, role } | null
     login(email, password)  → Promise<{ ok, error }>
     register(data)          → Promise<{ ok, error }>
     logout()                → void
   ────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'ls_user';         // localStorage key for session persistence
const TOKEN_KEY   = 'ls_token';        // will hold JWT once backend is live

const AuthContext = createContext(null);

/* ── Helper — simulate an API delay ────────────────────────── */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* ── AuthProvider ─────────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    /* Rehydrate from localStorage so refresh doesn't log user out */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = Boolean(currentUser);

  /* Persist user to localStorage whenever it changes */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [currentUser]);

  /* ── register ─────────────────────────────────────────────
     Simulates POST /api/auth/register
     ── When backend is ready, replace the body with:
        const res = await apiClient.post('/api/auth/register', data);
        if (!res.ok) return { ok: false, error: res.data.message };
        ...
     ────────────────────────────────────────────────────────── */
  const register = useCallback(async ({ fullName, email, password, bloodGroup }) => {
    await delay(900); // simulate network latency

    /* Basic duplicate-email guard (frontend only — backend will enforce) */
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const user = JSON.parse(existing);
      if (user.email === email) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      bloodGroup: bloodGroup || null,
      role: 'donor',
      createdAt: new Date().toISOString(),
    };

    /* Simulate a JWT token (backend will generate a real one) */
    localStorage.setItem(TOKEN_KEY, `mock-jwt-token-${newUser.id}`);
    setCurrentUser(newUser);
    return { ok: true };
  }, []);

  /* ── login ────────────────────────────────────────────────
     Simulates POST /api/auth/login
     ── When backend is ready, replace the body with:
        const res = await apiClient.post('/api/auth/login', { email, password });
        if (!res.ok) return { ok: false, error: 'Invalid credentials.' };
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setCurrentUser(res.data.user);
        return { ok: true };
     ────────────────────────────────────────────────────────── */
  const login = useCallback(async ({ email, password }) => {
    await delay(800); // simulate network latency

    if (!email || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    /* Mock user — backend will validate against DB */
    const mockUser = {
      id: 'usr-demo-001',
      fullName: 'Alex Johnson',
      email,
      bloodGroup: 'O+',
      role: 'donor',
    };

    localStorage.setItem(TOKEN_KEY, `mock-jwt-token-${mockUser.id}`);
    setCurrentUser(mockUser);
    return { ok: true };
  }, []);

  /* ── logout ───────────────────────────────────────────────
     Clears session. Pair with navigate('/') in the caller.
     ── When backend is ready, also call:
        await apiClient.post('/api/auth/logout');
     ────────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = { isLoggedIn, currentUser, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ── useAuth hook ─────────────────────────────────────────── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
