import { createContext, useContext, useState, type ReactNode } from "react";

const CREDENTIALS = { username: "SUEBEE1230", password: "Paultherider123" };
const STORAGE_KEY = "kcfcu.session";

export interface SessionUser {
  username: string;
  fullName: string;
  loginAt: string;
}

interface AuthCtx {
  user: SessionUser | null;
  login: (u: string, p: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  });
  const login = (u: string, p: string) => {
    if (u.trim() !== CREDENTIALS.username || p !== CREDENTIALS.password) {
      return { ok: false as const, error: "Invalid username or password." };
    }
    const s: SessionUser = { username: u.trim(), fullName: "Paul Lynch", loginAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setUser(s);
    return { ok: true as const };
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
