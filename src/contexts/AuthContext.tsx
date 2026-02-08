import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Role } from '@/types/coffea';
import { users as mockUsers } from '@/data/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: Role) => boolean;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('coffea_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return mockUsers.find(u => u.id === parsed.id) || null;
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('coffea_user', JSON.stringify({ id: found.id }));
      return true;
    }
    return false;
  }, [allUsers]);

  const register = useCallback((name: string, email: string, password: string, role: Role) => {
    if (allUsers.find(u => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, email, name, password, role };
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('coffea_user', JSON.stringify({ id: newUser.id }));
    return true;
  }, [allUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('coffea_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
