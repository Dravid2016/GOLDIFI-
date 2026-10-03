/**
 * DEVELOPMENT-ONLY ROLE SIMULATOR
 *
 * IMPORTANT SECURITY NOTICE:
 * This simulator is provided strictly for frontend design evaluation and prototype testing.
 * In production Goldifi, the backend server verifies user credentials and securely issues
 * authenticated claims with cryptographically verified roles, permissions, and branch scopes.
 * Users CANNOT choose or change their authority in production.
 */

import React, { useState } from 'react';
import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFINITIONS } from '../../permissions/roles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { RoleType } from '../../types';
import { RoleBadge } from './Badge';

export const RoleSimulatorBanner: React.FC = () => {
  const { role, dataScope, user, setDevSimulatorVisible } = useAuth();

  if (!user || !role) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerLeft}>
        <View style={styles.devTag}>
          <Text style={styles.devTagText}>DEV SIMULATOR</Text>
        </View>
        <Text style={styles.bannerText} numberOfLines={1}>
          Role: <Text style={styles.boldText}>{role.replace(/_/g, ' ')}</Text> | Scope: <Text style={styles.boldText}>{dataScope === 'ALL_BRANCHES' ? 'All Branches' : 'Main Branch'}</Text>
        </Text>
      </View>
      <Pressable
        onPress={() => setDevSimulatorVisible(true)}
        style={({ pressed }) => [styles.switchBtn, { opacity: pressed ? 0.7 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel="Switch simulated role"
      >
        <Ionicons name="swap-horizontal" size={14} color={colors.white} />
        <Text style={styles.switchBtnText}>Switch</Text>
      </Pressable>
    </View>
  );
};

export const RoleSimulatorModal: React.FC = () => {
  const {
    isDevSimulatorVisible,
    setDevSimulatorVisible,
    role: currentRole,
    switchSimulatedRole,
  } = useAuth();

  const [loadingRole, setLoadingRole] = useState<RoleType | null>(null);

  const handleSelectRole = async (targetRole: RoleType) => {
    setLoadingRole(targetRole);
    try {
      await switchSimulatedRole(targetRole);
      setDevSimulatorVisible(false);
    } finally {
      setLoadingRole(null);
    }
  };

  const rolesList: { type: RoleType; name: string; subtitle: string; scope: string; samplePerms: string }[] = [
    {
      type: 'OWNER',
      name: 'Owner (John Kumar)',
      subtitle: 'Complete access to all branches, full financials, loans, employees, and settings.',
      scope: 'ALL_BRANCHES',
      samplePerms: 'All 24 Permissions (Unrestricted)',
    },
    {
      type: 'MANAGER',
      name: 'Branch Manager (Rajesh)',
      subtitle: 'Approves loans, manages employees, views reports, oversees cash and inventory.',
      scope: 'MY_BRANCH (Main Branch)',
      samplePerms: 'Loans, Payments, Inventory, Reports, Staff, Audit',
    },
    {
      type: 'PAWN_OFFICER',
      name: 'Pawn Officer (Suresh Verma)',
      subtitle: 'Appraises gold collateral, calculates valuations, disburses loans, views customers.',
      scope: 'MY_BRANCH',
      samplePerms: 'Customers, Loans Create/Edit, Receipts, Inventory View',
    },
    {
      type: 'CASHIER',
      name: 'Cashier (Priya Sundaram)',
      subtitle: 'Operates cash counter, collects interest/principal, prints receipts.',
      scope: 'MY_BRANCH',
      samplePerms: 'Payments Create, Receipts, Customer Search',
    },
    {
      type: 'INVENTORY_STAFF',
      name: 'Inventory Staff (Arun Natarajan)',
      subtitle: 'Safe/locker custody, verifies weights and purity, logs pledges and releases.',
      scope: 'MY_BRANCH',
      samplePerms: 'Inventory View/Edit, Lockers, Custody Verification',
    },
    {
      type: 'CUSTOM',
      name: 'Custom: Lead Appraiser (Deepa)',
      subtitle: 'Specialized role created with custom permission checklist for gold appraisal.',
      scope: 'MY_BRANCH',
      samplePerms: 'Custom Matrix: Appraisal, Inventory, Reports View',
    },
  ];

  return (
    <RNModal
      visible={isDevSimulatorVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setDevSimulatorVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setDevSimulatorVisible(false)}
        />
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <View style={styles.disclaimerPill}>
                <Ionicons name="construct-outline" size={14} color={colors.warning} />
                <Text style={styles.disclaimerText}>DEVELOPMENT / DEMO ONLY</Text>
              </View>
              <Text style={styles.modalTitle}>Role & Permission Simulator</Text>
              <Text style={styles.modalSubtitle}>
                Select an operational role to test how screens, navigation, actions, and data scopes adapt in real-time.
              </Text>
            </View>
            <Pressable
              onPress={() => setDevSimulatorVisible(false)}
              hitSlop={8}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* List of roles */}
          <ScrollView style={styles.rolesScroll} contentContainerStyle={styles.rolesContent}>
            {rolesList.map((item) => {
              const isSelected = currentRole === item.type;
              return (
                <Pressable
                  key={item.type}
                  onPress={() => handleSelectRole(item.type)}
                  style={({ pressed }) => [
                    styles.roleCard,
                    isSelected && styles.roleCardSelected,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${item.name}`}
                >
                  <View style={styles.roleCardTop}>
                    <View style={styles.roleCardTitleRow}>
                      <RoleBadge role={item.type} size="sm" />
                      <Text style={styles.roleCardName}>{item.name}</Text>
                    </View>
                    {isSelected ? (
                      <View style={styles.activeCheck}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      </View>
                    ) : (
                      <View style={styles.selectRadio} />
                    )}
                  </View>

                  <Text style={styles.roleCardDesc}>{item.subtitle}</Text>

                  <View style={styles.scopeMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="business-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.metaText}>{item.scope}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="key-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.metaText}>{item.samplePerms}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}

            <View style={styles.noticeBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.info} />
              <Text style={styles.noticeText}>
                Production Security Note: Real permissions will be determined strictly by backend authentication tokens. Client-side role selection is disabled in production builds.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.charcoal,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  devTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
  },
  devTagText: {
    ...typography.badge,
    fontSize: 9,
    color: colors.white,
  },
  bannerText: {
    ...typography.caption,
    color: colors.surfaceTertiary,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: colors.white,
  },
  switchBtn: {
    backgroundColor: '#4A4749',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  switchBtnText: {
    ...typography.captionBold,
    color: colors.white,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.modal,
    borderTopRightRadius: radius.modal,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  disclaimerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.xxs,
  },
  disclaimerText: {
    ...typography.badge,
    fontSize: 10,
    color: colors.warning,
    marginLeft: 4,
  },
  modalTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    maxWidth: 290,
  },
  closeBtn: {
    padding: spacing.xxs,
  },
  rolesScroll: {
    maxHeight: 520,
  },
  rolesContent: {
    padding: spacing.lg,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFFDFB',
  },
  roleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  roleCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  roleCardName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  activeCheck: {
    padding: 2,
  },
  selectRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleCardDesc: {
    ...typography.secondary,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  scopeMetaRow: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.xs,
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xxs,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.card,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noticeText: {
    ...typography.caption,
    color: colors.info,
    marginLeft: spacing.xs,
    flex: 1,
    lineHeight: 16,
  },
});
