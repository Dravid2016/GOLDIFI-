/**
 * Goldifi Data Scope Definitions
 * Distinguishes Action Permissions ("What can I do?") from Data Scope ("What data can I see?")
 */

import { DataScope } from '../types';

export interface DataScopeDefinition {
  id: DataScope;
  title: string;
  description: string;
}

export const DATA_SCOPES: Record<DataScope, DataScopeDefinition> = {
  ALL_BRANCHES: {
    id: 'ALL_BRANCHES',
    title: 'All Branches (Organization-Wide)',
    description: 'Can view records, customers, loans, and inventory across every store location.',
  },
  MY_BRANCH: {
    id: 'MY_BRANCH',
    title: 'Assigned Branch Only',
    description: 'Restricted strictly to records and customers affiliated with the current branch.',
  },
  MY_ASSIGNED_CUSTOMERS: {
    id: 'MY_ASSIGNED_CUSTOMERS',
    title: 'My Assigned Customers Only',
    description: 'Restricted to customers and loans directly managed by this specific officer.',
  },
};
