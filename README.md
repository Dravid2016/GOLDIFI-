# Goldifi — Mobile Pawnshop Management CRM

> **Mobile-Only Financial Operations Native App** built with React Native, Expo SDK 57, Expo Router, Metro Bundler, and TypeScript.  
> **Target Platforms**: Android & iOS (Tested and compatible with Expo Go).  
> **Absolute Rule**: Mobile-native only. **Zero Vite**, zero React DOM, zero desktop web architecture.

---

## 1. Project Overview

**Goldifi** is a native mobile CRM and operations application designed specifically for pawnshops and financial lending institutions. Goldifi unifies all pawnbroking workflows into a single mobile application with role-aware experiences:

- **Pawnshop Owners**: High-level portfolio tracking, multi-branch overview, total outstanding principal, total valuation of pledged collateral, and financial analytics.
- **Store Managers**: Loan sanctions, interest rate overrides, staff oversight, and branch reporting.
- **Pawn / Loan Officers**: Borrower KYC, gold appraisal, gross/net weight calculation, karat purity recording, and loan issuance.
- **Cashiers**: Daily counter collections, repayment installments (Interest/Principal/Redemption), and printable receipt vouchers.
- **Inventory Staff**: Safe/locker custody, dual-key tracking, storage reallocation, and release handovers.
- **Custom Roles**: Tailored operational access configured via a granular permission matrix (e.g. Lead Gold Appraiser).

---

## 2. Technology Stack

- **Framework**: React Native 0.86.3
- **Platform**: Expo SDK 57.0.26
- **Routing**: Expo Router 57.0.24 (File-based native routing with typed routes)
- **Language**: TypeScript 6.0.3 (Strict mode, zero `any` policy)
- **Bundler**: Metro Bundler
- **Iconography**: `@expo/vector-icons` (100% native vector icons; **Zero Emojis** used anywhere in the UI)
- **Styling**: React Native StyleSheet with centralized design tokens in `src/theme`
- **Safe Area & Gestures**: `react-native-safe-area-context` + `react-native-screens`

---

## 3. Visual Identity & Design System

Goldifi follows a professional financial design language:

| Token | Hex Value | Semantic Usage |
|---|---|---|
| **Primary (Goldifi Orange)** | `#EA6329` | Call to actions, active tabs, primary accents |
| **Primary Dark** | `#C94F1F` | Pressed button states |
| **Charcoal** | `#323031` | Brand titles, high-contrast dark text, headers |
| **White** | `#FFFFFF` | Surface backgrounds, card backgrounds |
| **Surface** | `#F7F7F7` | Screen background |
| **Border** | `#E5E5E5` | Structural dividers and input outlines |
| **Success** | `#2E7D5B` | Positive cash collections, active loans |
| **Warning** | `#B7791F` | Loans due soon, collateral notices |
| **Error** | `#C73E3E` | Overdue loans, flagged accounts, destructive actions |
| **Info** | `#356D9B` | Audit logs, system notices |

---

## 4. How to Install and Run

### Prerequisites
- Node.js LTS (v22 recommended)
- Mobile Device with the **Expo Go** app installed (from Google Play Store or Apple App Store)

### Installation
```bash
# Clone or navigate to the project directory
cd "c:/Users/USER/Documents/GOLDIFI CRM App/Goldifi App"

# Install dependencies (already prepared with compatible versions)
npm install
```

### Running with Expo Go
```bash
# Start the Metro development server
npx expo start
```
1. Open the **Expo Go** application on your Android device or camera app on iOS.
2. Scan the QR code displayed in your terminal.
3. The Goldifi application bundles through Metro and launches natively on your device.

### Running on Android / iOS Emulators
```bash
npm run android   # launches on connected Android emulator or USB device
npm run ios       # launches on iOS simulator (requires macOS)
```

### Validation Checks
```bash
npm run typecheck # verifies TypeScript strictly (tsc --noEmit)
npm run doctor    # runs official Expo Doctor diagnostics (21/21 checks pass)
```

---

## 5. Access Architecture & RBAC

Goldifi uses multi-tenant role-based access control with distinct data scoping:

```
Organization (Kumar Pawnbrokers)
    ↓
Branch (Main Branch / Town Branch / Market Branch)
    ↓
User (Staff Member)
    ↓
Role (Owner / Manager / Pawn Officer / Cashier / Inventory / Custom)
    ↓
Permissions ("What can I do?")
    ↓
Data Scope ("What data can I see?")
```

