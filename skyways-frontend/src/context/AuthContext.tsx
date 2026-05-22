import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem('skyways_user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!user;

  const login = useCallback(async (data: LoginRequest) => {
    const auth = await authApi.login(data);
    localStorage.setItem('skyways_token', auth.accessToken);
    localStorage.setItem('skyways_user', JSON.stringify(auth));
    setUser(auth);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const auth = await authApi.register(data);
    localStorage.setItem('skyways_token', auth.accessToken);
    localStorage.setItem('skyways_user', JSON.stringify(auth));
    setUser(auth);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('skyways_token');
    localStorage.removeItem('skyways_user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, register, logout }),
    [isAuthenticated, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
