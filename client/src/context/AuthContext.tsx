import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainee' | 'trainer' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  quickLogin: (role: 'trainee' | 'trainer' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const existingToken = getAuthToken();
      if (existingToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Invalid token on launch, logging out:', err);
          removeAuthToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    setAuthToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  };

  const quickLogin = async (role: 'trainee' | 'trainer' | 'admin') => {
    let email = 'rahul@capacityconnect.in';
    if (role === 'trainer') email = 'ananya@capacityconnect.in';
    else if (role === 'admin') email = 'admin@capacityconnect.in';

    await login({ email, password: 'password123' });
  };

  const logout = () => {
    removeAuthToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
