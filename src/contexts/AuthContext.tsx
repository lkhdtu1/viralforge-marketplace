import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'creator' | 'brand' | 'admin';
  displayName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, mfaToken?: string) => Promise<{ requiresMFA: boolean }>;
  signup: (email: string, password: string, role: 'creator' | 'brand', displayName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authApi.getCurrentUser()
        .then(userData => {
          // Normalize role to lowercase for frontend consistency
          setUser({
            ...userData,
            role: userData.role.toLowerCase() as 'creator' | 'brand' | 'admin',
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, mfaToken?: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        mfaToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Login failed');
    }

    if (data.data.requiresMFA) {
      return { requiresMFA: true };
    }

    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
    
    // Normalize role to lowercase for frontend consistency
    setUser({
      ...data.data.user,
      role: data.data.user.role.toLowerCase() as 'creator' | 'brand' | 'admin',
    });

    return { requiresMFA: false };
  };

  const signup = async (email: string, password: string, role: 'creator' | 'brand', displayName?: string) => {
    await authApi.signup({ 
      email, 
      password, 
      role: role.toUpperCase() as 'CREATOR' | 'BRAND', 
      displayName 
    });
    // Don't set user - they need to login after signup
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser({
        ...userData,
        role: userData.role.toLowerCase() as 'creator' | 'brand' | 'admin',
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
