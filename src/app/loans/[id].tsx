/**
 * Goldifi Loan Detail Screen
 * Collateral item valuation, repayment schedule, settlement & closure confirmation.
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
import { loanService } from '../../services/loanService';
import { paymentService } from '../../services/paymentService';
import { ScreenHeader } from '../../components/ui/Header';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, StatCard } from '../../components/ui/Card';
import { Button, SecondaryButton } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/Modal';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatINR, formatGrams } from '../../utils/currency';
import { formatDate, formatDateTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Loan, Payment } from '../../types';

export default function LoanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closing, setClosing] = useState(false);

  const canCloseLoan = hasPermission('LOANS_CLOSE');
  const canCreatePayment = hasPermission('PAYMENTS_CREATE');
  const canChangeRate = hasPermission('CHANGE_INTEREST_RATE');

  useEffect(() => {
    async function fetchLoan() {
      if (!id) return;
      try {
        const [l, p] = await Promise.all([
          loanService.getLoanById(id),
          paymentService.getPayments(user, { loanId: id }),
        ]);
        setLoan(l);
        setPayments(p);
      } finally {
        setLoading(false);
      }
    }
    fetchLoan();
  }, [id, user]);

  const handleConfirmClose = async () => {
    if (!loan) return;
    setClosing(true);
    try {
      const updated = await loanService.closeLoan(
        loan.id,
        `Redeemed and released by ${user?.name || 'Authorized Staff'}`
      );
      if (updated) {
        setLoan({ ...updated });
      }
      setShowCloseModal(false);
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Loan Agreement" onBack={() => router.back()} />
        <LoadingState message="Fetching pledge records..." />
      </SafeAreaView>
    );
  }

  if (!loan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Loan Agreement" onBack={() => router.back()} />
        <EmptyState
          title="Loan Not Found"
          message="The requested loan record could not be retrieved."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={loan.loanNumber}
        subtitle={`${loan.customerName} • ${loan.branchName}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLoanId}>{loan.loanNumber}</Text>
              <Text style={styles.summaryCustomer}>{loan.customerName}</Text>
            </View>
            <StatusBadge status={loan.status} />
          </View>

          <View style={styles.principalBox}>
            <Text style={styles.principalLabel}>SANCTIONED PRINCIPAL</Text>
            <Text style={styles.principalAmount}>{formatINR(loan.principalAmount)}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaKey}>Interest Rate</Text>
              <Text style={styles.metaVal}>{loan.annualInterestRate}% p.a.</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaKey}>Monthly Interest</Text>
              <Text style={styles.metaVal}>{formatINR(loan.monthlyInterestAmount)}/mo</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaKey}>Due Date</Text>
              <Text style={[styles.metaVal, loan.status === 'OVERDUE' && { color: colors.error }]}>
                {formatDate(loan.dueDate)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Operational Actions */}
        <View style={styles.actionsRow}>
          {canCreatePayment && loan.status !== 'CLOSED' && (
            <Button
              title="Collect Payment"
              leftIcon={<Ionicons name="cash-outline" size={16} color={colors.white} />}
              onPress={() => router.push({ pathname: '/payments/create', params: { loanId: loan.id } })}
              style={styles.actionBtn}
            />
          )}

          {canCloseLoan && loan.status !== 'CLOSED' && (
            <SecondaryButton
              title="Close & Release"
              leftIcon={<Ionicons name="checkmark-done-outline" size={16} color={colors.text} />}
              onPress={() => setShowCloseModal(true)}
              style={styles.actionBtn}
            />
          )}
        </View>

        {/* Pledged Items / Collateral */}
        <Text style={styles.sectionTitle}>PLEDGED COLLATERAL ({loan.items.length})</Text>
        {loan.items.map((item, index) => (
          <Card key={item.id || index} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemIconBox}>
                <Ionicons name="sparkles" size={18} color={colors.primary} />
              </View>
              <View style={styles.itemTitleCol}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPurity}>Purity: {item.purityKarat || '22K (916)'}</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.itemSpecsGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Gross Weight</Text>
                <Text style={styles.specVal}>{formatGrams(item.grossWeightGrams)}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Net Gold</Text>
                <Text style={styles.specVal}>{formatGrams(item.netWeightGrams)}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Est. Market Value</Text>
                <Text style={styles.specValHighlight}>{formatINR(item.estimatedMarketValue)}</Text>
              </View>
            </View>

            <View style={styles.lockerRow}>
              <Ionicons name="lock-closed-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.lockerText}>Storage: {item.storageLocation}</Text>
            </View>
          </Card>
        ))}

        {/* Notes & Verification */}
        {loan.notes && (
          <>
            <Text style={styles.sectionTitle}>APPRAISAL REMARKS</Text>
            <Card style={styles.remarksCard}>
              <Text style={styles.remarksText}>{loan.notes}</Text>
              <View style={styles.officerRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.officerText}>Assigned Officer: {loan.assignedOfficerName}</Text>
              </View>
            </Card>
          </>
        )}

        {/* Repayment History */}
        <Text style={styles.sectionTitle}>PAYMENT HISTORY ({payments.length})</Text>
        {payments.length === 0 ? (
          <Text style={styles.emptyNotice}>No repayment vouchers recorded for this loan.</Text>
        ) : (
          payments.map((p) => (
            <Card
              key={p.id}
              onPress={() => router.push({ pathname: '/payments/[id]', params: { id: p.id } })}
              style={styles.paymentCard}
            >
              <View style={styles.paymentTop}>
                <Text style={styles.payReceipt}>{p.receiptNumber}</Text>
                <Text style={styles.payAmount}>+{formatINR(p.amount)}</Text>
              </View>
              <View style={styles.paymentBottom}>
                <Text style={styles.payMode}>{p.paymentType} • {p.paymentMethod}</Text>
                <Text style={styles.payDate}>{formatDate(p.paymentDate)}</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Close Loan Confirmation Modal */}
      <ConfirmationModal
        visible={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        onConfirm={handleConfirmClose}
        title="Redeem & Close Loan"
        message="This will mark the loan as fully paid and authorize the release of pledged gold collateral to the borrower."
        affectedRecord={`${loan.loanNumber} (${loan.customerName})`}
        consequence="All associated pledged jewelry items in Vault Storage will be marked as RELEASED."
        confirmLabel="Authorize Redemption"
        loading={closing}
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
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  summaryLoanId: {
    ...typography.captionBold,
    color: colors.primary,
  },
  summaryCustomer: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  principalBox: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginVertical: spacing.xs,
  },
  principalLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  principalAmount: {
    ...typography.display,
    color: colors.text,
    fontSize: 28,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  metaCol: {
    flex: 1,
  },
  metaKey: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metaVal: {
    ...typography.secondaryBold,
    color: colors.text,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  itemCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  itemTitleCol: {
    flex: 1,
  },
  itemDescription: {
    ...typography.bodyBold,
    color: colors.text,
  },
  itemPurity: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  itemSpecsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  specVal: {
    ...typography.secondaryBold,
    color: colors.text,
    marginTop: 1,
  },
  specValHighlight: {
    ...typography.secondaryBold,
    color: colors.primary,
    marginTop: 1,
  },
  lockerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    gap: 4,
  },
  lockerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  remarksCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  remarksText: {
    ...typography.secondary,
    color: colors.text,
    lineHeight: 20,
  },
  officerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  officerText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  emptyNotice: {
    ...typography.secondary,
    color: colors.textMuted,
    marginVertical: spacing.xs,
  },
  paymentCard: {
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  paymentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payReceipt: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  payAmount: {
    ...typography.bodyBold,
    color: colors.success,
  },
  paymentBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  payMode: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  payDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
