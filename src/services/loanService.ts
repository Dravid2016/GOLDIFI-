/**
 * Goldifi Loan Service
 */

import { MOCK_LOANS } from '../mock/loans';
import { Loan, LoanStatus, User } from '../types';
import { filterByDataScope } from '../permissions/access';

class LoanService {
  private loans: Loan[] = [...MOCK_LOANS];

  async getLoans(
    user: User | null,
    filter?: { status?: LoanStatus | 'ALL'; query?: string; customerId?: string }
  ): Promise<Loan[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = filterByDataScope(this.loans, user);

    if (filter?.customerId) {
      list = list.filter((l) => l.customerId === filter.customerId);
    }

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((l) => l.status === filter.status);
    }

    if (filter?.query && filter.query.trim()) {
      const q = filter.query.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.loanNumber.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q) ||
          l.customerPhone.includes(q)
      );
    }

    return list;
  }

  async getLoanById(id: string): Promise<Loan | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.loans.find((l) => l.id === id || l.loanNumber === id) || null;
  }

  async createLoan(loanData: Omit<Loan, 'id' | 'loanNumber' | 'totalInterestPaid' | 'totalPrincipalPaid' | 'outstandingBalance' | 'monthlyInterestAmount'>): Promise<Loan> {
    await new Promise((r) => setTimeout(r, 300));
    const nextNum = Math.floor(10300 + Math.random() * 500);
    const loanNum = `LN-${nextNum}`;
    const monthlyInterest = Math.round((loanData.principalAmount * (loanData.annualInterestRate / 100)) / 12);

    const newLoan: Loan = {
      ...loanData,
      id: `loan-${nextNum}`,
      loanNumber: loanNum,
      monthlyInterestAmount: monthlyInterest,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      outstandingBalance: loanData.principalAmount,
      status: 'ACTIVE',
    };

    this.loans.unshift(newLoan);
    return newLoan;
  }

  async closeLoan(loanId: string, notes?: string): Promise<Loan | null> {
    await new Promise((r) => setTimeout(r, 250));
    const idx = this.loans.findIndex((l) => l.id === loanId);
    if (idx === -1) return null;

    this.loans[idx] = {
      ...this.loans[idx],
      status: 'CLOSED',
      outstandingBalance: 0,
      closedDate: new Date().toISOString(),
      notes: notes ? `${this.loans[idx].notes || ''}\nClosed: ${notes}` : this.loans[idx].notes,
    };
    return this.loans[idx];
  }

  async updateInterestRate(loanId: string, newRate: number): Promise<Loan | null> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = this.loans.findIndex((l) => l.id === loanId);
    if (idx === -1) return null;

    const monthlyInterest = Math.round((this.loans[idx].principalAmount * (newRate / 100)) / 12);
    this.loans[idx] = {
      ...this.loans[idx],
      annualInterestRate: newRate,
      monthlyInterestAmount: monthlyInterest,
    };
    return this.loans[idx];
  }
}

export const loanService = new LoanService();
