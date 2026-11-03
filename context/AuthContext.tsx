"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to parse saved auth state:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    try {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save auth to localStorage:", e);
    }
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.error("Failed to clear auth from localStorage:", e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
