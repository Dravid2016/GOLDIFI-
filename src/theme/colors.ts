/**
 * Goldifi Design System - Color Palette
 * Mobile-only Financial/Operations CRM
 */

export const colors = {
  // Brand Primary
  primary: '#EA6329',
  primaryDark: '#C94F1F',
  primaryLight: '#FFEDE5',
  primaryMuted: '#FAD7C8',

  // Neutrals
  white: '#FFFFFF',
  charcoal: '#323031',
  text: '#323031',
  textSecondary: '#6B696A',
  textMuted: '#929091',
  textInverse: '#FFFFFF',

  // Surfaces & Backgrounds
  background: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F3F3',
  surfaceTertiary: '#ECEAEA',

  // Borders & Dividers
  border: '#E5E5E5',
  borderLight: '#EEEEEE',
  borderFocus: '#EA6329',
  divider: '#ECEAEA',

  // Status & Feedback (Accessible, high-contrast)
  success: '#2E7D5B',
  successLight: '#E8F5EE',
  successBorder: '#B2DFC8',

  warning: '#B7791F',
  warningLight: '#FDF6E2',
  warningBorder: '#F3DCA0',

  error: '#C73E3E',
  errorLight: '#FDECEC',
  errorBorder: '#F5BEBE',

  info: '#356D9B',
  infoLight: '#EBF4FA',
  infoBorder: '#B8D5EB',

  // Special roles colors (neutral tinted)
  roleOwner: '#323031',
  roleManager: '#356D9B',
  roleOfficer: '#B7791F',
  roleCashier: '#2E7D5B',
  roleInventory: '#7D479C',
  roleCustom: '#EA6329',

  // Overlay
  overlay: 'rgba(50, 48, 49, 0.65)',
  translucent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
