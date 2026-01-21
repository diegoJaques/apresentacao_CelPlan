import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  username: string;
  role: string;
  vendor_id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!authApi.isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await authApi.verify();
      if (response.valid && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshAuth: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
