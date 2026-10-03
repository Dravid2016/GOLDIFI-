/**
 * Goldifi Authentication & Authorization Service
 * FRONTEND-ONLY ARCHITECTURE (Backend Ready)
 *
 * NOTE: This is development-only mock authentication.
 * In production, the backend server will authenticate credentials,
 * verify tokens/MFA, and issue authorized sessions with verified roles and scopes.
 */

import { MOCK_BRANCHES } from '../mock/branches';
import { MOCK_ORGANIZATIONS } from '../mock/organizations';
import { MOCK_USERS } from '../mock/users';
import { ROLE_DEFINITIONS } from '../permissions/roles';
import { AuthSession, RoleType, User } from '../types';

class AuthService {
  private currentSession: AuthSession | null = null;

  constructor() {
    // Default initial mock session for quick development testing
    const defaultUser = MOCK_USERS[0];
    this.currentSession = {
      user: defaultUser,
      organization: MOCK_ORGANIZATIONS[0],
      branch: MOCK_BRANCHES[0],
      role: defaultUser.role,
      permissions: [...defaultUser.permissions],
      dataScope: defaultUser.dataScope,
      token: 'mock-jwt-token-goldifi-dev-2026',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Validate Shop / Workspace Code
   */
  async identifyShop(shopCode: string): Promise<{ success: boolean; organization?: typeof MOCK_ORGANIZATIONS[0]; error?: string }> {
    await new Promise((r) => setTimeout(r, 250));
    const normalized = shopCode.trim().toUpperCase();
    const org = MOCK_ORGANIZATIONS.find(
      (o) => o.shopCode.toUpperCase() === normalized || normalized === 'KUMAR' || normalized === 'DEMO'
    );

    if (org) {
      return { success: true, organization: org };
    }
    return { success: false, error: 'Shop code not recognized. Please check with your store administrator.' };
  }

  /**
   * Mock User Login with Phone / Password
   */
  async login(phoneOrEmail: string, _password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    await new Promise((r) => setTimeout(r, 300));
    const trimmed = phoneOrEmail.trim().toLowerCase();

    // Find matching user or fallback to owner for demonstration
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === trimmed || u.phone.includes(trimmed.replace(/\s+/g, ''))
    ) || MOCK_USERS[0];

    const session: AuthSession = {
      user: matched,
      organization: MOCK_ORGANIZATIONS[0],
      branch: MOCK_BRANCHES.find((b) => b.id === matched.branchId) || MOCK_BRANCHES[0],
      role: matched.role,
      permissions: [...matched.permissions],
      dataScope: matched.dataScope,
      token: `mock-jwt-token-${matched.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = session;
    return { success: true, session };
  }

  /**
   * DEVELOPMENT ONLY: Switch active role simulation
   * Allows developer / reviewer to test exact experience of Owner, Manager, Officer, Cashier, Inventory, Custom.
   */
  async switchSimulatedRole(role: RoleType, customPermissions?: typeof MOCK_USERS[0]['permissions']): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 100));
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    const permissions = customPermissions || (ROLE_DEFINITIONS[role] ? ROLE_DEFINITIONS[role].defaultPermissions : targetUser.permissions);

    const session: AuthSession = {
      user: {
        ...targetUser,
        role,
        permissions,
      },
      organization: MOCK_ORGANIZATIONS[0],
      branch: MOCK_BRANCHES.find((b) => b.id === targetUser.branchId) || MOCK_BRANCHES[0],
      role,
      permissions,
      dataScope: role === 'OWNER' ? 'ALL_BRANCHES' : 'MY_BRANCH',
      token: `mock-jwt-${role.toLowerCase()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = session;
    return session;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    this.currentSession = null;
  }
}

export const authService = new AuthService();
