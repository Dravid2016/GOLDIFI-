/**
 * Goldifi Report & Analytics Service
 */

import { MOCK_INVENTORY } from '../mock/inventory';
import { MOCK_LOANS } from '../mock/loans';
import { MOCK_PAYMENTS } from '../mock/payments';
import { User } from '../types';
import { filterByDataScope } from '../permissions/access';

export interface DashboardMetrics {
  activeLoansCount: number;
  newLoansThisMonth: number;
  totalOutstandingAmount: number;
  totalCollectionsToday: number;
  paymentsCountToday: number;
  overdueLoansCount: number;
  overdueAmount: number;
  dueSoonCount: number;
  totalCustomersCount: number;
  totalInventoryPledgedValue: number;
  storageLockerCount: number;
}

export interface CollectionsReport {
  todayTotal: number;
  thisWeekTotal: number;
  thisMonthTotal: number;
  byPaymentMode: { mode: string; amount: number; percentage: number }[];
  byBranch: { branch: string; amount: number }[];
}

export interface LoanPortfolioReport {
  totalDisbursed: number;
  totalActivePrincipal: number;
  overduePercentage: number;
  weightedAvgInterestRate: number;
  byCategory: { category: string; count: number; totalValue: number }[];
}

class ReportService {
  async getDashboardMetrics(user: User | null): Promise<DashboardMetrics> {
    await new Promise((r) => setTimeout(r, 150));
    const loans = filterByDataScope(MOCK_LOANS, user);
    const payments = filterByDataScope(MOCK_PAYMENTS, user);
    const inventory = filterByDataScope(MOCK_INVENTORY, user);

    const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'DUE_SOON');
    const overdueLoans = loans.filter((l) => l.status === 'OVERDUE');
    const dueSoonLoans = loans.filter((l) => l.status === 'DUE_SOON');

    const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);
    const overdueAmount = overdueLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);

    // Collections today (filter by today's date or recent payment)
    const collectionsToday = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalInventoryValue = inventory.reduce((sum, i) => sum + i.estimatedValue, 0);

    return {
      activeLoansCount: activeLoans.length,
      newLoansThisMonth: 14,
      totalOutstandingAmount: totalOutstanding,
      totalCollectionsToday: collectionsToday,
      paymentsCountToday: payments.length,
      overdueLoansCount: overdueLoans.length,
      overdueAmount,
      dueSoonCount: dueSoonLoans.length,
      totalCustomersCount: 1284,
      totalInventoryPledgedValue: totalInventoryValue,
      storageLockerCount: 48,
    };
  }

  async getCollectionsReport(user: User | null): Promise<CollectionsReport> {
    await new Promise((r) => setTimeout(r, 200));
    const payments = filterByDataScope(MOCK_PAYMENTS, user);
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    const upiAmount = payments.filter((p) => p.paymentMethod === 'UPI').reduce((sum, p) => sum + p.amount, 0);
    const cashAmount = payments.filter((p) => p.paymentMethod === 'CASH').reduce((sum, p) => sum + p.amount, 0);
    const bankAmount = payments.filter((p) => p.paymentMethod === 'BANK_TRANSFER').reduce((sum, p) => sum + p.amount, 0);

    return {
      todayTotal: total,
      thisWeekTotal: total * 3.4,
      thisMonthTotal: total * 11.2,
      byPaymentMode: [
        { mode: 'UPI / QR', amount: upiAmount, percentage: Math.round((upiAmount / (total || 1)) * 100) },
        { mode: 'Cash Counter', amount: cashAmount, percentage: Math.round((cashAmount / (total || 1)) * 100) },
        { mode: 'Bank / NEFT', amount: bankAmount, percentage: Math.round((bankAmount / (total || 1)) * 100) },
      ],
      byBranch: [
        { branch: 'Main Branch', amount: 44654 },
        { branch: 'Town Branch', amount: 1125 },
        { branch: 'Market Branch', amount: 8750 },
      ],
    };
  }

  async getPortfolioReport(user: User | null): Promise<LoanPortfolioReport> {
    await new Promise((r) => setTimeout(r, 200));
    const loans = filterByDataScope(MOCK_LOANS, user);
    const active = loans.filter((l) => l.status !== 'CLOSED');
    const totalActivePrincipal = active.reduce((sum, l) => sum + l.outstandingBalance, 0);
    const overdue = loans.filter((l) => l.status === 'OVERDUE');
    const overdueTotal = overdue.reduce((sum, l) => sum + l.outstandingBalance, 0);

    return {
      totalDisbursed: 515000,
      totalActivePrincipal,
      overduePercentage: totalActivePrincipal > 0 ? Math.round((overdueTotal / totalActivePrincipal) * 100) : 0,
      weightedAvgInterestRate: 17.4,
      byCategory: [
        { category: 'Gold Jewelry (22K)', count: 8, totalValue: 624000 },
        { category: 'Silver Articles', count: 2, totalValue: 48000 },
        { category: 'Diamonds & Precious Stones', count: 1, totalValue: 120000 },
      ],
    };
  }
}

export const reportService = new ReportService();
