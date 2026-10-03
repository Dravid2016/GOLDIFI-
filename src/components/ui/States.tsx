/**
 * Goldifi Application States
 * LoadingState, EmptyState, ErrorState, AccessDeniedState
 * No emojis used. Professional vector iconography.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Button, SecondaryButton } from './Button';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading Goldifi data...',
  style,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

export interface EmptyStateProps {
  title: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  iconName = 'file-tray-outline',
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={colors.textMuted} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          style={styles.actionBtn}
          size="sm"
        />
      )}
    </View>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to fetch the requested records. Please check connectivity and try again.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <View style={[styles.iconCircle, styles.errorIconCircle]}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry && (
        <SecondaryButton
          title="Try Again"
          onPress={onRetry}
          style={styles.actionBtn}
          size="sm"
        />
      )}
    </View>
  );
};

export interface AccessDeniedStateProps {
  requiredPermission?: string;
  title?: string;
  message?: string;
  onGoBack?: () => void;
  onOpenRoleSimulator?: () => void;
  style?: ViewStyle;
}

export const AccessDeniedState: React.FC<AccessDeniedStateProps> = ({
  requiredPermission,
  title = 'Access Denied',
  message = "You don't have permission to view or manage this section under your assigned role.",
  onGoBack,
  onOpenRoleSimulator,
  style,
}) => {
  return (
    <View style={[styles.centerContainer, style]}>
      <View style={[styles.iconCircle, styles.lockIconCircle]}>
        <Ionicons name="lock-closed-outline" size={36} color={colors.charcoal} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>

      {requiredPermission && (
        <View style={styles.permissionPill}>
          <Ionicons name="shield-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.permissionText}>Required: {requiredPermission}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        {onGoBack && (
          <SecondaryButton
            title="Go Back"
            onPress={onGoBack}
            size="sm"
            style={styles.btnHalf}
          />
        )}
        {onOpenRoleSimulator && (
          <Button
            title="Simulate Role"
            onPress={onOpenRoleSimulator}
            size="sm"
            style={styles.btnHalf}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 280,
  },
  loadingText: {
    ...typography.secondaryMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  errorIconCircle: {
    backgroundColor: colors.errorLight,
  },
  lockIconCircle: {
    backgroundColor: colors.primaryLight,
  },
  stateTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  stateMessage: {
    ...typography.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actionBtn: {
    minWidth: 140,
    marginTop: spacing.xs,
  },
  permissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
  },
  permissionText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginLeft: spacing.xxs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    maxWidth: 280,
  },
  btnHalf: {
    flex: 1,
  },
});
