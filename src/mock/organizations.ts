/**
 * Mock Organization: Kumar Pawnbrokers & Jewelers
 */

import { Organization } from '../types';

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-kumar-01',
    name: 'Kumar Pawnbrokers',
    legalName: 'Kumar Pawnbroking & Jewelry Financial Services Pvt. Ltd.',
    registrationNumber: 'PB-TN-CHN-2012-88492',
    taxId: '33AABCK8821N1ZM',
    currency: 'INR',
    supportPhone: '+91 98401 22334',
    supportEmail: 'care@kumarpawnbrokers.in',
    address: '42, Bazaar Street, George Town, Chennai',
    shopCode: 'KUMAR-TN',
    branchesCount: 3,
  },
  {
    id: 'org-laxmi-02',
    name: 'Sri Laxmi Bankers',
    legalName: 'Sri Laxmi Gold Loan & Pawn Corporation',
    registrationNumber: 'PB-KA-BLR-2016-55102',
    taxId: '29AABCS9912K1ZL',
    currency: 'INR',
    supportPhone: '+91 94481 77665',
    supportEmail: 'contact@srilaxmibanker.com',
    address: '18, Commercial Road, Malleshwaram, Bengaluru',
    shopCode: 'LAXMI-BLR',
    branchesCount: 2,
  },
];

export const CURRENT_ORGANIZATION = MOCK_ORGANIZATIONS[0];