### Role is NOT Permission
Features and screens never check `if (role === 'owner')`. Instead, centralized helper functions evaluate granular permissions:
- `hasPermission(permissions, 'LOANS_CREATE')`
- `hasAnyPermission(permissions, ['PAYMENTS_VIEW', 'PAYMENTS_CREATE'])`
- `canAccessRoute(permissions, route)`
- `filterByDataScope(records, user)`

### Action Permissions vs. Data Scopes
- **Permissions**: `CUSTOMERS_VIEW`, `CUSTOMERS_CREATE`, `CUSTOMERS_EDIT`, `LOANS_VIEW`, `LOANS_CREATE`, `LOANS_EDIT`, `LOANS_CLOSE`, `APPROVE_LOAN`, `CHANGE_INTEREST_RATE`, `PAYMENTS_VIEW`, `PAYMENTS_CREATE`, `PRINT_RECEIPT`, `INVENTORY_VIEW`, `INVENTORY_CREATE`, `INVENTORY_EDIT`, `REPORTS_VIEW`, `VIEW_FINANCIAL_INFORMATION`, `EMPLOYEES_VIEW`, `EMPLOYEES_MANAGE`, `MANAGE_ROLES`, `SETTINGS_VIEW`, `SETTINGS_MANAGE`, `AUDIT_VIEW`.
- **Data Scopes**:
  - `ALL_BRANCHES`: Can view records across every branch (e.g. Owner).
  - `MY_BRANCH`: Filtered strictly to assigned branch location (e.g. Manager, Cashier, Inventory).
  - `MY_ASSIGNED_CUSTOMERS`: Filtered strictly to directly assigned accounts.

---

## 6. Development Mock Accounts & Role Simulator

### Security Notice
In production, authenticated tokens issued by the backend securely determine the user's role and data scope. Client-side role selection on the login screen is forbidden.

For **frontend evaluation and design QA**, a persistent **Role Simulator** is built into the application (accessible from the top banner or through the More screen):

| Demo Account | Default Role | Data Scope | Key Capabilities |
|---|---|---|---|
| **John Kumar** (`john@kumarpawnbrokers.in`) | `OWNER` | `ALL_BRANCHES` | Unrestricted access across all 3 branches, portfolio KPIs, custom roles |
| **Rajesh Sharma** (`rajesh@kumarpawnbrokers.in`) | `MANAGER` | `MY_BRANCH` | Loan approvals, employee supervision, branch analytics, audit logs |
| **Suresh Verma** (`suresh@kumarpawnbrokers.in`) | `PAWN_OFFICER` | `MY_BRANCH` | Gold appraisal, collateral weight entry, loan creation |
| **Priya Sundaram** (`priya@kumarpawnbrokers.in`) | `CASHIER` | `MY_BRANCH` | Daily counter payments, UPI settlements, printable receipts |
| **Arun Natarajan** (`arun@kumarpawnbrokers.in`) | `INVENTORY_STAFF` | `MY_BRANCH` | Vault lockers, custody checks, collateral release |
| **Deepa Nair** (`deepa@kumarpawnbrokers.in`) | `CUSTOM` (Lead Appraiser) | `MY_BRANCH` | Custom permission matrix for purity assay and inventory verification |

---

## 7. Project Structure

