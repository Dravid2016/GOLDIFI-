/**
 * Goldifi Authentication & Authorization Context
 * Provides centralized user session, permission checks, and Development Role Simulator.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthSession, Branch, DataScope, Organization, Permission, RoleType, User } from '../types';
import { hasPermission as checkPermission, hasAnyPermission as checkAnyPermission, hasAllPermissions as checkAllPermissions } from '../permissions/access';

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  organization: Organization | null;
  branch: Branch | null;
  role: RoleType | null;
  permissions: Permission[];
  dataScope: DataScope | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isShopIdentified: boolean;
  identifiedShopCode: string | null;

  // Actions
  identifyShop: (code: string) => Promise<{ success: boolean; organization?: Organization; error?: string }>;
  login: (phoneOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Development Role Simulator
  isDevSimulatorVisible: boolean;
  setDevSimulatorVisible: (visible: boolean) => void;
  switchSimulatedRole: (role: RoleType, customPermissions?: Permission[]) => Promise<void>;

  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShopIdentified, setIsShopIdentified] = useState<boolean>(true);
  const [identifiedShopCode, setIdentifiedShopCode] = useState<string | null>('KUMAR-TN');
  const [isDevSimulatorVisible, setDevSimulatorVisible] = useState<boolean>(false);

  useEffect(() => {
    // Initialize default development session
    const initialSession = authService.getCurrentSession();
    if (initialSession) {
      setSession(initialSession);
    }
    setIsLoading(false);
  }, []);

  const identifyShop = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await authService.identifyShop(code);
      if (res.success && res.organization) {
        setIsShopIdentified(true);
        setIdentifiedShopCode(res.organization.shopCode);
        return { success: true, organization: res.organization };
      }
      return { success: false, error: res.error || 'Failed to verify shop code' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneOrEmail: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(phoneOrEmail, pass);
      if (res.success && res.session) {
        setSession(res.session);
        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setSession(null);
    setIsLoading(false);
  };

  const switchSimulatedRole = async (role: RoleType, customPermissions?: Permission[]) => {
    setIsLoading(true);
    const updated = await authService.switchSimulatedRole(role, customPermissions);
    setSession(updated);
    setIsLoading(false);
  };

  const user = session?.user || null;
  const permissions = session?.permissions || [];

  const value: AuthContextValue = {
    session,
    user,
    organization: session?.organization || null,
    branch: session?.branch || null,
    role: session?.role || null,
    permissions,
    dataScope: session?.dataScope || null,
    isAuthenticated: !!session,
    isLoading,
    isShopIdentified,
    identifiedShopCode,
    identifyShop,
    login,
    logout,
    isDevSimulatorVisible,
    setDevSimulatorVisible,
    switchSimulatedRole,
    hasPermission: (perm: Permission) => checkPermission(permissions, perm),
    hasAnyPermission: (perms: Permission[]) => checkAnyPermission(permissions, perms),
    hasAllPermissions: (perms: Permission[]) => checkAllPermissions(permissions, perms),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
