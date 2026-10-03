/**
 * Goldifi Employee / Staff Management Screen
 * Team members, roles, branch assignments, and access control management.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';
import { ScreenHeader } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState, AccessDeniedState } from '../../components/ui/States';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Employee } from '../../types';

export default function EmployeesScreen() {
  const router = useRouter();
  const { hasPermission, setDevSimulatorVisible } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canView = hasPermission('EMPLOYEES_VIEW');
  const canManageRoles = hasPermission('MANAGE_ROLES');

  const loadStaff = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [canView]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStaff();
  };

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Staff Management" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="EMPLOYEES_VIEW"
          message="Your operational role is not authorized to inspect store personnel or access control permissions."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Staff & Roles"
        subtitle={`${employees.length} shop operators`}
        onBack={() => router.back()}
        rightAction={
          canManageRoles ? (
            <Button
              title="Roles"
              size="sm"
              variant="outline"
              leftIcon={<Ionicons name="shield-outline" size={15} color={colors.primary} />}
              onPress={() => router.push('/employees/roles')}
            />
          ) : undefined
        }
      />

      {loading && !refreshing ? (
        <LoadingState message="Loading staff directory..." />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push({ pathname: '/employees/[id]', params: { id: item.id } })}
              style={styles.empCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatarRow}>
                  <Avatar name={item.name} size={46} />
                  <View style={styles.empInfo}>
                    <Text style={styles.empName}>{item.name}</Text>
                    <Text style={styles.empEmail}>{item.email}</Text>
                    <View style={styles.branchRow}>
                      <Ionicons name="business-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.branchText}>{item.branchName}</Text>
                    </View>
                  </View>
                </View>

                <RoleBadge role={item.role} customTitle={item.customRoleTitle} size="sm" />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.statusDotRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.status === 'ACTIVE' ? colors.success : colors.textMuted },
                    ]}
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <Text style={styles.permCountText}>
                  {item.permissions.length} Permissions Active
                </Text>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  empCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  empInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  empName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  empEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 3,
  },
  branchText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
  },
  permCountText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
