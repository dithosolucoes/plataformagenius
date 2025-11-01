
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';

// This is a mock API service. In a real app, this would be in services/apiService.ts
// and would make actual HTTP requests.
const mockApiService = {
  login: async (email: string, pass: string) => {
    if (email === "user@example.com" && pass === "password") {
      const user = { id: 1, name: "Demo User", email: "user@example.com" };
      const token = "fake-jwt-token";
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error("Invalid credentials");
  },
  register: async (name: string, email: string, pass: string) => {
    console.log("Registering:", { name, email, pass });
    const user = { id: Date.now(), name, email };
    const token = "fake-jwt-token-new-user";
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const { user } = await mockApiService.login(email, pass);
    setUser(user);
  }, []);
  
  const register = useCallback(async (name: string, email: string, pass: string) => {
    const { user } = await mockApiService.register(name, email, pass);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    mockApiService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
