import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";

const STORAGE_KEY = "saas_admin_user";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function createSession(email) {
  const createdAt = Date.now();
  return {
    name: "Alex Morgan",
    email,
    role: "admin",
    token: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    createdAt,
    expiresAt: createdAt + SESSION_TTL_MS
  };
}

function getStoredUser() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : null;

    if (!parsed?.token || !parsed?.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      throw new Error("Введите email и пароль");
    }

    const nextUser = createSession(normalizedEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!user?.expiresAt) {
      return undefined;
    }

    const msToExpire = user.expiresAt - Date.now();

    if (msToExpire <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, msToExpire);

    return () => clearTimeout(timeoutId);
  }, [logout, user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      login,
      logout
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
