/**
 * Goldifi Role-Aware Mobile Dashboard
 * Dynamically changes KPIs, quick actions, and activity feeds based on user permissions.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { reportService, DashboardMetrics } from '../../services/reportService';
import { loanService } from '../../services/loanService';
import { paymentService } from '../../services/paymentService';
import { StatCard, Card, InfoCard } from '../../components/ui/Card';
import { StatusBadge, RoleBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Loan, Payment } from '../../types';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, organization, branch, role, hasPermission, setDevSimulatorVisible } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Permission flags
  const canViewFinancials = hasPermission('VIEW_FINANCIAL_INFORMATION') || role === 'OWNER';
  const canViewLoans = hasPermission('LOANS_VIEW');
  const canCreateLoan = hasPermission('LOANS_CREATE');
  const canViewPayments = hasPermission('PAYMENTS_VIEW');
  const canCreatePayment = hasPermission('PAYMENTS_CREATE');
  const canViewInventory = hasPermission('INVENTORY_VIEW');
  const canCreateCustomer = hasPermission('CUSTOMERS_CREATE');

  const loadData = useCallback(async () => {
    try {
      const [m, loans, payments] = await Promise.all([
        reportService.getDashboardMetrics(user),
        canViewLoans ? loanService.getLoans(user) : Promise.resolve([]),
        canViewPayments ? paymentService.getPayments(user) : Promise.resolve([]),
      ]);
      setMetrics(m);
      setRecentLoans(loans.slice(0, 4));
      setRecentPayments(payments.slice(0, 4));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, canViewLoans, canViewPayments]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData, role]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState message="Loading role workspace..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Top Header Card */}
        <View style={styles.topBar}>
          <View style={styles.shopIdentity}>
            <Text style={styles.shopName} numberOfLines={1}>
              {organization?.name || 'Kumar Pawnbrokers'}
            </Text>
            <View style={styles.branchPill}>
              <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.branchText}>
                {user?.dataScope === 'ALL_BRANCHES' ? 'All Branches (HQ)' : branch?.name || 'Main Branch'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setDevSimulatorVisible(true)}
            style={styles.profileBox}
            accessibilityRole="button"
            accessibilityLabel="Open role simulator"
          >
            <Avatar name={user?.name || 'User'} size={42} />
          </Pressable>
        </View>

        {/* User Welcome Banner with Role Badge */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextCol}>
            <Text style={styles.welcomeLabel}>ACTIVE OPERATOR</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <RoleBadge role={role || 'OWNER'} customTitle={user?.customRoleName} />
        </View>

        {/* Quick Operational Actions (Filtered by Permission) */}
        <Text style={styles.sectionHeading}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {canCreateLoan && (
            <Pressable
              onPress={() => router.push('/loans/create')}
              style={({ pressed }) => [styles.actionCard, { opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionCardText}>New Pawn Loan</Text>
            </Pressable>
          )}

          {canCreatePayment && (
            <Pressable
              onPress={() => router.push('/payments/create')}
              style={({ pressed }) => [styles.actionCard, { opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: colors.successLight }]}>
                <Ionicons name="cash" size={24} color={colors.success} />
              </View>
              <Text style={styles.actionCardText}>Accept Payment</Text>
            </Pressable>
          )}

          {canCreateCustomer && (
            <Pressable
              onPress={() => router.push('/customers/create')}
              style={({ pressed }) => [styles.actionCard, { opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="person-add" size={24} color={colors.info} />
              </View>
              <Text style={styles.actionCardText}>New Customer</Text>
            </Pressable>
          )}

          {canViewInventory && (
            <Pressable
              onPress={() => router.push('/inventory')}
              style={({ pressed }) => [styles.actionCard, { opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F3E8F9' }]}>
                <Ionicons name="cube" size={24} color="#7D479C" />
              </View>
              <Text style={styles.actionCardText}>Pledged Vault</Text>
            </Pressable>
          )}
        </View>

        {/* Role-Specific Metric Cards */}
        <Text style={styles.sectionHeading}>OPERATIONAL METRICS</Text>

        {/* OWNER / MANAGER VIEW */}
        {(role === 'OWNER' || role === 'MANAGER') && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Active Loans"
                value={(metrics?.activeLoansCount || 0).toString()}
                subtitle="Active pawn pledges"
                icon={<Ionicons name="cash-outline" size={18} color={colors.primary} />}
                variant="primary"
                onPress={() => router.push('/(tabs)/loans')}
              />
              <StatCard
                title="Today's Collections"
                value={formatINR(metrics?.totalCollectionsToday || 0)}
                subtitle="Counter & UPI"
                icon={<Ionicons name="wallet-outline" size={18} color={colors.success} />}
                variant="success"
                onPress={() => router.push('/(tabs)/payments')}
              />
            </View>

            <View style={styles.statsRow}>
              {canViewFinancials ? (
                <StatCard
                  title="Outstanding Principal"
                  value={formatINR(metrics?.totalOutstandingAmount || 0)}
                  subtitle="Active loan capital"
                  icon={<Ionicons name="trending-up-outline" size={18} color={colors.info} />}
                />
              ) : (
                <StatCard
                  title="Due Soon"
                  value={(metrics?.dueSoonCount || 0).toString()}
                  subtitle="Within 14 days"
                  icon={<Ionicons name="time-outline" size={18} color={colors.warning} />}
                  variant="warning"
                />
              )}

              <StatCard
                title="Vault Collateral"
                value={formatINR(metrics?.totalInventoryPledgedValue || 0)}
                subtitle="48 lockers secured"
                icon={<Ionicons name="shield-outline" size={18} color={colors.textSecondary} />}
                onPress={() => router.push('/inventory')}
              />
            </View>

            {metrics && metrics.overdueLoansCount > 0 && (
              <InfoCard
                title={`${metrics.overdueLoansCount} Overdue Loans Require Attention`}
                message={`Total overdue principal of ${formatINR(metrics.overdueAmount)}. Send reminder notices.`}
                variant="warning"
                icon={<Ionicons name="alert-circle" size={20} color={colors.warning} />}
              />
            )}
          </>
        )}

        {/* CASHIER VIEW */}
        {role === 'CASHIER' && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Today's Collections"
                value={formatINR(metrics?.totalCollectionsToday || 0)}
                subtitle="Daily register"
                icon={<Ionicons name="cash-outline" size={18} color={colors.success} />}
                variant="success"
              />
              <StatCard
                title="Receipts Issued"
                value={(metrics?.paymentsCountToday || 0).toString()}
                subtitle="Successful transactions"
                icon={<Ionicons name="receipt-outline" size={18} color={colors.primary} />}
                variant="primary"
              />
            </View>
            <InfoCard
              title="Counter Terminal #1 Ready"
              message="All issued receipts are cryptographically hashed and logged to branch register."
              variant="info"
              icon={<Ionicons name="checkmark-circle-outline" size={20} color={colors.info} />}
            />
          </>
        )}

        {/* PAWN OFFICER VIEW */}
        {role === 'PAWN_OFFICER' && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Pledges Handled"
                value={(metrics?.activeLoansCount || 0).toString()}
                subtitle="Under management"
                icon={<Ionicons name="scale-outline" size={18} color={colors.primary} />}
                variant="primary"
              />
              <StatCard
                title="Loans Due Soon"
                value={(metrics?.dueSoonCount || 0).toString()}
                subtitle="Upcoming renewals"
                icon={<Ionicons name="time-outline" size={18} color={colors.warning} />}
                variant="warning"
              />
            </View>
            <StatCard
              title="Overdue Notices Required"
              value={(metrics?.overdueLoansCount || 0).toString()}
              subtitle="Collateral notice verification needed"
              icon={<Ionicons name="alert-circle-outline" size={18} color={colors.error} />}
              variant="error"
            />
          </>
        )}

        {/* INVENTORY STAFF VIEW */}
        {role === 'INVENTORY_STAFF' && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Active Lockers"
                value={(metrics?.storageLockerCount || 48).toString()}
                subtitle="Vaults 1, 2 & Town safe"
                icon={<Ionicons name="key-outline" size={18} color={colors.primary} />}
                variant="primary"
              />
              <StatCard
                title="Items In Storage"
                value="6 Pledges"
                subtitle="Verified 916 gold"
                icon={<Ionicons name="cube-outline" size={18} color="#7D479C" />}
              />
            </View>
            <InfoCard
              title="Daily Vault Custody Check"
              message="All 48 lockers locked with dual-key custody protocol verified by Head Appraiser."
              variant="info"
              icon={<Ionicons name="shield-checkmark-outline" size={20} color={colors.info} />}
            />
          </>
        )}

        {/* CUSTOM / APPRAISER VIEW */}
        {role === 'CUSTOM' && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Assigned Appraisals"
                value={(metrics?.activeLoansCount || 0).toString()}
                subtitle="Gold assay checks"
                icon={<Ionicons name="sparkles-outline" size={18} color={colors.primary} />}
                variant="primary"
              />
              <StatCard
                title="Collateral Value"
                value={formatINR(metrics?.totalInventoryPledgedValue || 0)}
                subtitle="Assayed jewelry"
                icon={<Ionicons name="diamond-outline" size={18} color={colors.success} />}
                variant="success"
              />
            </View>
          </>
        )}

        {/* Recent Activity Sections (Filtered by Permission) */}
        {canViewLoans && recentLoans.length > 0 && (
          <View style={styles.activitySection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>RECENT LOANS</Text>
              <Pressable onPress={() => router.push('/(tabs)/loans')}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>

            {recentLoans.map((loan) => (
              <Card
                key={loan.id}
                onPress={() => router.push({ pathname: '/loans/[id]', params: { id: loan.id } })}
                style={styles.activityCard}
              >
                <View style={styles.activityTop}>
                  <View style={styles.activityIdGroup}>
                    <Text style={styles.recordId}>{loan.loanNumber}</Text>
                    <Text style={styles.customerName}>{loan.customerName}</Text>
                  </View>
                  <StatusBadge status={loan.status} size="sm" />
                </View>

                <View style={styles.activityBottom}>
                  <Text style={styles.amountText}>{formatINR(loan.principalAmount)}</Text>
                  <Text style={styles.dateText}>Due: {formatDate(loan.dueDate)}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {canViewPayments && recentPayments.length > 0 && (
          <View style={styles.activitySection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>RECENT PAYMENTS & RECEIPTS</Text>
              <Pressable onPress={() => router.push('/(tabs)/payments')}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>

            {recentPayments.map((pmt) => (
              <Card
                key={pmt.id}
                onPress={() => router.push({ pathname: '/payments/[id]', params: { id: pmt.id } })}
                style={styles.activityCard}
              >
                <View style={styles.activityTop}>
                  <View style={styles.activityIdGroup}>
                    <Text style={styles.recordId}>{pmt.receiptNumber}</Text>
                    <Text style={styles.customerName}>{pmt.customerName}</Text>
                  </View>
                  <View style={styles.modePill}>
                    <Text style={styles.modeText}>{pmt.paymentMethod}</Text>
                  </View>
                </View>

                <View style={styles.activityBottom}>
                  <Text style={styles.paymentAmountText}>+{formatINR(pmt.amount)}</Text>
                  <Text style={styles.dateText}>{formatDate(pmt.paymentDate)}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
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
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shopIdentity: {
    flex: 1,
    marginRight: spacing.sm,
  },
  shopName: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  branchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  branchText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  profileBox: {
    padding: 2,
  },
  welcomeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  welcomeTextCol: {
    flex: 1,
  },
  welcomeLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: 2,
  },
  sectionHeading: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionCardText: {
    ...typography.captionBold,
    color: colors.text,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  activitySection: {
    marginTop: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  viewAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  activityCard: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  activityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activityIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recordId: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  customerName: {
    ...typography.secondary,
    color: colors.text,
  },
  activityBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paymentAmountText: {
    ...typography.bodyBold,
    color: colors.success,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  modePill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  modeText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
});
