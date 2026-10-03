/**
 * Goldifi Design System - Typography Tokens
 */

import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  subsectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  secondaryMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  secondaryBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
  badge: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  amountLarge: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  amountMedium: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
