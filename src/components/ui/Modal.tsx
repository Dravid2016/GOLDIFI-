/**
 * Goldifi Modal & Confirmation Component
 * Native feeling modals with safe areas and destructive action confirmations.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { Button, SecondaryButton } from './Button';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalCard, style]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityLabel="Close dialog"
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  affectedRecord?: string;
  consequence?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  affectedRecord,
  consequence,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.confirmCard}>
          <View style={[styles.iconCircle, isDestructive && styles.iconCircleDestructive]}>
            <Ionicons
              name={isDestructive ? 'warning-outline' : 'help-circle-outline'}
              size={28}
              color={isDestructive ? colors.error : colors.primary}
            />
          </View>

          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.confirmMessage}>{message}</Text>

          {affectedRecord && (
            <View style={styles.recordBox}>
              <Text style={styles.recordLabel}>Affected Record:</Text>
              <Text style={styles.recordValue}>{affectedRecord}</Text>
            </View>
          )}

          {consequence && (
            <View style={styles.consequenceBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.warning} />
              <Text style={styles.consequenceText}>{consequence}</Text>
            </View>
          )}

          <View style={styles.confirmActions}>
            <SecondaryButton
              title={cancelLabel}
              onPress={onClose}
              style={styles.actionBtn}
              disabled={loading}
            />
            <Button
              title={confirmLabel}
              variant={isDestructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenHorizontal,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.modal,
    overflow: 'hidden',
    zIndex: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  closeBtn: {
    padding: spacing.xxs,
  },
  modalScroll: {
    maxHeight: 500,
  },
  modalScrollContent: {
    padding: spacing.lg,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.modal,
    padding: spacing.xl,
    alignItems: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCircleDestructive: {
    backgroundColor: colors.errorLight,
  },
  confirmTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  confirmMessage: {
    ...typography.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  recordBox: {
    width: '100%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  recordValue: {
    ...typography.secondaryBold,
    color: colors.text,
    marginTop: 2,
  },
  consequenceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    width: '100%',
  },
  consequenceText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing.xs,
    flex: 1,
  },
  confirmActions: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
