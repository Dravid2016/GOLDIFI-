/**
 * Goldifi Accept Payment Screen
 * Record counter collections, interest/principal installments, and generate receipt.
 */

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { loanService } from '../../services/loanService';
import { ScreenHeader } from '../../components/ui/Header';
import { Input, AmountInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AccessDeniedState } from '../../components/ui/States';
import { formatINR } from '../../utils/currency';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Loan, PaymentMethod, PaymentType } from '../../types';

const PAYMENT_TYPES: PaymentType[] = ['INTEREST', 'PRINCIPAL', 'RENEWAL', 'CLOSURE'];
const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'];

export default function CreatePaymentScreen() {
  const { loanId } = useLocalSearchParams<{ loanId?: string }>();
  const router = useRouter();
  const { user, branch, hasPermission, setDevSimulatorVisible } = useAuth();

  const canCreate = hasPermission('PAYMENTS_CREATE');

  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('INTEREST');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [amount, setAmount] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await loanService.getLoans(user, { status: 'ALL' });
      const activeOnly = data.filter((l) => l.status !== 'CLOSED');
      setLoans(activeOnly);

      if (loanId) {
        const found = activeOnly.find((l) => l.id === loanId);
        if (found) {
          setSelectedLoan(found);
          setAmount(found.monthlyInterestAmount.toString());
        }
      } else if (activeOnly.length > 0) {
        setSelectedLoan(activeOnly[0]);
        setAmount(activeOnly[0].monthlyInterestAmount.toString());
      }
    }
    load();
  }, [user, loanId]);

  const handleSelectLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    if (paymentType === 'INTEREST') {
      setAmount(loan.monthlyInterestAmount.toString());
    } else if (paymentType === 'CLOSURE') {
      setAmount(loan.outstandingBalance.toString());
    }
  };

  const handleTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    if (!selectedLoan) return;
    if (type === 'INTEREST') {
      setAmount(selectedLoan.monthlyInterestAmount.toString());
    } else if (type === 'CLOSURE') {
      setAmount(selectedLoan.outstandingBalance.toString());
    }
  };

  if (!canCreate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Accept Payment" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="PAYMENTS_CREATE"
          message="Your account role does not have authorization to accept customer payments or issue receipts."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedLoan) errs.loan = 'Please select a loan account';
    const num = parseFloat(amount);
    if (!num || num <= 0) errs.amount = 'Please enter a valid payment amount';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedLoan) return;
    setSubmitting(true);
    try {
      const pmtAmount = parseFloat(amount);
      const isInterest = paymentType === 'INTEREST';

      const payment = await paymentService.createPayment({
        loanId: selectedLoan.id,
        loanNumber: selectedLoan.loanNumber,
        customerId: selectedLoan.customerId,
        customerName: selectedLoan.customerName,
        branchId: selectedLoan.branchId || branch?.id || 'branch-main',
        branchName: selectedLoan.branchName || 'Main Branch',
        amount: pmtAmount,
        principalComponent: isInterest ? 0 : pmtAmount,
        interestComponent: isInterest ? pmtAmount : 0,
        penaltyFee: 0,
        paymentType,
        paymentMethod,
        referenceNumber: refNumber || undefined,
        cashierId: user?.id || 'user-cashier-04',
        cashierName: user?.name || 'Priya Sundaram',
        notes: notes || `${paymentType} collection via ${paymentMethod}`,
      });

      router.replace({ pathname: '/payments/receipt', params: { id: payment.id } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Accept Payment"
        subtitle="Cash Counter Entry"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Select Loan Account */}
          <Text style={styles.sectionHeader}>SELECT LOAN ACCOUNT *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.loanChipScroll}>
            {loans.map((l) => {
              const isSelected = selectedLoan?.id === l.id;
              return (
                <Pressable
                  key={l.id}
                  onPress={() => handleSelectLoan(l)}
                  style={[styles.loanChip, isSelected && styles.loanChipSelected]}
                >
                  <Text style={[styles.loanChipNum, isSelected && styles.loanChipTextSelected]}>
                    {l.loanNumber}
                  </Text>
                  <Text style={[styles.loanChipCust, isSelected && styles.loanChipTextSelected]}>
                    {l.customerName}
                  </Text>
                  <Text style={[styles.loanChipBal, isSelected && styles.loanChipTextSelected]}>
                    Bal: {formatINR(l.outstandingBalance)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {errors.loan && <Text style={styles.errorText}>{errors.loan}</Text>}

          {/* Payment Type Selection */}
          <Text style={styles.sectionHeader}>PAYMENT NATURE</Text>
          <View style={styles.pillRow}>
            {PAYMENT_TYPES.map((t) => {
              const isSelected = paymentType === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => handleTypeChange(t)}
                  style={[styles.typePill, isSelected && styles.typePillSelected]}
                >
                  <Text style={[styles.typePillText, isSelected && styles.typePillTextSelected]}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Payment Method */}
          <Text style={styles.sectionHeader}>PAYMENT CHANNEL</Text>
          <View style={styles.pillRow}>
            {PAYMENT_METHODS.map((m) => {
              const isSelected = paymentMethod === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setPaymentMethod(m)}
                  style={[styles.methodPill, isSelected && styles.methodPillSelected]}
                >
                  <Ionicons
                    name={
                      m === 'UPI'
                        ? 'qr-code-outline'
                        : m === 'CASH'
                        ? 'cash-outline'
                        : 'card-outline'
                    }
                    size={14}
                    color={isSelected ? colors.white : colors.textSecondary}
                  />
                  <Text style={[styles.methodPillText, isSelected && styles.methodPillTextSelected]}>
                    {m.replace(/_/g, ' ')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount Input */}
          <Text style={styles.sectionHeader}>COLLECTION AMOUNT</Text>
          <AmountInput
            label="Total Amount Received *"
            value={amount}
            onChangeText={(t) => {
              setAmount(t);
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
            }}
            placeholder="0"
            error={errors.amount}
            required
          />

          {(paymentMethod === 'UPI' || paymentMethod === 'BANK_TRANSFER') && (
            <Input
              label="Transaction / UPI Reference Number"
              value={refNumber}
              onChangeText={setRefNumber}
              placeholder="e.g. UPI/123456789012"
              leftIcon={<Ionicons name="receipt-outline" size={18} color={colors.textSecondary} />}
            />
          )}

          <Input
            label="Notes / Receipt Remarks"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional counter remarks"
            multiline
            numberOfLines={2}
          />

          <Button
            title="Generate Receipt Voucher"
            size="lg"
            onPress={handleSubmit}
            loading={submitting}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    paddingBottom: spacing.huge,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  loanChipScroll: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  loanChip: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
  },
  loanChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  loanChipNum: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  loanChipCust: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  loanChipBal: {
    ...typography.captionBold,
    color: colors.charcoal,
    marginTop: 2,
  },
  loanChipTextSelected: {
    color: colors.white,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  typePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typePillText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
  },
  typePillTextSelected: {
    color: colors.white,
  },
  methodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  methodPillSelected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  methodPillText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
  },
  methodPillTextSelected: {
    color: colors.white,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
