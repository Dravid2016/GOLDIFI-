/**
 * Goldifi Customer Profile Screen
 * Detailed KYC, borrower stats, active & closed loans, and pledged ornaments.
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { loanService } from '../../services/loanService';
import { paymentService } from '../../services/paymentService';
import { ScreenHeader } from '../../components/ui/Header';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, StatCard } from '../../components/ui/Card';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Customer, Loan, Payment } from '../../types';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const canViewLoans = hasPermission('LOANS_VIEW');
  const canViewPayments = hasPermission('PAYMENTS_VIEW');

  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      try {
        const [c, l, p] = await Promise.all([
          customerService.getCustomerById(id),
          canViewLoans ? loanService.getLoans(user, { customerId: id }) : Promise.resolve([]),
          canViewPayments ? paymentService.getPayments(user, { customerId: id }) : Promise.resolve([]),
        ]);
        setCustomer(c);
        setLoans(l);
        setPayments(p);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id, user, canViewLoans, canViewPayments]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Customer Profile" onBack={() => router.back()} />
        <LoadingState message="Fetching borrower profile..." />
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Customer Profile" onBack={() => router.back()} />
        <EmptyState
          title="Customer Not Found"
          message="No customer was found matching the requested identifier."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={customer.name}
        subtitle={customer.customerId}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.topProfileRow}>
            <Avatar name={customer.name} size={60} />
            <View style={styles.profileTextCol}>
              <Text style={styles.profileName}>{customer.name}</Text>
              <Text style={styles.profileId}>{customer.customerId}</Text>
              <View style={styles.statusRow}>
                <StatusBadge status={customer.status} size="sm" />
                <Text style={styles.joinedText}>Member since {formatDate(customer.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* Quick Contact Bar */}
          <View style={styles.contactBar}>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.contactText}>{customer.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
              <Text style={styles.contactText} numberOfLines={1}>{customer.email}</Text>
            </View>
          </View>
        </Card>

        {/* Financial Portfolio Summary */}
        <Text style={styles.sectionTitle}>FINANCIAL SUMMARY</Text>
        <View style={styles.statsRow}>
          <StatCard
            title="Outstanding"
            value={formatINR(customer.currentOutstandingAmount)}
            subtitle="Current pledge liability"
            icon={<Ionicons name="wallet-outline" size={16} color={colors.primary} />}
            variant="primary"
          />
          <StatCard
            title="Total Borrowed"
            value={formatINR(customer.totalBorrowedAmount)}
            subtitle={`${customer.totalLoansCount} Lifetime loans`}
            icon={<Ionicons name="trending-up-outline" size={16} color={colors.textSecondary} />}
          />
        </View>

        {/* KYC & Identity Information */}
        <Text style={styles.sectionTitle}>KYC & ADDRESS</Text>
        <Card style={styles.kycCard}>
          <View style={styles.kycRow}>
            <Text style={styles.kycLabel}>Govt ID Type</Text>
            <Text style={styles.kycVal}>{customer.governmentIdType}</Text>
          </View>
          <View style={styles.kycRow}>
            <Text style={styles.kycLabel}>Govt ID Number</Text>
            <Text style={styles.kycVal}>{customer.governmentIdNumber}</Text>
          </View>
          <View style={styles.kycRow}>
            <Text style={styles.kycLabel}>Address</Text>
            <Text style={styles.kycVal} numberOfLines={2}>
              {customer.address}, {customer.city} - {customer.pincode}
            </Text>
          </View>
        </Card>

        {/* Pawn Loans by this customer */}
        {canViewLoans && (
          <>
            <Text style={styles.sectionTitle}>LOAN HISTORY ({loans.length})</Text>
            {loans.length === 0 ? (
              <Text style={styles.emptyNotice}>No loans found for this customer.</Text>
            ) : (
              loans.map((loan) => (
                <Card
                  key={loan.id}
                  onPress={() => router.push({ pathname: '/loans/[id]', params: { id: loan.id } })}
                  style={styles.loanItemCard}
                >
                  <View style={styles.loanItemTop}>
                    <Text style={styles.loanNum}>{loan.loanNumber}</Text>
                    <StatusBadge status={loan.status} size="sm" />
                  </View>
                  <View style={styles.loanItemBottom}>
                    <Text style={styles.loanItemAmount}>{formatINR(loan.principalAmount)}</Text>
                    <Text style={styles.loanItemDate}>Due: {formatDate(loan.dueDate)}</Text>
                  </View>
                </Card>
              ))
            )}
          </>
        )}

        {/* Payment History */}
        {canViewPayments && (
          <>
            <Text style={styles.sectionTitle}>RECENT RECEIPTS ({payments.length})</Text>
            {payments.length === 0 ? (
              <Text style={styles.emptyNotice}>No payment receipts recorded yet.</Text>
            ) : (
              payments.map((p) => (
                <Card
                  key={p.id}
                  onPress={() => router.push({ pathname: '/payments/[id]', params: { id: p.id } })}
                  style={styles.loanItemCard}
                >
                  <View style={styles.loanItemTop}>
                    <Text style={styles.loanNum}>{p.receiptNumber}</Text>
                    <Text style={styles.payType}>{p.paymentType}</Text>
                  </View>
                  <View style={styles.loanItemBottom}>
                    <Text style={styles.payAmount}>+{formatINR(p.amount)}</Text>
                    <Text style={styles.loanItemDate}>{formatDate(p.paymentDate)}</Text>
                  </View>
                </Card>
              ))
            )}
          </>
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
    paddingBottom: spacing.huge,
  },
  profileCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileTextCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  profileId: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  joinedText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  contactBar: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contactText: {
    ...typography.secondary,
    color: colors.text,
    flex: 1,
  },
  sectionTitle: {
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
  kycCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  kycLabel: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  kycVal: {
    ...typography.secondaryBold,
    color: colors.text,
    maxWidth: 200,
    textAlign: 'right',
  },
  emptyNotice: {
    ...typography.secondary,
    color: colors.textMuted,
    marginVertical: spacing.xs,
  },
  loanItemCard: {
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  loanItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loanNum: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  payType: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textSecondary,
  },
  loanItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanItemAmount: {
    ...typography.bodyBold,
    color: colors.text,
  },
  payAmount: {
    ...typography.bodyBold,
    color: colors.success,
  },
  loanItemDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
