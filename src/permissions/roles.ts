/**
 * Goldifi Role Definitions
 */

import { Permission, RoleType } from '../types';

export interface RoleDefinition {
  id: RoleType;
  title: string;
  description: string;
  defaultPermissions: Permission[];
}

export const ALL_PERMISSIONS: Permission[] = [
  'CUSTOMERS_VIEW',
  'CUSTOMERS_CREATE',
  'CUSTOMERS_EDIT',
  'LOANS_VIEW',
  'LOANS_CREATE',
  'LOANS_EDIT',
  'LOANS_CLOSE',
  'APPROVE_LOAN',
  'CHANGE_INTEREST_RATE',
  'PAYMENTS_VIEW',
  'PAYMENTS_CREATE',
  'PRINT_RECEIPT',
  'INVENTORY_VIEW',
  'INVENTORY_CREATE',
  'INVENTORY_EDIT',
  'REPORTS_VIEW',
  'EXPORT_REPORT',
  'VIEW_FINANCIAL_INFORMATION',
  'EMPLOYEES_VIEW',
  'EMPLOYEES_MANAGE',
  'MANAGE_ROLES',
  'MANAGE_BRANCH',
  'SETTINGS_VIEW',
  'SETTINGS_MANAGE',
  'AUDIT_VIEW',
];

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  OWNER: {
    id: 'OWNER',
    title: 'Owner',
    description: 'Complete unrestricted access across all branches, financials, and staff.',
    defaultPermissions: [...ALL_PERMISSIONS],
  },
  MANAGER: {
    id: 'MANAGER',
    title: 'Store Manager',
    description: 'Branch management, loan approvals, employee supervision, and branch reporting.',
    defaultPermissions: [
      'CUSTOMERS_VIEW',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_EDIT',
      'LOANS_VIEW',
      'LOANS_CREATE',
      'LOANS_EDIT',
      'LOANS_CLOSE',
      'APPROVE_LOAN',
      'PAYMENTS_VIEW',
      'PAYMENTS_CREATE',
      'PRINT_RECEIPT',
      'INVENTORY_VIEW',
      'INVENTORY_CREATE',
      'INVENTORY_EDIT',
      'REPORTS_VIEW',
      'EMPLOYEES_VIEW',
      'SETTINGS_VIEW',
      'AUDIT_VIEW',
    ],
  },
  PAWN_OFFICER: {
    id: 'PAWN_OFFICER',
    title: 'Pawn / Loan Officer',
    description: 'Evaluates items, creates loans, manages pledges, and interacts with customers.',
    defaultPermissions: [
      'CUSTOMERS_VIEW',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_EDIT',
      'LOANS_VIEW',
      'LOANS_CREATE',
      'LOANS_EDIT',
      'PAYMENTS_VIEW',
      'INVENTORY_VIEW',
      'INVENTORY_CREATE',
      'PRINT_RECEIPT',
    ],
  },
  CASHIER: {
    id: 'CASHIER',
    title: 'Cashier',
    description: 'Handles daily counter payments, creates customer receipts, and registers collections.',
    defaultPermissions: [
      'CUSTOMERS_VIEW',
      'CUSTOMERS_CREATE',
      'LOANS_VIEW',
      'PAYMENTS_VIEW',
      'PAYMENTS_CREATE',
      'PRINT_RECEIPT',
    ],
  },
  INVENTORY_STAFF: {
    id: 'INVENTORY_STAFF',
    title: 'Inventory Staff',
    description: 'Manages pledged item lockers, custody verifications, releases, and storage.',
    defaultPermissions: [
      'INVENTORY_VIEW',
      'INVENTORY_CREATE',
      'INVENTORY_EDIT',
      'CUSTOMERS_VIEW',
      'LOANS_VIEW',
    ],
  },
  CUSTOM: {
    id: 'CUSTOM',
    title: 'Custom Role',
    description: 'Tailored permissions assigned by pawnshop management.',
    defaultPermissions: [
      'CUSTOMERS_VIEW',
      'LOANS_VIEW',
      'INVENTORY_VIEW',
    ],
  },
};
