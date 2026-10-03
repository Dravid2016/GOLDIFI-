/**
 * Goldifi Form Input Components
 * High contrast, clear labels, inline validation states.
 */

import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  style,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          multiline && { height: Math.max(88, numberOfLines * 24), alignItems: 'flex-start' },
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.inputField,
            multiline && styles.inputFieldMultiline,
            !editable && styles.textDisabled,
          ]}
        />

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export const PasswordInput: React.FC<InputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={8}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      }
    />
  );
};

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by name, ID, or phone...',
  onClear,
  style,
}) => {
  return (
    <View style={[styles.searchContainer, style]}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={8}
          style={styles.searchClearBtn}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

export interface AmountInputProps extends Omit<InputProps, 'keyboardType' | 'leftIcon'> {
  currencySymbol?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  currencySymbol = '₹',
  ...props
}) => {
  return (
    <Input
      {...props}
      keyboardType="numeric"
      leftIcon={
        <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  requiredAsterisk: {
    ...typography.secondaryBold,
    color: colors.error,
    marginLeft: spacing.xxs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFDFB',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.borderLight,
  },
  inputField: {
    flex: 1,
    height: '100%',
    ...typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  inputFieldMultiline: {
    paddingVertical: spacing.sm,
    textAlignVertical: 'top',
  },
  textDisabled: {
    color: colors.textMuted,
  },
  iconContainer: {
    marginRight: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyPrefix: {
    ...typography.sectionTitle,
    color: colors.text,
    marginRight: spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginLeft: spacing.xxs,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.secondary,
    color: colors.text,
    height: '100%',
  },
  searchClearBtn: {
    padding: spacing.xxs,
  },
});
