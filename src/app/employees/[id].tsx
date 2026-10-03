/**
 * Goldifi Employee Detail & Permission Matrix Screen
 * Displays staff profile and breakdown of active permissions grouped by module.
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';
import { PERMISSION_GROUPS } from '../../permissions/permissions';
import { ScreenHeader } from '../../components/ui/Header';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge, StatusBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/Modal';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Employee, Permission } from '../../types';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const canManage = hasPermission('EMPLOYEES_MANAGE');

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!employee) return;
    setToggling(true);
    try {
      const updated = await employeeService.toggleEmployeeStatus(employee.id);
      if (updated) setEmployee({ ...updated });
      setShowStatusConfirm(false);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Employee Access" onBack={() => router.back()} />
        <LoadingState message="Loading staff permissions..." />
      </SafeAreaView>
    );
  }

  if (!employee) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Employee Access" onBack={() => router.back()} />
        <EmptyState
          title="Staff Member Not Found"
          message="No active operator found with this identifier."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={employee.name}
        subtitle={`${employee.employeeCode} • ${employee.branchName}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar name={employee.name} size={56} />
            <View style={styles.profileCol}>
              <Text style={styles.nameText}>{employee.name}</Text>
              <Text style={styles.emailText}>{employee.email}</Text>
              <View style={styles.badgeRow}>
                <RoleBadge role={employee.role} customTitle={employee.customRoleTitle} size="sm" />
                <StatusBadge status={employee.status} size="sm" />
              </View>
            </View>
          </View>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Branch Assignment:</Text>
              <Text style={styles.metaVal}>{employee.branchName}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Data Scope:</Text>
              <Text style={styles.metaValHighlight}>
                {employee.dataScope === 'ALL_BRANCHES' ? 'All Branches' : 'Main Branch Only'}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Tenure:</Text>
              <Text style={styles.metaVal}>Joined {formatDate(employee.joinedDate)}</Text>
            </View>
          </View>

          {canManage && (
            <Button
              title={employee.status === 'ACTIVE' ? 'Deactivate Operator' : 'Reactivate Operator'}
              variant={employee.status === 'ACTIVE' ? 'danger' : 'outline'}
              size="sm"
              onPress={() => setShowStatusConfirm(true)}
              style={styles.statusBtn}
            />
          )}
        </Card>

        {/* Assigned Permissions by Module */}
        <Text style={styles.sectionHeader}>AUTHORIZED MODULE PERMISSIONS</Text>
        <Text style={styles.sectionSub}>
          Granular capabilities granted to {employee.name} under {employee.role} role:
        </Text>

        {PERMISSION_GROUPS.map((group) => {
          return (
            <Card key={group.id} style={styles.groupCard}>
              <Text style={styles.groupTitle}>{group.moduleTitle}</Text>

              <View style={styles.permissionsList}>
                {group.permissions.map((perm) => {
                  const hasIt = employee.permissions.includes(perm.key);
                  return (
                    <View key={perm.key} style={styles.permRow}>
                      <View
                        style={[
                          styles.checkCircle,
                          hasIt ? styles.checkCircleActive : styles.checkCircleInactive,
                        ]}
                      >
                        <Ionicons
                          name={hasIt ? 'checkmark' : 'close'}
                          size={13}
                          color={hasIt ? colors.white : colors.textMuted}
                        />
                      </View>
                      <View style={styles.permTextCol}>
                        <Text style={[styles.permLabel, !hasIt && styles.permLabelDisabled]}>
                          {perm.label}
                        </Text>
                        <Text style={styles.permDesc}>{perm.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleToggleStatus}
        title={employee.status === 'ACTIVE' ? 'Deactivate Employee' : 'Reactivate Employee'}
        message={
          employee.status === 'ACTIVE'
            ? 'This will immediately revoke active pawnshop access for this employee.'
            : 'This will restore access privileges for this employee.'
        }
        affectedRecord={`${employee.name} (${employee.employeeCode})`}
        confirmLabel={employee.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
        isDestructive={employee.status === 'ACTIVE'}
        loading={toggling}
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
  profileCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  nameText: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  emailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaVal: {
    ...typography.captionBold,
    color: colors.text,
  },
  metaValHighlight: {
    ...typography.captionBold,
    color: colors.primary,
  },
  statusBtn: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  sectionSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: 2,
  },
  groupCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  groupTitle: {
    ...typography.secondaryBold,
    color: colors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.xs,
    marginBottom: spacing.sm,
  },
  permissionsList: {
    gap: spacing.sm,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkCircleActive: {
    backgroundColor: colors.success,
  },
  checkCircleInactive: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permTextCol: {
    flex: 1,
  },
  permLabel: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  permLabelDisabled: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  permDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
    lineHeight: 15,
  },
});
