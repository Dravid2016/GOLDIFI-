/**
 * Goldifi Centralized Access Control Helpers
 */

import { DataScope, Permission, User } from '../types';

/**
 * Checks whether user has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[] | undefined,
  permission: Permission
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permission);
}

/**
 * Checks whether user has at least one of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[] | undefined,
  permissions: Permission[]
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks whether user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[] | undefined,
  permissions: Permission[]
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return permissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Checks whether a user can perform an action
 */
export function canPerformAction(
  user: User | null | undefined,
  permission: Permission
): boolean {
  if (!user) return false;
  return hasPermission(user.permissions, permission);
}

/**
 * Verifies if user's data scope satisfies the requirement
 */
export function hasDataScope(
  userScope: DataScope | undefined,
  requiredScope: DataScope
): boolean {
  if (!userScope) return false;
  if (userScope === 'ALL_BRANCHES') return true;
  if (userScope === 'MY_BRANCH' && requiredScope === 'MY_BRANCH') return true;
  if (userScope === 'MY_ASSIGNED_CUSTOMERS' && requiredScope === 'MY_ASSIGNED_CUSTOMERS') return true;
  return false;
}

/**
 * Filters a list of records according to user's branch & data scope
 */
export function filterByDataScope<T extends { branchId?: string; assignedOfficerId?: string }>(
  items: T[],
  user: User | null | undefined
): T[] {
  if (!user) return [];
  if (user.dataScope === 'ALL_BRANCHES') return items;
  if (user.dataScope === 'MY_BRANCH') {
    return items.filter((item) => !item.branchId || item.branchId === user.branchId);
  }
  if (user.dataScope === 'MY_ASSIGNED_CUSTOMERS') {
    return items.filter(
      (item) => !item.assignedOfficerId || item.assignedOfficerId === user.id
    );
  }
  return items;
}
