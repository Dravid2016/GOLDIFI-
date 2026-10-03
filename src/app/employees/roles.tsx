/**
 * Goldifi Custom Roles & Permissions Configuration Screen
 * Interactive permission matrix builder for creating specialized operational roles.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { PERMISSION_GROUPS } from '../../permissions/permissions';
import { ScreenHeader } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AccessDeniedState } from '../../components/ui/States';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Permission } from '../../types';

export default function CustomRolesScreen() {
  const router = useRouter();
  const { hasPermission, switchSimulatedRole, setDevSimulatorVisible } = useAuth();

  const canManage = hasPermission('MANAGE_ROLES');

  const [roleTitle, setRoleTitle] = useState('Inventory Supervisor');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
    'CUSTOMERS_VIEW',
    'LOANS_VIEW',
    'INVENTORY_VIEW',
    'INVENTORY_CREATE',
    'INVENTORY_EDIT',
    'REPORTS_VIEW',
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!canManage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Role Privileges" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="MANAGE_ROLES"
          message="Configuring role permission matrices is restricted to Shop Owners and authorized administrators."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const togglePermission = (perm: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
    setSavedSuccess(false);
  };

  const handleSaveAndTest = async () => {
    if (!roleTitle.trim()) return;
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      // Switch simulated role to CUSTOM with this exact customized permission set!
      await switchSimulatedRole('CUSTOM', selectedPermissions);
      setSavedSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 700);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Custom Roles"
        subtitle="Access Privilege Matrix"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.promptText}>
            Define custom operational roles with a granular permission matrix tailored to specific employee responsibilities.
          </Text>

          <Input
            label="Role Title / Identifier"
            value={roleTitle}
            onChangeText={setRoleTitle}
            placeholder="e.g. Vault Inspector or Loan Supervisor"
            leftIcon={<Ionicons name="shield-outline" size={18} color={colors.textSecondary} />}
            required
          />

          <View style={styles.selectedCountBanner}>
            <Ionicons name="checkbox-outline" size={18} color={colors.primary} />
            <Text style={styles.selectedCountText}>
              {selectedPermissions.length} permissions checked
            </Text>
          </View>

          {/* Module Permission Checklists */}
          {PERMISSION_GROUPS.map((group) => {
            return (
              <Card key={group.id} style={styles.groupCard}>
                <Text style={styles.groupTitle}>{group.moduleTitle}</Text>

                <View style={styles.permList}>
                  {group.permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <Pressable
                        key={perm.key}
                        onPress={() => togglePermission(perm.key)}
                        style={({ pressed }) => [
                          styles.permRow,
                          isChecked && styles.permRowChecked,
                          { opacity: pressed ? 0.75 : 1 },
                        ]}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                          {isChecked && <Ionicons name="checkmark" size={14} color={colors.white} />}
                        </View>
                        <View style={styles.permTextCol}>
                          <Text style={[styles.permTitle, isChecked && styles.permTitleActive]}>
                            {perm.label}
                          </Text>
                          <Text style={styles.permDesc}>{perm.description}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>
            );
          })}

          {savedSuccess && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>Role configured and active in simulator!</Text>
            </View>
          )}

          <Button
            title="Save Role & Test in Simulator"
            size="lg"
            onPress={handleSaveAndTest}
            loading={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    paddingBottom: spacing.huge,
  },
  promptText: {
    ...typography.secondary,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  selectedCountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  selectedCountText: {
    ...typography.secondaryBold,
    color: colors.primaryDark,
  },
  groupCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  groupTitle: {
    ...typography.secondaryBold,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
  },
  permList: {
    gap: spacing.xs,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
  },
  permRowChecked: {
    backgroundColor: '#FFF8F4',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
    backgroundColor: colors.surface,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  permTextCol: {
    flex: 1,
  },
  permTitle: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  permTitleActive: {
    color: colors.primaryDark,
  },
  permDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
    lineHeight: 15,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  successText: {
    ...typography.secondaryBold,
    color: colors.success,
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
});
