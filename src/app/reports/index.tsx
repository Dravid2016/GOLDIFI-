/**
 * Goldifi Mobile Reports & Analytics Screen
 * Touch-friendly summary metrics, visual breakdown bars, and branch performance.
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { reportService, CollectionsReport, LoanPortfolioReport } from '../../services/reportService';
import { ScreenHeader } from '../../components/ui/Header';
import { Card, StatCard } from '../../components/ui/Card';
import { LoadingState, AccessDeniedState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [collections, setCollections] = useState<CollectionsReport | null>(null);
  const [portfolio, setPortfolio] = useState<LoanPortfolioReport | null>(null);
  const [loading, setLoading] = useState(true);

  const canViewReports = hasPermission('REPORTS_VIEW');

  useEffect(() => {
    async function load() {
      if (!canViewReports) {
        setLoading(false);
        return;
      }
      try {
        const [c, p] = await Promise.all([
          reportService.getCollectionsReport(user),
          reportService.getPortfolioReport(user),
        ]);
        setCollections(c);
        setPortfolio(p);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, canViewReports]);

  if (!canViewReports) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Reports & Analytics" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="REPORTS_VIEW"
          message="Your account does not possess REPORTS_VIEW permission to inspect operational analytics or shop collections."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Reports & Analytics" onBack={() => router.back()} />
        <LoadingState message="Aggregating branch metrics..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Reports & Analytics"
        subtitle="Operational Performance"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Collections Overview */}
        <Text style={styles.sectionHeader}>COLLECTIONS SUMMARY</Text>
        <View style={styles.statsRow}>
          <StatCard
            title="Today's Total"
            value={formatINR(collections?.todayTotal || 0)}
            subtitle="Counter + UPI"
            icon={<Ionicons name="cash-outline" size={16} color={colors.success} />}
            variant="success"
          />
          <StatCard
            title="This Month"
            value={formatINR(collections?.thisMonthTotal || 0)}
            subtitle="MTD collections"
            icon={<Ionicons name="calendar-outline" size={16} color={colors.primary} />}
            variant="primary"
          />
        </View>

        {/* Collections Breakdown by Payment Channel */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.cardHeading}>Collections by Channel</Text>
          {collections?.byPaymentMode.map((item) => (
            <View key={item.mode} style={styles.channelRow}>
              <View style={styles.channelHeader}>
                <Text style={styles.channelName}>{item.mode}</Text>
                <Text style={styles.channelAmount}>{formatINR(item.amount)} ({item.percentage}%)</Text>
              </View>
              {/* Visual Progress Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor:
                        item.mode.includes('UPI')
                          ? colors.primary
                          : item.mode.includes('Cash')
                          ? colors.success
                          : colors.info,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card>

        {/* Loan Portfolio Quality */}
        <Text style={styles.sectionHeader}>LOAN PORTFOLIO HEALTH</Text>
        <View style={styles.statsRow}>
          <StatCard
            title="Active Principal"
            value={formatINR(portfolio?.totalActivePrincipal || 0)}
            subtitle="Lending exposure"
            icon={<Ionicons name="pie-chart-outline" size={16} color={colors.info} />}
          />
          <StatCard
            title="Overdue Ratio"
            value={`${portfolio?.overduePercentage || 0}%`}
            subtitle="Portfolio at risk"
            icon={<Ionicons name="alert-circle-outline" size={16} color={colors.warning} />}
            variant="warning"
          />
        </View>

        {/* Collateral Asset Class Distribution */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.cardHeading}>Pledge Value by Asset Class</Text>
          {portfolio?.byCategory.map((cat) => (
            <View key={cat.category} style={styles.catRow}>
              <View style={styles.catIconBox}>
                <Ionicons name="sparkles" size={16} color={colors.primary} />
              </View>
              <View style={styles.catCol}>
                <Text style={styles.catName}>{cat.category}</Text>
                <Text style={styles.catCount}>{cat.count} pledged articles</Text>
              </View>
              <Text style={styles.catValue}>{formatINR(cat.totalValue)}</Text>
            </View>
          ))}
        </Card>

        {/* Branch Performance Comparison */}
        <Text style={styles.sectionHeader}>BRANCH PERFORMANCE</Text>
        <Card style={styles.breakdownCard}>
          {collections?.byBranch.map((b, i) => (
            <View key={b.branch} style={[styles.branchRow, i > 0 && styles.branchRowBorder]}>
              <View>
                <Text style={styles.branchName}>{b.branch}</Text>
                <Text style={styles.branchMeta}>Chennai Metropolitan Area</Text>
              </View>
              <Text style={styles.branchCollected}>{formatINR(b.amount)}</Text>
            </View>
          ))}
        </Card>
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  breakdownCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeading: {
    ...typography.secondaryBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  channelRow: {
    marginBottom: spacing.sm,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  channelName: {
    ...typography.secondary,
    color: colors.text,
  },
  channelAmount: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  catIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  catCol: {
    flex: 1,
  },
  catName: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  catCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  catValue: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  branchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  branchRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  branchName: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  branchMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  branchCollected: {
    ...typography.bodyBold,
    color: colors.success,
  },
});
