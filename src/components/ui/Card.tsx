/**
 * Goldifi Card Components
 * Surfaces for financial KPIs, lists, and operational data.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'outlined',
}) => {
  const containerStyle: ViewStyle = {
    ...styles.base,
    ...(variant === 'elevated' ? shadows.sm : {}),
    ...(variant === 'outlined' ? styles.outlined : {}),
    ...(variant === 'flat' ? styles.flat : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  onPress,
  style,
}) => {
  const getAccentBorder = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { borderLeftWidth: 4, borderLeftColor: colors.primary };
      case 'success':
        return { borderLeftWidth: 4, borderLeftColor: colors.success };
      case 'warning':
        return { borderLeftWidth: 4, borderLeftColor: colors.warning };
      case 'error':
        return { borderLeftWidth: 4, borderLeftColor: colors.error };
      default:
        return {};
    }
  };

  return (
    <Card
      onPress={onPress}
      variant="outlined"
      style={[{ flex: 1, ...getAccentBorder() }, style]}
    >
      <View style={styles.statHeader}>
        <Text style={styles.statTitle} numberOfLines={1}>{title}</Text>
        {icon && <View style={styles.statIcon}>{icon}</View>}
      </View>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle} numberOfLines={1}>{subtitle}</Text>}
    </Card>
  );
};

export interface InfoCardProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success';
  style?: ViewStyle;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  message,
  icon,
  variant = 'info',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return { bg: colors.warningLight, border: colors.warningBorder, text: colors.warning };
      case 'error':
        return { bg: colors.errorLight, border: colors.errorBorder, text: colors.error };
      case 'success':
        return { bg: colors.successLight, border: colors.successBorder, text: colors.success };
      case 'info':
      default:
        return { bg: colors.infoLight, border: colors.infoBorder, text: colors.info };
    }
  };

  const c = getColors();

  return (
    <View style={[styles.infoContainer, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      {icon && <View style={styles.infoIconBox}>{icon}</View>}
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { color: c.text }]}>{title}</Text>
        <Text style={styles.infoMessage}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardGap,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  flat: {
    backgroundColor: colors.surfaceSecondary,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    flex: 1,
  },
  statIcon: {
    marginLeft: spacing.xs,
  },
  statValue: {
    ...typography.amountMedium,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  statSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  infoIconBox: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...typography.secondaryBold,
    marginBottom: 2,
  },
  infoMessage: {
    ...typography.secondary,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
