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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'creator' | 'brand', displayName?: string) => Promise<void>;
  logout: () => void;
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

  const login = async (email: string, password: string) => {
    const { user: userData, accessToken, refreshToken } = await authApi.login(email, password);
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    // Normalize role to lowercase for frontend consistency
    setUser({
      ...userData,
      role: userData.role.toLowerCase() as 'creator' | 'brand' | 'admin',
    });
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
