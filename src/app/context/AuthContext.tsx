import {
  createContext, useContext, useEffect,
  useMemo, useState, type ReactNode,
} from "react";
import { apiRequest, setToken, clearToken, getToken } from "../../api/client";

export type Role = "user" | "moderator" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  role: Role;
  balance: number;
  totalSpent: number;
  ordersCount: number;
  level: number;
  xp: number;
  xpToNext: number;
  verified: boolean;
  isBanned: boolean;
  notifyOrders: boolean;
  notifyPromo: boolean;
  notifySecurity: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (identifier: string, password: string) =>
    Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  signUp: (payload: { username: string; email: string; password: string }) =>
    Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    const res = await apiRequest<AuthUser>("/api/auth/me");

    if (res.ok && res.data) {
      setUser(res.data);
      return;
    }

    clearToken();
    setUser(null);
  }

  function updateUser(nextUser: AuthUser) {
    setUser(nextUser);
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    refreshUser().finally(() => {
      setIsLoading(false);
    });
  }, []);

  async function signIn(identifier: string, password: string) {
    const res = await apiRequest<{ token: string; user: AuthUser }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ identifier, password }) }
    );

    if (!res.ok || !res.data)
      return { ok: false as const, error: res.error ?? "Ошибка входа" };

    setToken(res.data.token);
    setUser(res.data.user);
    return { ok: true as const, user: res.data.user };
  }

  async function signUp(payload: {
    username: string; email: string; password: string;
  }) {
    const res = await apiRequest<{ token: string; user: AuthUser }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    );

    if (!res.ok || !res.data)
      return { ok: false as const, error: res.error ?? "Ошибка регистрации" };

    setToken(res.data.token);
    setUser(res.data.user);
    return { ok: true as const, user: res.data.user };
  }

  async function signOut() {
    await apiRequest("/api/auth/logout", { method: "POST" });
    clearToken();
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUser,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
