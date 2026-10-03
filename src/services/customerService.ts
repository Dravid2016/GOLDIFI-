/**
 * Goldifi Customer Service
 */

import { MOCK_CUSTOMERS } from '../mock/customers';
import { Customer, User } from '../types';
import { filterByDataScope } from '../permissions/access';

class CustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  async getCustomers(user: User | null, query?: string): Promise<Customer[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = filterByDataScope(this.customers, user);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.customerId.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.customers.find((c) => c.id === id || c.customerId === id) || null;
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'customerId' | 'createdAt' | 'totalLoansCount' | 'activeLoansCount' | 'totalBorrowedAmount' | 'currentOutstandingAmount'>): Promise<Customer> {
    await new Promise((r) => setTimeout(r, 250));
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      customerId: `CUST-2026-${Math.floor(100 + Math.random() * 900)}`,
      totalLoansCount: 0,
      activeLoansCount: 0,
      totalBorrowedAmount: 0,
      currentOutstandingAmount: 0,
      createdAt: new Date().toISOString(),
    };

    this.customers.unshift(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    this.customers[idx] = { ...this.customers[idx], ...updates };
    return this.customers[idx];
  }
}

export const customerService = new CustomerService();
