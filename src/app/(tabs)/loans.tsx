/**
 * Goldifi Pawn Loans Directory Screen
 * Search, status filtering, collateral appraisal details, and loan lifecycle tracking.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
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
import { loanService } from '../../services/loanService';
import { SearchInput } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState, AccessDeniedState } from '../../components/ui/States';
import { ScreenHeader } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Loan, LoanStatus } from '../../types';

const STATUS_FILTERS: { key: LoanStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Loans' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'DUE_SOON', label: 'Due Soon' },
  { key: 'OVERDUE', label: 'Overdue' },
  { key: 'CLOSED', label: 'Closed' },
];

export default function LoansScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canView = hasPermission('LOANS_VIEW');
  const canCreate = hasPermission('LOANS_CREATE');

  const loadLoans = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      const data = await loanService.getLoans(user, {
        status: selectedStatus,
        query: searchQuery,
      });
      setLoans(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, selectedStatus, searchQuery, canView]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Pawn Loans" />
        <AccessDeniedState
          requiredPermission="LOANS_VIEW"
          message="Your account does not possess LOANS_VIEW permission to inspect loan agreements or pledged financial schedules."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Pawn Loans"
        subtitle={`${loans.length} loans in scope`}
        rightAction={
          canCreate ? (
            <Button
              title="Issue Loan"
              size="sm"
              leftIcon={<Ionicons name="add" size={16} color={colors.white} />}
              onPress={() => router.push('/loans/create')}
            />
          ) : undefined
        }
      />

      <View style={styles.searchBarWrapper}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by loan # or customer..."
        />
      </View>

      {/* Status Filter Horizontal Tabs */}
      <View style={styles.filterTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map((f) => {
            const isSelected = selectedStatus === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setSelectedStatus(f.key)}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Loading pawn loans portfolio..." />
      ) : loans.length === 0 ? (
        <EmptyState
          title="No Loans Found"
          message={
            searchQuery
              ? `No loan matching "${searchQuery}" was found.`
              : selectedStatus !== 'ALL'
              ? `No loans currently marked as ${selectedStatus}.`
              : 'No loans registered yet.'
          }
          iconName="cash-outline"
          actionTitle={canCreate ? 'Disburse New Loan' : undefined}
          onAction={canCreate ? () => router.push('/loans/create') : undefined}
        />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push({ pathname: '/loans/[id]', params: { id: item.id } })}
              style={styles.loanCard}
            >
              <View style={styles.cardHeader}>
                <View>
                  <View style={styles.loanNumberRow}>
                    <Text style={styles.loanNumber}>{item.loanNumber}</Text>
                    <StatusBadge status={item.status} size="sm" />
                  </View>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                </View>

                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Principal</Text>
                  <Text style={styles.amountVal}>{formatINR(item.principalAmount)}</Text>
                </View>
              </View>

              {/* Pledged Item Summary */}
              {item.items.length > 0 && (
                <View style={styles.collateralBox}>
                  <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
                  <Text style={styles.collateralText} numberOfLines={1}>
                    {item.items[0].description} ({item.items[0].purityKarat || '22K'})
                  </Text>
                </View>
              )}

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Interest Rate</Text>
                  <Text style={styles.footerVal}>{item.annualInterestRate}% p.a.</Text>
                </View>

                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Due Date</Text>
                  <Text
                    style={[
                      styles.footerVal,
                      item.status === 'OVERDUE' && { color: colors.error, fontWeight: '700' },
                    ]}
                  >
                    {formatDate(item.dueDate)}
                  </Text>
                </View>

                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Branch</Text>
                  <Text style={styles.footerVal} numberOfLines={1}>{item.branchName}</Text>
                </View>
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
  searchBarWrapper: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  filterTabsContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterScroll: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  loanCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  loanNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  loanNumber: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  customerName: {
    ...typography.secondary,
    color: colors.text,
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amountVal: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 17,
  },
  collateralBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  collateralText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing.xs,
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  footerVal: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
