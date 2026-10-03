/**
 * Goldifi Forgot Password Screen
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScreenHeader } from '../../components/ui/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Reset Password"
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
          {!submitted ? (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="key-outline" size={32} color={colors.primary} />
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your registered employee email or phone number. We will send a secure password reset link or SMS code.
              </Text>

              <Input
                label="Registered Mobile or Email"
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="e.g. 98401 22334 or staff@kumarpawnbrokers.in"
                leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
                required
              />

              <Button
                title="Send Recovery Code"
                size="lg"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitBtn}
              />
            </>
          ) : (
            <View style={styles.successBox}>
              <View style={[styles.iconCircle, styles.successCircle]}>
                <Ionicons name="checkmark-done" size={36} color={colors.success} />
              </View>
              <Text style={styles.title}>Verification Code Sent</Text>
              <Text style={styles.subtitle}>
                A temporary recovery link has been dispatched to your verified contact info.
              </Text>
              <Button
                title="Proceed to Reset Password"
                size="lg"
                onPress={() => router.push('/(auth)/reset-password')}
                style={styles.submitBtn}
              />
            </View>
          )}
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successCircle: {
    backgroundColor: colors.successLight,
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
    maxWidth: 300,
  },
  submitBtn: {
    width: '100%',
    marginTop: spacing.md,
  },
  successBox: {
    alignItems: 'center',
    width: '100%',
  },
});
