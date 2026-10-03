/**
 * Goldifi Navigation & Route Access Rules
 * Maps routes and navigation tabs to required permissions.
 */

import { Permission } from '../types';
import { hasAllPermissions, hasAnyPermission, hasPermission } from './access';

export interface RouteRule {
  path: string;
  title: string;
  requiredPermission?: Permission;
  requiredAnyPermission?: Permission[];
  requiredAllPermissions?: Permission[];
}

export const ROUTE_PERMISSIONS: Record<string, RouteRule> = {
  // Tabs & Primary
  dashboard: {
    path: '/(tabs)/dashboard',
    title: 'Dashboard',
    // Dashboard is always available to authenticated users, but contents adapt
  },
  customers: {
    path: '/(tabs)/customers',
    title: 'Customers',
    requiredPermission: 'CUSTOMERS_VIEW',
  },
  loans: {
    path: '/(tabs)/loans',
    title: 'Pawn Loans',
    requiredPermission: 'LOANS_VIEW',
  },
  payments: {
    path: '/(tabs)/payments',
    title: 'Payments',
    requiredPermission: 'PAYMENTS_VIEW',
  },
  more: {
    path: '/(tabs)/more',
    title: 'More',
  },

  // Secondary Modules inside More / Direct Routes
  inventory: {
    path: '/inventory',
    title: 'Inventory / Pledged Items',
    requiredPermission: 'INVENTORY_VIEW',
  },
  reports: {
    path: '/reports',
    title: 'Reports & Analytics',
    requiredPermission: 'REPORTS_VIEW',
  },
  employees: {
    path: '/employees',
    title: 'Staff Management',
    requiredPermission: 'EMPLOYEES_VIEW',
  },
  roles: {
    path: '/employees/roles',
    title: 'Custom Roles',
    requiredPermission: 'MANAGE_ROLES',
  },
  audit: {
    path: '/settings/audit',
    title: 'Audit Logs',
    requiredPermission: 'AUDIT_VIEW',
  },
  settings: {
    path: '/settings',
    title: 'Shop Settings',
    requiredPermission: 'SETTINGS_VIEW',
  },
};

/**
 * Checks whether user has permission to navigate to a route
 */
export function canAccessRoute(
  userPermissions: Permission[] | undefined,
  routeKey: string
): boolean {
  if (!userPermissions) return false;
  const rule = ROUTE_PERMISSIONS[routeKey];
  if (!rule) return true; // public or unguarded authenticated route

  if (rule.requiredPermission) {
    return hasPermission(userPermissions, rule.requiredPermission);
  }
  if (rule.requiredAnyPermission) {
    return hasAnyPermission(userPermissions, rule.requiredAnyPermission);
  }
  if (rule.requiredAllPermissions) {
    return hasAllPermissions(userPermissions, rule.requiredAllPermissions);
  }
  return true;
}
