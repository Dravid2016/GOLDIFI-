/**
 * Goldifi More Menu Screen
 * Mobile secondary navigation hub with strict permission filtering.
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
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ConfirmationModal } from '../../components/ui/Modal';
import { ScreenHeader } from '../../components/ui/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Permission } from '../../types';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  route: string;
  requiredPermission?: Permission;
}

export default function MoreScreen() {
  const router = useRouter();
  const { user, organization, branch, role, dataScope, hasPermission, logout, setDevSimulatorVisible } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'inventory',
      title: 'Pledged Items / Vault',
      subtitle: 'Collateral storage lockers, 916 gold custody & assay',
      icon: 'cube-outline',
      iconBg: '#F3E8F9',
      iconColor: '#7D479C',
      route: '/inventory',
      requiredPermission: 'INVENTORY_VIEW',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'Daily collections, loan aging & branch performance',
      icon: 'bar-chart-outline',
      iconBg: colors.primaryLight,
      iconColor: colors.primary,
      route: '/reports',
      requiredPermission: 'REPORTS_VIEW',
    },
    {
      id: 'employees',
      title: 'Staff Management',
      subtitle: 'Employees, branch assignments & active status',
      icon: 'people-outline',
      iconBg: colors.infoLight,
      iconColor: colors.info,
      route: '/employees',
      requiredPermission: 'EMPLOYEES_VIEW',
    },
    {
      id: 'roles',
      title: 'Custom Roles & Privileges',
      subtitle: 'Create roles and manage granular permission matrix',
      icon: 'shield-outline',
      iconBg: colors.warningLight,
      iconColor: colors.warning,
      route: '/employees/roles',
      requiredPermission: 'MANAGE_ROLES',
    },
    {
      id: 'audit',
      title: 'Audit & Compliance Logs',
      subtitle: 'Immutable record of staff actions, edits, and receipts',
      icon: 'document-text-outline',
      iconBg: colors.surfaceSecondary,
      iconColor: colors.charcoal,
      route: '/settings/audit',
      requiredPermission: 'AUDIT_VIEW',
    },
    {
      id: 'settings',
      title: 'Shop Settings',
      subtitle: 'Shop profile, branches, lending policies, tax registration',
      icon: 'settings-outline',
      iconBg: colors.surfaceSecondary,
      iconColor: colors.textSecondary,
      route: '/settings',
      requiredPermission: 'SETTINGS_VIEW',
    },
  ];

  // Filter items based on permissions
  const authorizedItems = menuItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return hasPermission(item.requiredPermission);
  });

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="More & Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.userRow}>
            <Avatar name={user?.name || 'User'} size={52} />
            <View style={styles.userCol}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.badgeRow}>
                <RoleBadge role={role || 'OWNER'} customTitle={user?.customRoleName} size="sm" />
                <View style={styles.scopeTag}>
                  <Text style={styles.scopeTagText}>
                    {dataScope === 'ALL_BRANCHES' ? 'All Branches' : 'Main Branch'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Development Role Simulator Shortcut */}
        <Pressable
          onPress={() => setDevSimulatorVisible(true)}
          style={styles.devCard}
        >
          <View style={styles.devCardLeft}>
            <View style={styles.devIconBox}>
              <Ionicons name="construct-outline" size={20} color={colors.warning} />
            </View>
            <View>
              <Text style={styles.devCardTitle}>Dev Role Simulator</Text>
              <Text style={styles.devCardDesc}>Switch role between Owner, Manager, Cashier, etc.</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>

        {/* Authorized Modules Section */}
        <Text style={styles.sectionHeader}>AUTHORIZED MODULES</Text>

        <View style={styles.menuGroup}>
          {authorizedItems.length === 0 ? (
            <Text style={styles.noModulesText}>
              No secondary modules authorized for your current operational role.
            </Text>
          ) : (
            authorizedItems.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(item.route as any)}
                style={({ pressed }) => [
                  styles.menuRow,
                  index < authorizedItems.length - 1 && styles.menuRowBorder,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))
          )}
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={() => setShowLogoutConfirm(true)}
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out of Goldifi</Text>
        </Pressable>

        <Text style={styles.versionText}>Goldifi Mobile CRM v1.0.0 • SDK 57 Native</Text>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to end your active workspace session?"
        confirmLabel="Sign Out"
        isDestructive
      />
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
  userCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scopeTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scopeTagText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  devCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  devCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  devIconBox: {
    marginRight: spacing.sm,
  },
  devCardTitle: {
    ...typography.secondaryBold,
    color: colors.charcoal,
  },
  devCardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  noModulesText: {
    ...typography.secondary,
    color: colors.textMuted,
    padding: spacing.lg,
    textAlign: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  logoutText: {
    ...typography.secondaryBold,
    color: colors.error,
  },
  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
