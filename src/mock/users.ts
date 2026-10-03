/**
 * Mock Users & Demo Accounts
 * Development-Only Mock Auth
 */

import { ROLE_DEFINITIONS } from '../permissions/roles';
import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-owner-01',
    name: 'John Kumar',
    email: 'john@kumarpawnbrokers.in',
    phone: '+91 98401 22334',
    role: 'OWNER',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: ROLE_DEFINITIONS.OWNER.defaultPermissions,
    dataScope: 'ALL_BRANCHES',
    lastLoginAt: '2026-10-03T18:30:00Z',
  },
  {
    id: 'user-manager-02',
    name: 'Rajesh Sharma',
    email: 'rajesh@kumarpawnbrokers.in',
    phone: '+91 98402 33445',
    role: 'MANAGER',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: ROLE_DEFINITIONS.MANAGER.defaultPermissions,
    dataScope: 'MY_BRANCH',
    lastLoginAt: '2026-10-03T19:00:00Z',
  },
  {
    id: 'user-officer-03',
    name: 'Suresh Verma',
    email: 'suresh@kumarpawnbrokers.in',
    phone: '+91 98403 44556',
    role: 'PAWN_OFFICER',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: ROLE_DEFINITIONS.PAWN_OFFICER.defaultPermissions,
    dataScope: 'MY_BRANCH',
    lastLoginAt: '2026-10-03T17:15:00Z',
  },
  {
    id: 'user-cashier-04',
    name: 'Priya Sundaram',
    email: 'priya@kumarpawnbrokers.in',
    phone: '+91 98404 55667',
    role: 'CASHIER',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: ROLE_DEFINITIONS.CASHIER.defaultPermissions,
    dataScope: 'MY_BRANCH',
    lastLoginAt: '2026-10-03T19:10:00Z',
  },
  {
    id: 'user-inventory-05',
    name: 'Arun Natarajan',
    email: 'arun@kumarpawnbrokers.in',
    phone: '+91 98405 66778',
    role: 'INVENTORY_STAFF',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: ROLE_DEFINITIONS.INVENTORY_STAFF.defaultPermissions,
    dataScope: 'MY_BRANCH',
    lastLoginAt: '2026-10-03T16:45:00Z',
  },
  {
    id: 'user-custom-06',
    name: 'Deepa Nair',
    email: 'deepa@kumarpawnbrokers.in',
    phone: '+91 98406 77889',
    role: 'CUSTOM',
    customRoleName: 'Gold Appraisal Lead',
    organizationId: 'org-kumar-01',
    branchId: 'branch-main',
    status: 'ACTIVE',
    permissions: [
      'CUSTOMERS_VIEW',
      'LOANS_VIEW',
      'INVENTORY_VIEW',
      'INVENTORY_CREATE',
      'INVENTORY_EDIT',
      'REPORTS_VIEW',
    ],
    dataScope: 'MY_BRANCH',
    lastLoginAt: '2026-10-03T15:20:00Z',
  },
];

export const DEFAULT_USER = MOCK_USERS[0]; // John Kumar (Owner)
