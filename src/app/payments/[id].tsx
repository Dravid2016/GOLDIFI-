/**
 * Goldifi Payment Transaction Detail Screen
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
import { paymentService } from '../../services/paymentService';
import { ScreenHeader } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../../types';

export default function PaymentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const canPrintReceipt = hasPermission('PRINT_RECEIPT');

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      try {
        const p = await paymentService.getPaymentById(id);
        setPayment(p);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Payment Record" onBack={() => router.back()} />
        <LoadingState message="Fetching receipt details..." />
      </SafeAreaView>
    );
  }

  if (!payment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Payment Record" onBack={() => router.back()} />
        <EmptyState
          title="Payment Not Found"
          message="No transaction record found with this receipt number."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={payment.receiptNumber}
        subtitle={formatDateTime(payment.paymentDate)}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Amount Card */}
        <Card style={styles.amountCard}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={40} color={colors.success} />
          </View>
          <Text style={styles.receiptAmount}>{formatINR(payment.amount)}</Text>
          <Text style={styles.paymentStatusText}>PAYMENT COMPLETED</Text>

          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{payment.paymentType} REPAYMENT</Text>
          </View>
        </Card>

        {/* Receipt Action Button */}
        {canPrintReceipt && (
          <Button
            title="View & Print Official Receipt"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={colors.white} />}
            onPress={() => router.push({ pathname: '/payments/receipt', params: { id: payment.id } })}
            style={styles.printBtn}
          />
        )}

        {/* Ledger Details */}
        <Text style={styles.sectionTitle}>TRANSACTION DETAILS</Text>
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Receipt Number</Text>
            <Text style={styles.detailValBold}>{payment.receiptNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Account</Text>
            <Text style={styles.detailValPrimary}>{payment.loanNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer Name</Text>
            <Text style={styles.detailVal}>{payment.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailVal}>{payment.paymentMethod}</Text>
          </View>
          {payment.referenceNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference No.</Text>
              <Text style={styles.detailVal}>{payment.referenceNumber}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Collecting Cashier</Text>
            <Text style={styles.detailVal}>{payment.cashierName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Branch</Text>
            <Text style={styles.detailVal}>{payment.branchName}</Text>
          </View>
        </Card>

        {/* Component Breakdown */}
        <Text style={styles.sectionTitle}>AMOUNT BREAKDOWN</Text>
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interest Component</Text>
            <Text style={styles.detailVal}>{formatINR(payment.interestComponent)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Principal Component</Text>
            <Text style={styles.detailVal}>{formatINR(payment.principalComponent)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Penalty / Late Fee</Text>
            <Text style={styles.detailVal}>{formatINR(payment.penaltyFee)}</Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Received</Text>
            <Text style={styles.totalVal}>{formatINR(payment.amount)}</Text>
          </View>
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
  amountCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  successIconBox: {
    marginBottom: spacing.xs,
  },
  receiptAmount: {
    ...typography.display,
    color: colors.success,
    fontSize: 32,
  },
  paymentStatusText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: spacing.xxs,
  },
  typeBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  typeText: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textSecondary,
  },
  printBtn: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  detailsCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  detailVal: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  detailValBold: {
    ...typography.secondaryBold,
    color: colors.charcoal,
  },
  detailValPrimary: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: spacing.sm,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalVal: {
    ...typography.bodyBold,
    color: colors.success,
  },
});
