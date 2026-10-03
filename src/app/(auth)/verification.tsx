/**
 * Goldifi 2-Factor Security Verification / OTP Screen
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScreenHeader } from '../../components/ui/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function VerificationScreen() {
  const router = useRouter();
  const { user, organization, branch, role } = useAuth();
  const [code, setCode] = useState('849201');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (code.length < 4) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 400));
      // Successfully authenticated and verified! Navigate to main app
      router.replace('/(tabs)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Security Verification"
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
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>

          <Text style={styles.title}>Two-Factor Security</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit authorization code sent to your registered mobile device ending in{' '}
            <Text style={styles.boldText}>{user?.phone ? user.phone.slice(-4) : '2334'}</Text>.
          </Text>

          <Input
            label="Authorization Code (OTP)"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (error) setError(null);
            }}
            placeholder="6-digit code"
            keyboardType="number-pad"
            error={error || undefined}
            leftIcon={<Ionicons name="key-outline" size={20} color={colors.textSecondary} />}
            required
          />

          <View style={styles.sessionResolutionBox}>
            <Text style={styles.boxTitle}>SYSTEM VERIFICATION STATUS</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Organization:</Text>
              <Text style={styles.metaVal}>{organization?.name || 'Kumar Pawnbrokers'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Branch:</Text>
              <Text style={styles.metaVal}>{branch?.name || 'Main Branch'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Authorized Role:</Text>
              <Text style={styles.metaValHighlight}>{role?.replace(/_/g, ' ') || 'OWNER'}</Text>
            </View>
          </View>

          <Button
            title="Verify & Enter Goldifi"
            size="lg"
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyBtn}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive code? </Text>
            <Pressable hitSlop={8}>
              <Text style={styles.resendBtn}>Resend via SMS</Text>
            </Pressable>
          </View>
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
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
    maxWidth: 310,
  },
  boldText: {
    fontWeight: '700',
    color: colors.text,
  },
  sessionResolutionBox: {
    width: '100%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxTitle: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  metaLabel: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  metaVal: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  metaValHighlight: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  verifyBtn: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendPrompt: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  resendBtn: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
});
