/**
 * Goldifi Design System - Border Radius Tokens
 */

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,

  // Semantic
  button: 8,
  card: 12,
  modal: 16,
  input: 8,
  badge: 6,
  avatar: 9999,
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
