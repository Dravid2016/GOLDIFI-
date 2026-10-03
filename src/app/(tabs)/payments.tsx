/**
 * Goldifi Cash Counter & Payments Screen
 * Real-time payment ledger, collection breakdown, and receipt inspection.
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
import { paymentService } from '../../services/paymentService';
import { SearchInput } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { EmptyState, LoadingState, AccessDeniedState } from '../../components/ui/States';
import { ScreenHeader } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../../types';

export default function PaymentsScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canView = hasPermission('PAYMENTS_VIEW');
  const canCreate = hasPermission('PAYMENTS_CREATE');

  const loadPayments = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      const data = await paymentService.getPayments(user, { query: searchQuery });
      setPayments(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, searchQuery, canView]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Payments & Collections" />
        <AccessDeniedState
          requiredPermission="PAYMENTS_VIEW"
          message="Your account is not permitted to access daily payment records or cashier counter transactions."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Payments"
        subtitle={`Total Collected: ${formatINR(totalCollected)}`}
        rightAction={
          canCreate ? (
            <Button
              title="Collect"
              size="sm"
              leftIcon={<Ionicons name="add" size={16} color={colors.white} />}
              onPress={() => router.push('/payments/create')}
            />
          ) : undefined
        }
      />

      <View style={styles.searchBarWrapper}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by receipt # or customer..."
        />
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Loading payment transactions..." />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No Payments Recorded"
          message={searchQuery ? `No receipt matching "${searchQuery}".` : 'No payments collected today.'}
          iconName="receipt-outline"
          actionTitle={canCreate ? 'Accept First Payment' : undefined}
          onAction={canCreate ? () => router.push('/payments/create') : undefined}
        />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push({ pathname: '/payments/[id]', params: { id: item.id } })}
              style={styles.paymentCard}
            >
              <View style={styles.cardHeader}>
                <View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptNum}>{item.receiptNumber}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{item.paymentType}</Text>
                    </View>
                  </View>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.loanRefText}>Loan: {item.loanNumber}</Text>
                </View>

                <View style={styles.amountBox}>
                  <Text style={styles.amountVal}>+{formatINR(item.amount)}</Text>
                  <View style={styles.modeBadge}>
                    <Ionicons
                      name={item.paymentMethod === 'UPI' ? 'qr-code-outline' : 'cash-outline'}
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.modeText}>{item.paymentMethod}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.cashierText}>Cashier: {item.cashierName}</Text>
                </View>
                <Text style={styles.dateText}>{formatDateTime(item.paymentDate)}</Text>
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
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  listContent: {
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  paymentCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  receiptNum: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  typeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  typeText: {
    ...typography.badge,
    fontSize: 9,
    color: colors.primaryDark,
  },
  customerName: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: 2,
  },
  loanRefText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountVal: {
    ...typography.bodyBold,
    color: colors.success,
    fontSize: 18,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: 4,
    gap: 3,
  },
  modeText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
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
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashierText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
