/**
 * Goldifi Permission Groupings & Metadata
 */

import { Permission } from '../types';

export interface PermissionMeta {
  key: Permission;
  label: string;
  description: string;
}

export interface PermissionGroup {
  id: string;
  moduleTitle: string;
  permissions: PermissionMeta[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'customers',
    moduleTitle: 'Customers',
    permissions: [
      {
        key: 'CUSTOMERS_VIEW',
        label: 'View Customers',
        description: 'Search and view customer records and pledge histories',
      },
      {
        key: 'CUSTOMERS_CREATE',
        label: 'Create Customers',
        description: 'Register new customers with KYC / Govt ID',
      },
      {
        key: 'CUSTOMERS_EDIT',
        label: 'Edit Customers',
        description: 'Update customer contact, addresses, and documents',
      },
    ],
  },
  {
    id: 'loans',
    moduleTitle: 'Pawn Loans',
    permissions: [
      {
        key: 'LOANS_VIEW',
        label: 'View Loans',
        description: 'Access loan records, item appraisal details, and schedules',
      },
      {
        key: 'LOANS_CREATE',
        label: 'Create Loan',
        description: 'Issue new pawn loan against pledged collateral',
      },
      {
        key: 'LOANS_EDIT',
        label: 'Edit Loan',
        description: 'Modify loan details, notes, and terms before approval',
      },
      {
        key: 'LOANS_CLOSE',
        label: 'Close Loan',
        description: 'Process loan redemption and pledge release upon payoff',
      },
      {
        key: 'APPROVE_LOAN',
        label: 'Approve High-Value Loan',
        description: 'Authorization for loans above standard officer limits',
      },
      {
        key: 'CHANGE_INTEREST_RATE',
        label: 'Override Interest Rate',
        description: 'Special discretion to adjust lending rates',
      },
    ],
  },
  {
    id: 'payments',
    moduleTitle: 'Payments & Cash Counter',
    permissions: [
      {
        key: 'PAYMENTS_VIEW',
        label: 'View Payments',
        description: 'View daily collections, installments, and ledger entries',
      },
      {
        key: 'PAYMENTS_CREATE',
        label: 'Accept Payment',
        description: 'Record cash, UPI, or bank transfer payments against loans',
      },
      {
        key: 'PRINT_RECEIPT',
        label: 'Generate & Print Receipts',
        description: 'Generate formal payment vouchers and print physical receipts',
      },
    ],
  },
  {
    id: 'inventory',
    moduleTitle: 'Pledged Items / Inventory',
    permissions: [
      {
        key: 'INVENTORY_VIEW',
        label: 'View Inventory',
        description: 'Browse pledged items, locker allocations, and statuses',
      },
      {
        key: 'INVENTORY_CREATE',
        label: 'Record Pledged Items',
        description: 'Catalog weights, purity karat, and custody records',
      },
      {
        key: 'INVENTORY_EDIT',
        label: 'Modify Inventory Location',
        description: 'Update locker, safe, and storage status movements',
      },
    ],
  },
  {
    id: 'reports',
    moduleTitle: 'Reports & Analytics',
    permissions: [
      {
        key: 'REPORTS_VIEW',
        label: 'View Reports',
        description: 'Access collections, loan aging, and inventory summaries',
      },
      {
        key: 'VIEW_FINANCIAL_INFORMATION',
        label: 'View Financial Health',
        description: 'Access total revenue, interest earnings, and shop valuation',
      },
      {
        key: 'EXPORT_REPORT',
        label: 'Export Reports',
        description: 'Download PDF / CSV statements and daily summaries',
      },
    ],
  },
  {
    id: 'employees',
    moduleTitle: 'Staff & Team Access',
    permissions: [
      {
        key: 'EMPLOYEES_VIEW',
        label: 'View Employees',
        description: 'Browse staff list, roles, and branch assignments',
      },
      {
        key: 'EMPLOYEES_MANAGE',
        label: 'Manage Employees',
        description: 'Add, edit, deactivate, or assign employees',
      },
      {
        key: 'MANAGE_ROLES',
        label: 'Configure Roles & Permissions',
        description: 'Create custom roles and modify access privilege matrices',
      },
    ],
  },
  {
    id: 'settings',
    moduleTitle: 'Shop & System Settings',
    permissions: [
      {
        key: 'SETTINGS_VIEW',
        label: 'View Shop Settings',
        description: 'View shop details, branches, and loan configurations',
      },
      {
        key: 'SETTINGS_MANAGE',
        label: 'Manage Shop Settings',
        description: 'Edit business profiles, tax info, and operational rules',
      },
      {
        key: 'MANAGE_BRANCH',
        label: 'Manage Branches',
        description: 'Create and configure pawnshop branches',
      },
    ],
  },
  {
    id: 'audit',
    moduleTitle: 'Audit & Compliance',
    permissions: [
      {
        key: 'AUDIT_VIEW',
        label: 'View Audit Logs',
        description: 'Inspect non-repudiable audit logs of all user actions',
      },
    ],
  },
];
