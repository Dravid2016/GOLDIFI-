/**
 * Goldifi Data & Access Types
 */

export type RoleType =
  | 'OWNER'
  | 'MANAGER'
  | 'PAWN_OFFICER'
  | 'CASHIER'
  | 'INVENTORY_STAFF'
  | 'CUSTOM';

export type Permission =
  // Customers
  | 'CUSTOMERS_VIEW'
  | 'CUSTOMERS_CREATE'
  | 'CUSTOMERS_EDIT'
  // Loans
  | 'LOANS_VIEW'
  | 'LOANS_CREATE'
  | 'LOANS_EDIT'
  | 'LOANS_CLOSE'
  | 'APPROVE_LOAN'
  | 'CHANGE_INTEREST_RATE'
  // Payments
  | 'PAYMENTS_VIEW'
  | 'PAYMENTS_CREATE'
  | 'PRINT_RECEIPT'
  // Inventory
  | 'INVENTORY_VIEW'
  | 'INVENTORY_CREATE'
  | 'INVENTORY_EDIT'
  // Reports
  | 'REPORTS_VIEW'
  | 'EXPORT_REPORT'
  | 'VIEW_FINANCIAL_INFORMATION'
  // Employees & Roles
  | 'EMPLOYEES_VIEW'
  | 'EMPLOYEES_MANAGE'
  | 'MANAGE_ROLES'
  | 'MANAGE_BRANCH'
  // Settings
  | 'SETTINGS_VIEW'
  | 'SETTINGS_MANAGE'
  // Audit
  | 'AUDIT_VIEW';

export type DataScope =
  | 'ALL_BRANCHES'
  | 'MY_BRANCH'
  | 'MY_ASSIGNED_CUSTOMERS';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: RoleType;
  customRoleName?: string;
  organizationId: string;
  branchId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  permissions: Permission[];
  dataScope: DataScope;
  lastLoginAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  currency: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  shopCode: string;
  branchesCount: number;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isMainBranch: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Customer {
  id: string;
  customerId: string; // e.g. "CUST-2024-001"
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  governmentIdType: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'PASSPORT';
  governmentIdNumber: string; // masked in UI if needed
  avatarUrl?: string;
  branchId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'FLAGGED';
  totalLoansCount: number;
  activeLoansCount: number;
  totalBorrowedAmount: number;
  currentOutstandingAmount: number;
  createdAt: string;
}

export type LoanStatus =
  | 'ACTIVE'
  | 'DUE_SOON'
  | 'OVERDUE'
  | 'CLOSED'
  | 'RENEWED';

export interface LoanItem {
  id: string;
  loanId: string;
  category: 'GOLD_JEWELRY' | 'SILVER_ARTICLE' | 'ELECTRONICS' | 'WATCH' | 'OTHER';
  description: string;
  grossWeightGrams?: number;
  netWeightGrams?: number;
  purityKarat?: string; // e.g. "22K", "18K", "916 Hallmark"
  estimatedMarketValue: number;
  storageLocation: string; // e.g. "Locker A - Shelf 2"
  itemCondition: 'MINT' | 'GOOD' | 'WORN' | 'DAMAGED';
  serialNumber?: string;
}

export interface Loan {
  id: string;
  loanNumber: string; // e.g. "LN-10293"
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  principalAmount: number;
  annualInterestRate: number; // e.g. 18 for 18% p.a.
  monthlyInterestAmount: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  outstandingBalance: number;
  startDate: string;
  dueDate: string;
  closedDate?: string;
  status: LoanStatus;
  items: LoanItem[];
  assignedOfficerId: string;
  assignedOfficerName: string;
  notes?: string;
}

export type PaymentType =
  | 'INTEREST'
  | 'PRINCIPAL'
  | 'RENEWAL'
  | 'CLOSURE';

export type PaymentMethod =
  | 'CASH'
  | 'UPI'
  | 'BANK_TRANSFER'
  | 'CHEQUE';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "RCPT-8832"
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  penaltyFee: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paymentDate: string;
  cashierId: string;
  cashierName: string;
  status: 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export type InventoryStatus =
  | 'PLEDGED'
  | 'IN_STORAGE'
  | 'RELEASED'
  | 'SOLD'
  | 'CLOSED';

export interface InventoryItem {
  id: string;
  itemCode: string; // e.g. "INV-9921"
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  category: 'GOLD_JEWELRY' | 'SILVER_ARTICLE' | 'ELECTRONICS' | 'WATCH' | 'OTHER';
  description: string;
  grossWeightGrams?: number;
  netWeightGrams?: number;
  purityKarat?: string;
  estimatedValue: number;
  status: InventoryStatus;
  storageLocker: string;
  receivedDate: string;
  releaseDate?: string;
  verifiedBy: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. "EMP-004"
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  customRoleTitle?: string;
  branchId: string;
  branchName: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: Permission[];
  dataScope: DataScope;
  joinedDate: string;
  lastActive: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: RoleType;
  action: string;
  module: 'CUSTOMERS' | 'LOANS' | 'PAYMENTS' | 'INVENTORY' | 'EMPLOYEES' | 'SETTINGS' | 'AUTH';
  recordId: string;
  recordIdentifier: string;
  amount?: number;
  branchId: string;
  branchName: string;
  timestamp: string;
  details: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddressPlaceholder: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'LOAN_DUE' | 'PAYMENT' | 'SECURITY' | 'INVENTORY' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}

export interface AuthSession {
  user: User;
  organization: Organization;
  branch: Branch;
  role: RoleType;
  permissions: Permission[];
  dataScope: DataScope;
  token: string;
  expiresAt: string;
}
