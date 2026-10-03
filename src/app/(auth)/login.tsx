/**
 * Goldifi Login Screen
 * Authenticates user credentials and resolves organization, branch, role, and permissions.
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
import { Button, SecondaryButton } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';
import { ScreenHeader } from '../../components/ui/Header';
import { MOCK_USERS } from '../../mock/users';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '../../components/ui/Badge';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [phoneOrEmail, setPhoneOrEmail] = useState('john@kumarpawnbrokers.in');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneOrEmail.trim()) {
      setError('Please enter your registered phone or email');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await login(phoneOrEmail, password);
      if (res.success) {
        // Proceed to verification/OTP step
        router.push('/(auth)/verification');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = (email: string) => {
    setPhoneOrEmail(email);
    setPassword('••••••••');
    setError(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Sign In"
        subtitle="Kumar Pawnbrokers (Main Branch)"
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
          <View style={styles.welcomeBox}>
            <Text style={styles.greetingTitle}>Welcome Back</Text>
            <Text style={styles.greetingSubtitle}>
              Sign in with your employee credentials to access your pawnshop workspace.
            </Text>
          </View>

          <Input
            label="Phone Number or Email"
            value={phoneOrEmail}
            onChangeText={(text) => {
              setPhoneOrEmail(text);
              if (error) setError(null);
            }}
            placeholder="e.g. 98401 22334 or user@kumarpawnbrokers.in"
            autoCapitalize="none"
            keyboardType="email-address"
            error={error || undefined}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
            required
          />

          <PasswordInput
            label="Security Password / PIN"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your secret password"
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
            required
          />

          <View style={styles.forgotRow}>
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              hitSlop={8}
            >
              <Text style={styles.forgotText}>Forgot Password / PIN?</Text>
            </Pressable>
          </View>

          <Button
            title="Authenticate & Continue"
            size="lg"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          {/* Development Quick Accounts */}
          <View style={styles.devSection}>
            <View style={styles.devHeaderRow}>
              <Ionicons name="flask-outline" size={16} color={colors.primary} />
              <Text style={styles.devTitle}>DEMO ACCOUNTS (DEVELOPMENT ONLY)</Text>
            </View>
            <Text style={styles.devDesc}>
              Tap an employee to auto-fill their credentials and simulate their authorization:
            </Text>

            <View style={styles.demoAccountsList}>
              {MOCK_USERS.map((u) => {
                const isSelected = phoneOrEmail.toLowerCase() === u.email.toLowerCase();
                return (
                  <Pressable
                    key={u.id}
                    onPress={() => handleQuickDemoSelect(u.email)}
                    style={({ pressed }) => [
                      styles.demoAccountItem,
                      isSelected && styles.demoAccountSelected,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <View style={styles.demoInfo}>
                      <Text style={styles.demoName}>{u.name}</Text>
                      <Text style={styles.demoEmail}>{u.email}</Text>
                    </View>
                    <RoleBadge role={u.role} customTitle={u.customRoleName} size="sm" />
                  </Pressable>
                );
              })}
            </View>
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
    paddingVertical: spacing.lg,
  },
  welcomeBox: {
    marginBottom: spacing.xl,
  },
  greetingTitle: {
    ...typography.screenTitle,
    color: colors.text,
  },
  greetingSubtitle: {
    ...typography.secondary,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  loginBtn: {
    marginBottom: spacing.xxl,
  },
  devSection: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  devHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  devTitle: {
    ...typography.badge,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  devDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  demoAccountsList: {
    gap: spacing.xs,
  },
  demoAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoAccountSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFFDFB',
  },
  demoInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  demoName: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  demoEmail: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
