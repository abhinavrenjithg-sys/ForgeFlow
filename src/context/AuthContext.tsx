import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Workspace } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => void;
  setActiveWorkspace: (ws: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWorkspaces = useCallback(async () => {
    try {
      const wsList = await api.workspaces.list();
      setWorkspaces(wsList);
      if (wsList.length > 0) {
        const savedSlug = localStorage.getItem('forgeflow_active_workspace');
        const found = wsList.find((w) => w.slug === savedSlug);
        const current = found || wsList[0];
        setActiveWorkspaceState(current);
        localStorage.setItem('forgeflow_active_workspace', current.slug);
      } else {
        setActiveWorkspaceState(null);
      }
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    }
  }, []);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('forgeflow_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const currentUser = await api.auth.me();
      setUser(currentUser);
      await refreshWorkspaces();
    } catch {
      localStorage.removeItem('forgeflow_token');
      setUser(null);
      setWorkspaces([]);
      setActiveWorkspaceState(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshWorkspaces]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('forgeflow_token', res.access_token);
      setUser(res.user);
      await refreshWorkspaces();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, fullName: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register({ email, full_name: fullName, password });
      localStorage.setItem('forgeflow_token', res.access_token);
      setUser(res.user);
      await refreshWorkspaces();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('forgeflow_token');
    localStorage.removeItem('forgeflow_active_workspace');
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspaceState(null);
  };

  const setActiveWorkspace = (ws: Workspace) => {
    setActiveWorkspaceState(ws);
    localStorage.setItem('forgeflow_active_workspace', ws.slug);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        activeWorkspace,
        isLoading,
        login,
        register,
        logout,
        setActiveWorkspace,
        refreshWorkspaces,
      }}
    >
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
