import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
   ────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'ls_user';   // localStorage key for session persistence
const TOKEN_KEY   = 'ls_token';  // mock token key
const USERS_KEY   = 'ls_users';  // all registered users array
const ADMIN_EMAIL = 'admin@lifestream.com';

const AuthContext = createContext(null);

/* ── Helper — simulate an API delay ────────────────────────── */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* ── Helpers — read / write users array ────────────────────── */
const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
};

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

  /* Persist logged-in user to localStorage whenever it changes */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [currentUser]);

  /* ── register ──────────────────────────────────────────────
     Saves the new user to the ls_users array in localStorage.
     ── When backend is ready, replace body with:
        const res = await apiClient.post('/api/auth/register', data);
        if (!res.ok) return { ok: false, error: res.data.message };
        setCurrentUser(res.data.user);
     ────────────────────────────────────────────────────────── */
  const register = useCallback(async ({ fullName, email, password, bloodGroup, phone, city }) => {
    await delay(900);

    /* Check for duplicate email */
    const users = readUsers();
    const duplicate = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
    if (duplicate) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    /* Determine role — admin gets admin, everyone else is donor */
    const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'donor';

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      password,            // stored in plain text (portfolio demo — swap with bcrypt on backend)
      bloodGroup: bloodGroup || null,
      role,
      phone:   phone   || null,
      city:    city    || null,
      createdAt: new Date().toISOString(),
    };

    writeUsers([...users, newUser]);

    /* Strip password before storing in session */
    const { password: _pw, ...sessionUser } = newUser;
    localStorage.setItem(TOKEN_KEY, `mock-jwt-${newUser.id}`);
    setCurrentUser(sessionUser);
    return { ok: true };
  }, []);

  /* ── login ─────────────────────────────────────────────────
     Validates email + password against ls_users array.
     ── When backend is ready, replace body with:
        const res = await apiClient.post('/api/auth/login', { email, password });
        if (!res.ok) return { ok: false, error: 'Invalid credentials.' };
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setCurrentUser(res.data.user);
        return { ok: true };
     ────────────────────────────────────────────────────────── */
  const login = useCallback(async ({ email, password }) => {
    await delay(800);

    if (!email || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    const users = readUsers();
    const found = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());

    if (!found) {
      return { ok: false, error: 'No account found with this email. Please register.' };
    }

    if (found.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    /* Strip password before storing in session */
    const { password: _pw, ...sessionUser } = found;

    /* Always enforce admin role for admin email */
    if (email.toLowerCase() === ADMIN_EMAIL) {
      sessionUser.role = 'admin';
    }

    localStorage.setItem(TOKEN_KEY, `mock-jwt-${found.id}`);
    setCurrentUser(sessionUser);
    return { ok: true };
  }, []);

  /* ── logout ────────────────────────────────────────────────
     Clears session. Pair with navigate('/') in the caller.
     ── When backend is ready, also call:
        await apiClient.post('/api/auth/logout');
     ────────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  /* ── updateCurrentUser — refreshes session after profile edit */
  const updateCurrentUser = useCallback((updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });

    /* Also update the stored record in ls_users */
    const users = readUsers();
    const idx   = users.findIndex(u => u.id === updates.id || (currentUser && u.id === currentUser.id));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      writeUsers(users);
    }
  }, [currentUser]);

  const value = { isLoggedIn, currentUser, login, register, logout, updateCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ── useAuth hook ─────────────────────────────────────────── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
