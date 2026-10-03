/**
 * Goldifi Shop Settings & Profile Screen
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { MOCK_BRANCHES } from '../../mock/branches';
import { ScreenHeader } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/Modal';
import { AccessDeniedState } from '../../components/ui/States';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, organization, branch, role, hasPermission, setDevSimulatorVisible } = useAuth();

  const canView = hasPermission('SETTINGS_VIEW');
  const canViewAudit = hasPermission('AUDIT_VIEW');
  const canManageStaff = hasPermission('EMPLOYEES_VIEW');

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Shop Settings" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="SETTINGS_VIEW"
          message="Your account role does not have authorization to view pawnshop system settings."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Settings"
        subtitle="Shop Configuration"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Business Entity Profile */}
        <Text style={styles.sectionHeader}>PAWNSHOP ENTITY</Text>
        <Card style={styles.settingCard}>
          <View style={styles.headerRow}>
            <View style={styles.shopIconBox}>
              <Ionicons name="business" size={24} color={colors.primary} />
            </View>
            <View style={styles.shopTitleCol}>
              <Text style={styles.shopName}>{organization?.name}</Text>
              <Text style={styles.legalName}>{organization?.legalName}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Registration No.</Text>
            <Text style={styles.metaVal}>{organization?.registrationNumber}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>GSTIN / Tax ID</Text>
            <Text style={styles.metaVal}>{organization?.taxId}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Shop Identifier Code</Text>
            <Text style={styles.metaValPrimary}>{organization?.shopCode}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Headquarters</Text>
            <Text style={styles.metaVal}>{organization?.address}</Text>
          </View>
        </Card>

        {/* Branches */}
        <Text style={styles.sectionHeader}>REGISTERED BRANCHES ({MOCK_BRANCHES.length})</Text>
        {MOCK_BRANCHES.map((b) => (
          <Card key={b.id} style={styles.branchCard}>
            <View style={styles.branchTop}>
              <Text style={styles.branchName}>{b.name} ({b.code})</Text>
              {b.isMainBranch && (
                <View style={styles.mainBranchPill}>
                  <Text style={styles.mainBranchText}>MAIN HQ</Text>
                </View>
              )}
            </View>
            <Text style={styles.branchAddress}>{b.address}, {b.city}</Text>
            <Text style={styles.branchPhone}>{b.phone}</Text>
          </Card>
        ))}

        {/* Compliance & Audit Logs */}
        <Text style={styles.sectionHeader}>SECURITY & COMPLIANCE</Text>
        <Card style={styles.settingCard}>
          {canViewAudit && (
            <Pressable
              onPress={() => router.push('/settings/audit')}
              style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <View style={styles.actionCol}>
                  <Text style={styles.actionTitle}>Audit & Activity Logs</Text>
                  <Text style={styles.actionSubtitle}>Read-only trail of all operator actions and payments</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          )}

          {canManageStaff && (
            <Pressable
              onPress={() => router.push('/employees')}
              style={({ pressed }) => [styles.actionRow, styles.borderTop, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="people-outline" size={20} color={colors.info} />
                <View style={styles.actionCol}>
                  <Text style={styles.actionTitle}>Staff Access & Roles</Text>
                  <Text style={styles.actionSubtitle}>Manage employee credentials and branch assignments</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </Card>

        {/* Development Environment Info */}
        <View style={styles.devInfoBox}>
          <Ionicons name="hardware-chip-outline" size={18} color={colors.textSecondary} />
          <View style={styles.devInfoTextCol}>
            <Text style={styles.devInfoTitle}>Native Expo Runtime Environment</Text>
            <Text style={styles.devInfoDesc}>
              Running Expo SDK 57 on Metro bundler • Frontend mock service architecture • Zero web dependencies
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  settingCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shopIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  shopTitleCol: {
    flex: 1,
  },
  shopName: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  legalName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metaKey: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  metaVal: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  metaValPrimary: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  branchCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  branchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchName: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  mainBranchPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  mainBranchText: {
    ...typography.badge,
    fontSize: 9,
    color: colors.primaryDark,
  },
  branchAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  branchPhone: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  actionCol: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  actionTitle: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  devInfoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  devInfoTextCol: {
    flex: 1,
  },
  devInfoTitle: {
    ...typography.secondaryBold,
    color: colors.charcoal,
  },
  devInfoDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
