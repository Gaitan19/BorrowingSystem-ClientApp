// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import {jwtDecode} from 'jwt-decode';
import api from '../services/api';
import { IUser } from '../interfaces';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      const userData: IUser = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        token: token
      };

      setCookie('token', token, { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 día
      });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      logout();
    }
  };

  const logout = () => {
    deleteCookie('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/auth/login');
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token.toString());
        
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        const userData: IUser = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          token: token.toString()
        };

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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