/**
 * Goldifi Badge Component Library
 * High readability, accessible color contrast, distinct status styling.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { LoanStatus, InventoryStatus, RoleType } from '../../types';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primaryLight, text: colors.primaryDark, border: colors.primaryMuted };
      case 'success':
        return { bg: colors.successLight, text: colors.success, border: colors.successBorder };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning, border: colors.warningBorder };
      case 'error':
        return { bg: colors.errorLight, text: colors.error, border: colors.errorBorder };
      case 'info':
        return { bg: colors.infoLight, text: colors.info, border: colors.infoBorder };
      case 'neutral':
      default:
        return { bg: colors.surfaceSecondary, text: colors.textSecondary, border: colors.border };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: c.bg,
          borderColor: c.border,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? spacing.xs : spacing.sm,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
};

export const StatusBadge: React.FC<{ status: LoanStatus | InventoryStatus | 'ACTIVE' | 'INACTIVE' | 'FLAGGED'; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  let label = status.replace(/_/g, ' ');
  let variant: BadgeProps['variant'] = 'neutral';

  switch (status) {
    case 'ACTIVE':
    case 'IN_STORAGE':
      variant = 'success';
      break;
    case 'DUE_SOON':
    case 'PLEDGED':
      variant = 'warning';
      break;
    case 'OVERDUE':
    case 'FLAGGED':
      variant = 'error';
      break;
    case 'CLOSED':
    case 'RELEASED':
      variant = 'neutral';
      break;
    case 'RENEWED':
    case 'SOLD':
      variant = 'info';
      break;
    case 'INACTIVE':
      variant = 'neutral';
      break;
  }

  return <Badge label={label} variant={variant} size={size} />;
};

export const RoleBadge: React.FC<{ role: RoleType; customTitle?: string; size?: 'sm' | 'md' }> = ({
  role,
  customTitle,
  size = 'md',
}) => {
  let label = customTitle || role.replace(/_/g, ' ');
  let variant: BadgeProps['variant'] = 'neutral';

  switch (role) {
    case 'OWNER':
      variant = 'primary';
      break;
    case 'MANAGER':
      variant = 'info';
      break;
    case 'PAWN_OFFICER':
      variant = 'warning';
      break;
    case 'CASHIER':
      variant = 'success';
      break;
    case 'INVENTORY_STAFF':
      variant = 'neutral';
      break;
    case 'CUSTOM':
      variant = 'primary';
      break;
  }

  return <Badge label={label} variant={variant} size={size} />;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.badge,
  },
});
