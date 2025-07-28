import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials } from '@/types';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setAuthState({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            localStorage.removeItem('token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.log('Backend not available, using demo mode');
          // For demo purposes when backend is not available
          if (token === 'demo-token') {
            setAuthState({
              user: { id: '1', name: 'Demo User', email: 'demo@carwash.com', role: 'owner', createdAt: new Date() },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            localStorage.removeItem('token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Demo mode for when backend is not available
      if (credentials.email === 'demo@carwash.com' && credentials.password === 'demo123') {
        localStorage.setItem('token', 'demo-token');
        
        setAuthState({
          user: { id: '1', name: 'Demo User', email: 'demo@carwash.com', role: 'owner', createdAt: new Date() },
          isAuthenticated: true,
          isLoading: false,
        });

        toast({
          title: "Login Successful",
          description: "Welcome to WashWizard Manager (Demo Mode)!",
        });
        
        return true;
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const register = async (registerData: { name: string; email: string; password: string; role?: string }): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        toast({
          title: "Registration Successful",
          description: `Welcome to WashWizard, ${data.user.name}!`,
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Registration failed. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server call fails
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};