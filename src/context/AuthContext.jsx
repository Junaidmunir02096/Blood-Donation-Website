import { createContext, useState, useEffect, useCallback } from 'react';
import { omitKey } from '../utils/object';
import { useAppData } from '../hooks/useAppData';

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
const ADMIN_EMAIL = 'admin@lifestream.com';

const AuthContext = createContext(null);

/* ── Helper — simulate an API delay ────────────────────────── */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* ── AuthProvider ─────────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const { users, addUser, updateUser, getUserByEmail } = useAppData();
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
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      /* Storage may be unavailable in privacy mode; keep the in-memory session. */
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

    const normalizedEmail = email.trim().toLowerCase();

    /* Check for duplicate email */
    const duplicate = getUserByEmail(normalizedEmail);
    if (duplicate) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    /* Determine role — admin gets admin, everyone else is donor */
    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'donor';

    const newUser = addUser({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,            // stored in plain text (portfolio demo — swap with bcrypt on backend)
      bloodGroup: bloodGroup || null,
      role,
      phone:   phone   || null,
      city:    city    || null,
    });

    /* Strip password before storing in session */
    const sessionUser = omitKey(newUser, 'password');
    try {
      localStorage.setItem(TOKEN_KEY, `mock-jwt-${newUser.id}`);
    } catch {
      /* Keep the in-memory session when storage is unavailable. */
    }
    setCurrentUser(sessionUser);
    return { ok: true };
  }, [addUser, getUserByEmail]);

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

    const normalizedEmail = email.trim().toLowerCase();
    const found = getUserByEmail(normalizedEmail);

    if (!found) {
      return { ok: false, error: 'No account found with this email. Please register.' };
    }

    if (found.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    if (found.status === 'inactive') {
      return { ok: false, error: 'This account is inactive. Please contact support.' };
    }

    /* Strip password before storing in session */
    const sessionUser = omitKey(found, 'password');

    /* Always enforce admin role for admin email */
    if (normalizedEmail === ADMIN_EMAIL) {
      sessionUser.role = 'admin';
    }

    try {
      localStorage.setItem(TOKEN_KEY, `mock-jwt-${found.id}`);
    } catch {
      /* Keep the in-memory session when storage is unavailable. */
    }
    setCurrentUser(sessionUser);
    return { ok: true };
  }, [getUserByEmail]);

  /* ── logout ────────────────────────────────────────────────
     Clears session. Pair with navigate('/') in the caller.
     ── When backend is ready, also call:
        await apiClient.post('/api/auth/logout');
     ────────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    await delay(400);
    if (!currentUser?.id) return { ok: false, error: 'You must be signed in.' };
    const account = users.find((user) => user.id === currentUser.id);
    if (!account) return { ok: false, error: 'Account not found.' };
    if (account.password !== currentPassword) {
      return { ok: false, error: 'Current password is incorrect.' };
    }
    if (!newPassword || newPassword.length < 8) {
      return { ok: false, error: 'New password must be at least 8 characters.' };
    }
    updateUser(account.id, { password: newPassword });
    return { ok: true };
  }, [currentUser, updateUser, users]);

  const resetPassword = useCallback(async ({ email, newPassword }) => {
    await delay(600);
    const account = getUserByEmail(email);
    if (!account) return { ok: false, error: 'No demo account was found for this email.' };
    if (!newPassword || newPassword.length < 8) {
      return { ok: false, error: 'New password must be at least 8 characters.' };
    }
    updateUser(account.id, { password: newPassword });
    return { ok: true };
  }, [getUserByEmail, updateUser]);

  /* ── updateCurrentUser — refreshes session after profile edit */
  const updateCurrentUser = useCallback((updates) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });

    const userId = updates.id || currentUser?.id;
    if (userId) updateUser(userId, omitKey(updates, 'id'));
  }, [currentUser, updateUser]);

  const value = {
    isLoggedIn,
    currentUser,
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
