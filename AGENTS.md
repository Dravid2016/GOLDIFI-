# AGENTS.md — Goldifi Mobile CRM

This is a **Native Expo / React Native Mobile Application**. Prioritize mobile-first patterns, performance, and cross-platform native compatibility.

## Absolute Rules & Constraints

1. **Mobile-Only Application**:
   - Target: Android and iOS native mobile.
   - Goldifi is NOT a website, web app, responsive web page, or desktop dashboard.
   - **DO NOT USE VITE**. Zero Vite dependencies, Vite configs, Vite plugins, or Vite scripts.
   - **DO NOT USE React DOM** or web-specific HTML/CSS layouts.
   - Do NOT introduce desktop sidebars or desktop navigation.

2. **Technology Stack**:
   - React Native (0.86.x)
   - Expo (SDK 57.x)
   - Expo Router (57.x)
   - Metro Bundler
   - TypeScript (Strict mode)
   - Compatible with **Expo Go**.

3. **No Emojis Anywhere in the UI**:
   - Use professional vector icons (from `@expo/vector-icons`, e.g. Ionicons).
   - No emoji icons, buttons, placeholders, or status badges.

4. **Design System & Visual Identity**:
   - Primary: `#EA6329` (Goldifi Orange)
   - Primary Dark: `#C94F1F`
   - Charcoal: `#323031`
   - White: `#FFFFFF`
   - Surface: `#F7F7F7`
   - Border: `#E5E5E5`
   - Success: `#2E7D5B`
   - Warning: `#B7791F`
   - Error: `#C73E3E`
   - Info: `#356D9B`
   - Use centralized design tokens from `@/theme`.

5. **Access Architecture (RBAC & Scoping)**:
   - Organization → Branch → User → Role → Permissions → Data Scope.
   - **Role is NOT permission**: Check granular permissions (e.g. `hasPermission('LOANS_CREATE')`), never write `if (role === 'owner')` for operational features.
   - **Data Scope is separate from Action Permission**: Distinguishes "What can I do?" from "What data can I see?" (`ALL_BRANCHES`, `MY_BRANCH`, `MY_ASSIGNED_CUSTOMERS`).
   - Employees never choose their role on login. The system resolves identity and authorization.

6. **Frontend/Backend Boundary**:
   - This repository is currently FRONTEND-ONLY.
   - Use service abstractions in `@/services` (`customerService`, `loanService`, etc.). Screens must never access raw data directly.
   - Keep boundaries backend-ready for future REST/GraphQL replacement.

## Standard Commands

```bash
npx expo start              # start the Metro development server for Expo Go
npm run android             # run on Android emulator / device
npm run ios                 # run on iOS simulator (macOS required)
npm run typecheck           # run TypeScript strict typecheck (tsc --noEmit)
npm run doctor              # run Expo doctor diagnostics
npm run lint                # lint check
```
