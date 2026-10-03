/**
 * Goldifi Reusable Button Component Library
 * Professional touch-interactive mobile buttons with clear states.
 * No emojis used.
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let base: ViewStyle = {
      ...styles.base,
      ...styles[`size_${size}`],
      opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
    };

    switch (variant) {
      case 'primary':
        base = {
          ...base,
          backgroundColor: pressed ? colors.primaryDark : colors.primary,
        };
        break;
      case 'secondary':
        base = {
          ...base,
          backgroundColor: pressed ? colors.surfaceTertiary : colors.surfaceSecondary,
          borderWidth: 1,
          borderColor: colors.border,
        };
        break;
      case 'outline':
        base = {
          ...base,
          backgroundColor: pressed ? colors.primaryLight : 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
        break;
      case 'danger':
        base = {
          ...base,
          backgroundColor: pressed ? '#A83232' : colors.error,
        };
        break;
      case 'ghost':
        base = {
          ...base,
          backgroundColor: pressed ? colors.surfaceSecondary : 'transparent',
        };
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let base: TextStyle = {
      ...typography.secondaryBold,
    };

    if (size === 'lg') {
      base = { ...typography.bodyBold };
    } else if (size === 'sm') {
      base = { ...typography.captionBold };
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        return { ...base, color: colors.textInverse };
      case 'secondary':
        return { ...base, color: colors.text };
      case 'outline':
      case 'ghost':
        return { ...base, color: colors.primary };
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);

export const TextButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 40,
  variant = 'ghost',
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
          backgroundColor:
            variant === 'primary'
              ? colors.primary
              : variant === 'secondary'
              ? colors.surfaceSecondary
              : variant === 'danger'
              ? colors.errorLight
              : 'transparent',
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: {
    height: spacing.buttonSmallHeight,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    height: spacing.buttonHeight,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: spacing.xl,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
