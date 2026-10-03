/**
 * Goldifi Create Customer Form
 * Strict validation, mobile keyboard handling, and KYC capture.
 */

import React, { useState } from 'react';
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
import { customerService } from '../../services/customerService';
import { ScreenHeader } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AccessDeniedState } from '../../components/ui/States';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';

const ID_TYPES: ('AADHAAR' | 'PAN' | 'VOTER_ID' | 'PASSPORT')[] = [
  'AADHAAR',
  'PAN',
  'VOTER_ID',
  'PASSPORT',
];

export default function CreateCustomerScreen() {
  const router = useRouter();
  const { user, branch, hasPermission, setDevSimulatorVisible } = useAuth();

  const canCreate = hasPermission('CUSTOMERS_CREATE');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600001');
  const [idType, setIdType] = useState<'AADHAAR' | 'PAN' | 'VOTER_ID' | 'PASSPORT'>('AADHAAR');
  const [idNumber, setIdNumber] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!canCreate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="New Customer" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="CUSTOMERS_CREATE"
          message="Your account role does not have permission to register new borrower profiles."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!idNumber.trim()) errs.idNumber = 'Government ID number is required for KYC';
    if (!address.trim()) errs.address = 'Street address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await customerService.createCustomer({
        name,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address,
        city,
        state: 'Tamil Nadu',
        pincode,
        governmentIdType: idType,
        governmentIdNumber: idNumber,
        branchId: user?.branchId || branch?.id || 'branch-main',
        status: 'ACTIVE',
      });
      router.replace({ pathname: '/customers/[id]', params: { id: created.id } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Register Borrower"
        subtitle="New Customer KYC"
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
          <Text style={styles.sectionHeader}>BASIC CONTACT DETAILS</Text>

          <Input
            label="Full Legal Name"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="As per Government ID"
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
            required
          />

          <Input
            label="Mobile Phone Number"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon={<Ionicons name="call-outline" size={18} color={colors.textSecondary} />}
            required
          />

          <Input
            label="Email Address (Optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
          />

          <Text style={styles.sectionHeader}>KYC VERIFICATION</Text>

          <View style={styles.idTypeRow}>
            <Text style={styles.fieldLabel}>ID Document Type *</Text>
            <View style={styles.idChipGroup}>
              {ID_TYPES.map((type) => {
                const isSelected = idType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setIdType(type)}
                    style={[styles.idChip, isSelected && styles.idChipSelected]}
                  >
                    <Text style={[styles.idChipText, isSelected && styles.idChipTextSelected]}>
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Input
            label={`${idType} Number`}
            value={idNumber}
            onChangeText={(t) => {
              setIdNumber(t);
              if (errors.idNumber) setErrors((prev) => ({ ...prev, idNumber: '' }));
            }}
            placeholder={`Enter official ${idType} number`}
            autoCapitalize="characters"
            error={errors.idNumber}
            leftIcon={<Ionicons name="card-outline" size={18} color={colors.textSecondary} />}
            required
          />

          <Text style={styles.sectionHeader}>RESIDENTIAL ADDRESS</Text>

          <Input
            label="Street Address / Door No."
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
            }}
            placeholder="House/Door no., building, street"
            error={errors.address}
            required
          />

          <View style={styles.twoColRow}>
            <View style={styles.col}>
              <Input
                label="City / Town"
                value={city}
                onChangeText={setCity}
                placeholder="City"
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Pincode"
                value={pincode}
                onChangeText={setPincode}
                placeholder="6-digit PIN"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Button
            title="Register Customer"
            size="lg"
            onPress={handleSave}
            loading={submitting}
            style={styles.saveBtn}
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
  idTypeRow: {
    marginBottom: spacing.md,
  },
  idChipGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  idChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  idChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  idChipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
  },
  idChipTextSelected: {
    color: colors.white,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  saveBtn: {
    marginTop: spacing.lg,
  },
});
