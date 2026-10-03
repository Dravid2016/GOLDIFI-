/**
 * Mock Branches for Kumar Pawnbrokers
 */

import { Branch } from '../types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'branch-main',
    organizationId: 'org-kumar-01',
    name: 'Main Branch',
    code: 'MB-01',
    address: '42, Bazaar Street, George Town',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    phone: '+91 44 2538 9012',
    isMainBranch: true,
    status: 'ACTIVE',
  },
  {
    id: 'branch-town',
    organizationId: 'org-kumar-01',
    name: 'Town Branch',
    code: 'TB-02',
    address: '15, Mettu Street, T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    phone: '+91 44 2434 4567',
    isMainBranch: false,
    status: 'ACTIVE',
  },
  {
    id: 'branch-market',
    organizationId: 'org-kumar-01',
    name: 'Market Branch',
    code: 'MB-03',
    address: '88, North Car Street, Sowcarpet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600079',
    phone: '+91 44 2529 1109',
    isMainBranch: false,
    status: 'ACTIVE',
  },
];

export const CURRENT_BRANCH = MOCK_BRANCHES[0];
