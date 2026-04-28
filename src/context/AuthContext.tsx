import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDemoCredentials, timingSafeEqualString } from "../lib/demoCredentials";

const SESSION_KEY = "pymeapp-demo-session-v1";

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSession(ok: boolean) {
  try {
    if (ok) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode */
  }
}

type AuthContextValue = {
  authed: boolean;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  demoConfigured: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(readSession);

  const login = useCallback((username: string, password: string) => {
    const cred = getDemoCredentials();
    if (!cred.configured) {
      return {
        ok: false as const,
        error:
          "Credenciales de demo no configuradas. En Vercel, añada VITE_DEMO_USERNAME y VITE_DEMO_PASSWORD (solo para esta pantalla; no use claves reales de otros servicios).",
      };
    }
    const uOk = timingSafeEqualString(username.trim(), cred.username);
    const pOk = timingSafeEqualString(password, cred.password);
    if (!uOk || !pOk) {
      return { ok: false as const, error: "Usuario o contraseña incorrectos." };
    }
    writeSession(true);
    setAuthed(true);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    writeSession(false);
    setAuthed(false);
  }, []);

  const demoConfigured = getDemoCredentials().configured;

  const value = useMemo<AuthContextValue>(
    () => ({ authed, login, logout, demoConfigured }),
    [authed, login, logout, demoConfigured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth dentro de AuthProvider");
  return ctx;
}
