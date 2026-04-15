import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "user" | "moderator" | "admin";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatar?: string;
  balance: number;
  totalSpent: number;
  ordersCount: number;
  joinedAt: string;
  level: number;
  xp: number;
  xpToNext: number;
  verified: boolean;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (identifier: string, password: string) => { ok: true; user: AuthUser } | { ok: false; error: string };
  signUp: (payload: { username: string; email: string; password: string }) => { ok: true; user: AuthUser } | { ok: false; error: string };
  signOut: () => void;
}

const SESSION_KEY = "egorkacoins-auth-session";
const REGISTERED_KEY = "egorkacoins-auth-registered";

const seedAccounts: StoredAccount[] = [
  {
    id: "usr_8271",
    username: "Egorka_Pro",
    email: "egorka@gmail.com",
    password: "user123",
    role: "user",
    balance: 124.5,
    totalSpent: 342.87,
    ordersCount: 14,
    joinedAt: "Март 2024",
    level: 7,
    xp: 3400,
    xpToNext: 5000,
    verified: true,
  },
  {
    id: "usr_5512",
    username: "Dragon_777",
    email: "dragon@mail.ru",
    password: "mod123",
    role: "moderator",
    balance: 480.75,
    totalSpent: 1180.34,
    ordersCount: 28,
    joinedAt: "Ноябрь 2023",
    level: 14,
    xp: 8200,
    xpToNext: 10000,
    verified: true,
  },
  {
    id: "usr_0001",
    username: "AdminRoot",
    email: "admin@egorkacoins.ru",
    password: "admin123",
    role: "admin",
    balance: 9999.99,
    totalSpent: 0,
    ordersCount: 0,
    joinedAt: "Январь 2023",
    level: 99,
    xp: 99999,
    xpToNext: 100000,
    verified: true,
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAuthUser(account: StoredAccount): AuthUser {
  const { password: _password, ...user } = account;
  return user;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getRegisteredAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  return safeParse<StoredAccount[]>(window.localStorage.getItem(REGISTERED_KEY), []);
}

function setRegisteredAccounts(accounts: StoredAccount[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REGISTERED_KEY, JSON.stringify(accounts));
}

function findAccountByIdentifier(identifier: string): StoredAccount | undefined {
  const normalized = identifier.trim().toLowerCase();
  const accounts = [...seedAccounts, ...getRegisteredAccounts()];
  return accounts.find(
    (acc) =>
      acc.email.trim().toLowerCase() === normalized ||
      acc.username.trim().toLowerCase() === normalized,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = safeParse<AuthUser | null>(
      typeof window !== "undefined" ? window.localStorage.getItem(SESSION_KEY) : null,
      null,
    );
    setUser(storedUser);
  }, []);

  function persistSession(nextUser: AuthUser | null) {
    if (typeof window === "undefined") return;
    if (nextUser) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }

  function signIn(identifier: string, password: string) {
    const account = findAccountByIdentifier(identifier);
    if (!account || account.password !== password) {
      return { ok: false as const, error: "Неверный логин или пароль" };
    }

    const nextUser = toAuthUser(account);
    setUser(nextUser);
    persistSession(nextUser);
    return { ok: true as const, user: nextUser };
  }

  function signUp(payload: { username: string; email: string; password: string }) {
    const username = payload.username.trim();
    const email = payload.email.trim().toLowerCase();

    if (!username || !email || !payload.password) {
      return { ok: false as const, error: "Заполните все поля" };
    }

    const existing = [...seedAccounts, ...getRegisteredAccounts()].find(
      (acc) => acc.email.toLowerCase() === email || acc.username.toLowerCase() === username.toLowerCase(),
    );

    if (existing) {
      return { ok: false as const, error: "Пользователь с таким email или ником уже существует" };
    }

    const created: StoredAccount = {
      id: `usr_${Math.floor(Math.random() * 9000 + 1000)}`,
      username,
      email,
      password: payload.password,
      role: "user",
      balance: 0,
      totalSpent: 0,
      ordersCount: 0,
      joinedAt: "Сегодня",
      level: 1,
      xp: 0,
      xpToNext: 1000,
      verified: false,
    };

    const nextRegistered = [...getRegisteredAccounts(), created];
    setRegisteredAccounts(nextRegistered);

    const nextUser = toAuthUser(created);
    setUser(nextUser);
    persistSession(nextUser);

    return { ok: true as const, user: nextUser };
  }

  function signOut() {
    setUser(null);
    persistSession(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
