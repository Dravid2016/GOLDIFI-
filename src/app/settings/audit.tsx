/**
 * Goldifi Immutable Audit Log Screen (Read-Only)
 * Comprehensive record of user activities, sanctions, repayments, and custody transfers.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { auditService } from '../../services/auditService';
import { ScreenHeader } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { RoleBadge } from '../../components/ui/Badge';
import { LoadingState, AccessDeniedState, EmptyState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { AuditLog } from '../../types';

export default function AuditLogsScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canViewAudit = hasPermission('AUDIT_VIEW');

  const loadLogs = useCallback(async () => {
    if (!canViewAudit) {
      setLoading(false);
      return;
    }
    try {
      const data = await auditService.getAuditLogs(user);
      setLogs(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, canViewAudit]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  if (!canViewAudit) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Audit Logs" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="AUDIT_VIEW"
          message="Your account does not possess AUDIT_VIEW permission to inspect non-repudiable audit trails."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Audit Logs"
        subtitle="Compliance & Activity Records"
        onBack={() => router.back()}
      />

      {loading && !refreshing ? (
        <LoadingState message="Fetching immutable audit logs..." />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Logs Available"
          message="No operational audit entries found in current scope."
          iconName="document-text-outline"
        />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.actionCol}>
                  <Text style={styles.actionTitle}>{item.action}</Text>
                  <Text style={styles.recordRef}>Ref: {item.recordIdentifier}</Text>
                </View>
                <View style={styles.resultBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.resultText}>{item.result}</Text>
                </View>
              </View>

              {item.details ? (
                <Text style={styles.detailsText}>{item.details}</Text>
              ) : null}

              {item.amount !== undefined && item.amount > 0 && (
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Transaction Value:</Text>
                  <Text style={styles.amountVal}>{formatINR(item.amount)}</Text>
                </View>
              )}

              <View style={styles.logDivider} />

              <View style={styles.logFooter}>
                <View style={styles.userRow}>
                  <Ionicons name="person-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.userName}>{item.userName}</Text>
                  <RoleBadge role={item.userRole} size="sm" />
                </View>
                <Text style={styles.timeText}>{formatDateTime(item.timestamp)}</Text>
              </View>

              <View style={styles.deviceRow}>
                <Ionicons name="laptop-outline" size={11} color={colors.textMuted} />
                <Text style={styles.deviceText}>{item.ipAddressPlaceholder} • {item.branchName}</Text>
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
  logCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  actionCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  actionTitle: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  recordRef: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: 1,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 3,
  },
  resultText: {
    ...typography.badge,
    fontSize: 9,
    color: colors.success,
  },
  detailsText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    marginVertical: 4,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginVertical: 4,
    gap: spacing.xs,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amountVal: {
    ...typography.secondaryBold,
    color: colors.charcoal,
  },
  logDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    ...typography.captionBold,
    color: colors.text,
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  deviceText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
});
