/**
 * Goldifi Official Payment Receipt Voucher Screen
 * Formal printable counter voucher with pawnbroker seal, tax registration, and signature lines.
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
import { paymentService } from '../../services/paymentService';
import { ScreenHeader } from '../../components/ui/Header';
import { Button, SecondaryButton } from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../../types';

export default function ReceiptPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const p = await paymentService.getPaymentById(id);
        setPayment(p);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handlePrint = () => {
    setPrinted(true);
    // In production, would trigger native Bluetooth POS printer or PDF print sheet
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Receipt Voucher" onBack={() => router.back()} />
        <LoadingState message="Generating printable voucher..." />
      </SafeAreaView>
    );
  }

  if (!payment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Receipt Voucher" onBack={() => router.back()} />
        <EmptyState
          title="Receipt Not Found"
          message="Transaction record could not be retrieved for printing."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Payment Receipt"
        subtitle={payment.receiptNumber}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Physical Voucher Card (Paper Look) */}
        <View style={styles.voucherContainer}>
          {/* Voucher Header */}
          <View style={styles.voucherHeader}>
            <View style={styles.brandEmblem}>
              <Text style={styles.brandG}>G</Text>
            </View>
            <Text style={styles.voucherShopName}>KUMAR PAWNBROKERS</Text>
            <Text style={styles.voucherLegal}>Pawn & Jewelry Financial Services</Text>
            <Text style={styles.voucherAddress}>42, Bazaar Street, George Town, Chennai - 600001</Text>
            <Text style={styles.voucherTax}>Reg: PB-TN-CHN-2012-88492 • GSTIN: 33AABCK8821N1ZM</Text>
          </View>

          <View style={styles.dashDivider} />

          {/* Receipt Info */}
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Receipt No:</Text>
              <Text style={styles.metaValBold}>{payment.receiptNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Date & Time:</Text>
              <Text style={styles.metaVal}>{formatDateTime(payment.paymentDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Branch:</Text>
              <Text style={styles.metaVal}>{payment.branchName}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Loan Account:</Text>
              <Text style={styles.metaValBold}>{payment.loanNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Customer:</Text>
              <Text style={styles.metaVal}>{payment.customerName}</Text>
            </View>
          </View>

          <View style={styles.dashDivider} />

          {/* Line Items */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeadDesc}>DESCRIPTION</Text>
            <Text style={styles.tableHeadAmount}>AMOUNT</Text>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.descCol}>
              <Text style={styles.itemTitle}>{payment.paymentType} Repayment</Text>
              <Text style={styles.itemSub}>Via {payment.paymentMethod}</Text>
              {payment.referenceNumber && (
                <Text style={styles.itemRef}>Ref: {payment.referenceNumber}</Text>
              )}
            </View>
            <Text style={styles.itemAmount}>{formatINR(payment.amount)}</Text>
          </View>

          <View style={styles.dashDivider} />

          {/* Totals */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL RECEIVED</Text>
            <Text style={styles.totalAmount}>{formatINR(payment.amount)}</Text>
          </View>

          {/* Signatures */}
          <View style={styles.signatureRow}>
            <View style={styles.sigBox}>
              <Text style={styles.sigStaff}>{payment.cashierName}</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Authorized Cashier</Text>
            </View>

            <View style={styles.sigBox}>
              <View style={styles.sigLinePlaceholder} />
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Customer Signature</Text>
            </View>
          </View>

          <View style={styles.voucherFooter}>
            <Text style={styles.footerNote}>
              This is a computer generated legal receipt issued under Tamil Nadu Pawnbrokers Act.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            title={printed ? 'Print Copy Again' : 'Print Receipt to POS Printer'}
            leftIcon={<Ionicons name="print-outline" size={18} color={colors.white} />}
            onPress={handlePrint}
            style={styles.actionBtn}
          />
          <SecondaryButton
            title="Done / Return"
            onPress={() => router.replace('/(tabs)/payments')}
            style={styles.actionBtn}
          />
        </View>
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
    paddingVertical: spacing.md,
    paddingBottom: spacing.huge,
  },
  voucherContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#323031',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  voucherHeader: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandEmblem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandG: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 20,
  },
  voucherShopName: {
    ...typography.sectionTitle,
    color: colors.text,
    letterSpacing: 1,
  },
  voucherLegal: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: 1,
  },
  voucherAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  voucherTax: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  dashDivider: {
    height: 1,
    borderWidth: 0.8,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  metaGrid: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaKey: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaVal: {
    ...typography.caption,
    color: colors.text,
  },
  metaValBold: {
    ...typography.captionBold,
    color: colors.text,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  tableHeadDesc: {
    ...typography.badge,
    color: colors.textMuted,
  },
  tableHeadAmount: {
    ...typography.badge,
    color: colors.textMuted,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  descCol: {
    flex: 1,
  },
  itemTitle: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  itemSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  itemRef: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  itemAmount: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  totalAmount: {
    ...typography.display,
    color: colors.primary,
    fontSize: 26,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  sigBox: {
    width: '45%',
    alignItems: 'center',
  },
  sigStaff: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: 4,
  },
  sigLinePlaceholder: {
    height: 18,
  },
  sigLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.charcoal,
    marginBottom: 4,
  },
  sigLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  voucherFooter: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.xs,
  },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 12,
  },
  actionsBox: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
