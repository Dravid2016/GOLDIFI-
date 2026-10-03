/**
 * Goldifi Design System - Spacing Scale
 */

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,

  // Semantic layout spacing
  screenHorizontal: 20,
  screenTop: 16,
  screenBottom: 24,
  cardPadding: 16,
  cardGap: 12,
  sectionGap: 24,
  elementGap: 12,
  itemGap: 8,
  inputHeight: 48,
  buttonHeight: 48,
  buttonSmallHeight: 38,
  tabBarHeight: 64,
  headerHeight: 56,
} as const;

export type SpacingToken = keyof typeof spacing;
