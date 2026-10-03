/**
 * Goldifi Issue New Pawn Loan Screen
 * Item appraisal capture, interest terms calculation, and pledge registration.
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { loanService } from '../../services/loanService';
import { customerService } from '../../services/customerService';
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
import { Customer } from '../../types';

export default function CreateLoanScreen() {
  const router = useRouter();
  const { user, branch, hasPermission, setDevSimulatorVisible } = useAuth();

  const canCreate = hasPermission('LOANS_CREATE');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Collateral fields
  const [itemDescription, setItemDescription] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [purity, setPurity] = useState('22K (916 Hallmark)');
  const [marketValue, setMarketValue] = useState('');
  const [storageLocker, setStorageLocker] = useState('Vault 1 / Locker A-12');

  // Terms
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('18.0');
  const [tenureMonths, setTenureMonths] = useState('6');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCusts() {
      const data = await customerService.getCustomers(user);
      setCustomers(data);
      if (data.length > 0) {
        setSelectedCustomer(data[0]);
      }
    }
    loadCusts();
  }, [user]);

  if (!canCreate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Issue Loan" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="LOANS_CREATE"
          message="Your current role does not possess LOANS_CREATE permission to sanction new pledge loans."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const principalNum = parseFloat(principalAmount) || 0;
  const rateNum = parseFloat(interestRate) || 0;
  const estimatedMonthlyInterest = Math.round((principalNum * (rateNum / 100)) / 12);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCustomer) errs.customer = 'Select a customer for this loan';
    if (!itemDescription.trim()) errs.itemDescription = 'Item description is required';
    if (!grossWeight.trim() || parseFloat(grossWeight) <= 0) errs.grossWeight = 'Valid gross weight is required';
    if (!principalNum || principalNum < 1000) errs.principal = 'Minimum loan principal is ₹1,000';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedCustomer) return;
    setSubmitting(true);
    try {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (parseInt(tenureMonths) || 6));

      const created = await loanService.createLoan({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        branchId: user?.branchId || branch?.id || 'branch-main',
        branchName: branch?.name || 'Main Branch',
        principalAmount: principalNum,
        annualInterestRate: rateNum,
        startDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'ACTIVE',
        assignedOfficerId: user?.id || 'user-officer-03',
        assignedOfficerName: user?.name || 'Suresh Verma',
        notes: notes || `Sanctioned against ${itemDescription}. Stored in ${storageLocker}.`,
        items: [
          {
            id: `item-${Date.now()}`,
            loanId: '',
            category: 'GOLD_JEWELRY',
            description: itemDescription,
            grossWeightGrams: parseFloat(grossWeight),
            netWeightGrams: parseFloat(netWeight) || parseFloat(grossWeight),
            purityKarat: purity,
            estimatedMarketValue: parseFloat(marketValue) || Math.round(principalNum * 1.35),
            storageLocation: storageLocker,
            itemCondition: 'MINT',
          },
        ],
      });

      router.replace({ pathname: '/loans/[id]', params: { id: created.id } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Sanction Pawn Loan"
        subtitle="New Pledge Agreement"
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
          {/* Customer Selection */}
          <Text style={styles.sectionHeader}>BORROWER IDENTIFICATION</Text>
          <Text style={styles.fieldLabel}>Select Customer *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.custScroll}>
            {customers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setSelectedCustomer(c)}
                  style={[styles.custChip, isSelected && styles.custChipSelected]}
                >
                  <Text style={[styles.custChipName, isSelected && styles.custChipTextSelected]}>
                    {c.name}
                  </Text>
                  <Text style={[styles.custChipId, isSelected && styles.custChipTextSelected]}>
                    {c.customerId}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {errors.customer && <Text style={styles.errorText}>{errors.customer}</Text>}

          {/* Collateral Item Details */}
          <Text style={styles.sectionHeader}>COLLATERAL APPRAISAL</Text>

          <Input
            label="Ornament / Collateral Description"
            value={itemDescription}
            onChangeText={(t) => {
              setItemDescription(t);
              if (errors.itemDescription) setErrors((prev) => ({ ...prev, itemDescription: '' }));
            }}
            placeholder="e.g. 22K Gold Antique Choker with Stones"
            error={errors.itemDescription}
            leftIcon={<Ionicons name="sparkles-outline" size={18} color={colors.textSecondary} />}
            required
          />

          <View style={styles.twoColRow}>
            <View style={styles.col}>
              <Input
                label="Gross Weight (g)"
                value={grossWeight}
                onChangeText={(t) => {
                  setGrossWeight(t);
                  if (!netWeight) setNetWeight(t);
                  if (errors.grossWeight) setErrors((prev) => ({ ...prev, grossWeight: '' }));
                }}
                placeholder="e.g. 18.5"
                keyboardType="numeric"
                error={errors.grossWeight}
                required
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Net Gold (g)"
                value={netWeight}
                onChangeText={setNetWeight}
                placeholder="e.g. 18.0"
                keyboardType="numeric"
                required
              />
            </View>
          </View>

          <View style={styles.twoColRow}>
            <View style={styles.col}>
              <Input
                label="Gold Purity"
                value={purity}
                onChangeText={setPurity}
                placeholder="e.g. 22K (916)"
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Vault Locker #"
                value={storageLocker}
                onChangeText={setStorageLocker}
                placeholder="Locker code"
              />
            </View>
          </View>

          {/* Lending Financial Terms */}
          <Text style={styles.sectionHeader}>LOAN SANCTION TERMS</Text>

          <AmountInput
            label="Sanctioned Principal Amount"
            value={principalAmount}
            onChangeText={(t) => {
              setPrincipalAmount(t);
              if (errors.principal) setErrors((prev) => ({ ...prev, principal: '' }));
            }}
            placeholder="e.g. 50000"
            error={errors.principal}
            required
          />

          <View style={styles.twoColRow}>
            <View style={styles.col}>
              <Input
                label="Annual Interest (% p.a.)"
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="18.0"
                keyboardType="numeric"
                required
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Tenure (Months)"
                value={tenureMonths}
                onChangeText={setTenureMonths}
                placeholder="6"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Real-Time Calculation Preview Card */}
          <View style={styles.calculationCard}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Estimated Monthly Interest:</Text>
              <Text style={styles.calcValue}>{formatINR(estimatedMonthlyInterest)}/mo</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Total Loan Value:</Text>
              <Text style={styles.calcValueBold}>{formatINR(principalNum)}</Text>
            </View>
          </View>

          <Input
            label="Officer Notes / Remarks"
            value={notes}
            onChangeText={setNotes}
            placeholder="Special conditions or hallmarking test remarks"
            multiline
            numberOfLines={2}
          />

          <Button
            title="Disburse & Create Agreement"
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
  fieldLabel: {
    ...typography.secondaryBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  custScroll: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  custChip: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.card,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  custChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  custChipName: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  custChipId: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  custChipTextSelected: {
    color: colors.white,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  calculationCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  calcLabel: {
    ...typography.secondary,
    color: colors.charcoal,
  },
  calcValue: {
    ...typography.secondaryBold,
    color: colors.primaryDark,
  },
  calcValueBold: {
    ...typography.bodyBold,
    color: colors.charcoal,
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
