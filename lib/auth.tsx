"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:8080";
const BASE = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }

    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    []
  );

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const text = await res.text();

      if (!res.ok) {
        let errorMessage = "Update failed";
        try {
          const err = JSON.parse(text);
          errorMessage = err.error || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let updatedUser;
      try {
        updatedUser = JSON.parse(text);
      } catch {
        updatedUser = data;
      }

      if (typeof updatedUser !== "object" || updatedUser === null) {
        updatedUser = data;
      }

      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
    },
    [user]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
