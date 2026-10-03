/**
 * Goldifi Payment Service
 */

import { MOCK_PAYMENTS } from '../mock/payments';
import { Payment, User } from '../types';
import { filterByDataScope } from '../permissions/access';

class PaymentService {
  private payments: Payment[] = [...MOCK_PAYMENTS];

  async getPayments(
    user: User | null,
    filter?: { loanId?: string; customerId?: string; query?: string }
  ): Promise<Payment[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = filterByDataScope(this.payments, user);

    if (filter?.loanId) {
      list = list.filter((p) => p.loanId === filter.loanId);
    }
    if (filter?.customerId) {
      list = list.filter((p) => p.customerId === filter.customerId);
    }
    if (filter?.query && filter.query.trim()) {
      const q = filter.query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.receiptNumber.toLowerCase().includes(q) ||
          p.loanNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.payments.find((p) => p.id === id || p.receiptNumber === id) || null;
  }

  async createPayment(paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'paymentDate' | 'status'>): Promise<Payment> {
    await new Promise((r) => setTimeout(r, 300));
    const nextReceiptNum = Math.floor(8840 + Math.random() * 200);
    const receiptNum = `RCPT-${nextReceiptNum}`;

    const newPayment: Payment = {
      ...paymentData,
      id: `pmt-${nextReceiptNum}`,
      receiptNumber: receiptNum,
      paymentDate: new Date().toISOString(),
      status: 'COMPLETED',
    };

    this.payments.unshift(newPayment);
    return newPayment;
  }
}

export const paymentService = new PaymentService();