```
Goldifi App/
├── assets/
│   └── images/
│       ├── goldifi-logo.png        # Official brand logo
│       ├── icon.png                # 512x512 app icon
│       └── android-icon-foreground.png
├── src/
│   ├── app/                        # Expo Router Native Screens
│   │   ├── _layout.tsx             # Root layout & providers
│   │   ├── index.tsx               # Splash & entry routing
│   │   ├── (auth)/                 # Authentication Flow
│   │   │   ├── welcome.tsx         # Welcome screen
│   │   │   ├── shop-code.tsx       # Pawnshop code identification
│   │   │   ├── login.tsx           # Employee credentials login
│   │   │   ├── verification.tsx    # 2FA / OTP verification
│   │   │   ├── forgot-password.tsx # Password recovery
│   │   │   ├── reset-password.tsx  # New password setup
│   │   │   └── session-expired.tsx # Session timeout screen
│   │   ├── (tabs)/                 # Main Bottom Tabs Navigation
│   │   │   ├── _layout.tsx         # Permission-driven bottom tabs
│   │   │   ├── dashboard.tsx       # Role-aware operational dashboard
│   │   │   ├── customers.tsx       # Customer directory & search
│   │   │   ├── loans.tsx           # Loan list, filter & statuses
│   │   │   ├── payments.tsx        # Cash counter & payment ledger
│   │   │   └── more.tsx            # Secondary modules menu
│   │   ├── customers/
│   │   │   ├── [id].tsx            # Customer profile, KYC & pledge history
│   │   │   └── create.tsx          # New borrower KYC registration
│   │   ├── loans/
│   │   │   ├── [id].tsx            # Loan agreement, collateral & redemption
│   │   │   └── create.tsx          # Issue new pawn loan form
│   │   ├── payments/
│   │   │   ├── [id].tsx            # Payment breakdown
│   │   │   ├── create.tsx          # Accept payment form
│   │   │   └── receipt.tsx         # Formal printable receipt voucher
│   │   ├── inventory/
│   │   │   ├── index.tsx           # Pledged vault & lockers
│   │   │   └── [id].tsx            # Collateral details & locker change
│   │   ├── employees/
│   │   │   ├── index.tsx           # Staff list & branch assignments
│   │   │   ├── [id].tsx            # Employee profile & permission breakdown
│   │   │   └── roles.tsx           # Custom role creator & matrix
│   │   ├── reports/
│   │   │   └── index.tsx           # Mobile analytics & breakdown charts
│   │   └── settings/
│   │       ├── index.tsx           # Shop profile & branches
│   │       └── audit.tsx           # Read-only audit log viewer
│   ├── components/
│   │   └── ui/                     # Reusable Mobile Component Library
│   │       ├── Button.tsx          # Primary, secondary, outline, icon buttons
│   │       ├── Input.tsx           # Form inputs, search, amount with ₹ prefix
│   │       ├── Card.tsx            # KPI stat cards, info banners, surfaces
│   │       ├── Badge.tsx           # Status & role badges
│   │       ├── Avatar.tsx          # User initials avatar
│   │       ├── Header.tsx          # Mobile screen & section headers
│   │       ├── Modal.tsx           # Native modals & confirmation dialogs
│   │       ├── States.tsx          # Loading, empty, error & access-denied states
│   │       ├── Divider.tsx         # Subtle layout dividers
│   │       ├── RoleSimulatorModal.tsx # Dev role simulation bar & dialog
│   │       └── index.ts
│   ├── context/
│   │   └── AuthContext.tsx         # Central session, auth & role state
│   ├── mock/                       # Realistic Indian Pawnshop Datasets
│   │   ├── organizations.ts        # Kumar Pawnbrokers
│   │   ├── branches.ts             # Main, Town, and Market branches
│   │   ├── users.ts                # Demo operators
│   │   ├── customers.ts            # Realistic borrower KYC records
│   │   ├── loans.ts                # Pawn loans with Indian currency values
│   │   ├── payments.ts             # UPI, cash & bank settlements
│   │   ├── inventory.ts            # 22K/916 gold jewelry collateral
│   │   ├── employees.ts            # Staff directory
│   │   └── auditLogs.ts            # Non-repudiable audit logs
│   ├── permissions/                # Centralized Access Control
│   │   ├── roles.ts                # Role definitions & defaults
│   │   ├── permissions.ts          # Granular permissions grouped by module
│   │   ├── scopes.ts               # Data scoping definitions
│   │   ├── access.ts               # hasPermission, filterByDataScope helpers
│   │   └── navigation.ts           # Route guard rules
│   ├── services/                   # Service Abstraction Layer (Backend Ready)
│   │   ├── authService.ts
│   │   ├── customerService.ts
│   │   ├── loanService.ts
│   │   ├── paymentService.ts
│   │   ├── inventoryService.ts
│   │   ├── employeeService.ts
│   │   ├── reportService.ts
│   │   └── auditService.ts
│   ├── theme/                      # Centralized Design Tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── radius.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   ├── types/                      # Complete TypeScript Models
│   └── utils/
│       ├── currency.ts             # Indian currency formatting (₹25,000, ₹18,45,000)
│       └── date.ts                 # Formatted localized timestamps
├── app.json                        # Expo SDK 57 configuration
├── package.json                    # Mobile-only native scripts & dependencies
├── tsconfig.json                   # Strict TypeScript configuration
└── AGENTS.md                       # Mobile-only architectural constraints
```

---

## 8. Backend Integration Points

The application has been engineered with strict service boundaries (`src/services/`):
- `authService.login()`: Replace mock delay with HTTP `POST /api/v1/auth/login`.
- `loanService.getLoans()`: Replace mock array with `GET /api/v1/loans?branchId=...`.
- `customerService.createCustomer()`: Replace with `POST /api/v1/customers`.
- `paymentService.createPayment()`: Replace with `POST /api/v1/payments`.
- `inventoryService.updateLocation()`: Replace with `PATCH /api/v1/inventory/:id`.

Screens consume data exclusively through services and hooks, meaning backend integration can be achieved without modifying any UI components.

---

## 9. License

Proprietary — Goldifi Pawnshop Management Systems.
