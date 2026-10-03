/**
 * Goldifi Shop / Workspace Identification Screen
 * Identifies the tenant organization without allowing role selection.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function ShopCodeScreen() {
  const router = useRouter();
  const { identifyShop } = useAuth();
  const [shopCode, setShopCode] = useState('KUMAR-TN');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!shopCode.trim()) {
      setError('Please enter your pawnshop or branch code');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await identifyShop(shopCode);
      if (res.success) {
        router.push('/(auth)/login');
      } else {
        setError(res.error || 'Shop code not found');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../../assets/images/goldifi-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>GOLDIFI</Text>
            <Text style={styles.subTitle}>Pawnshop Management</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formHeading}>Identify Your Pawnshop</Text>
            <Text style={styles.formPrompt}>
              Enter your assigned shop or branch identifier code to securely connect to your organization.
            </Text>

            <Input
              label="Shop / Branch Code"
              value={shopCode}
              onChangeText={(text) => {
                setShopCode(text);
                if (error) setError(null);
              }}
              placeholder="e.g. KUMAR-TN or DEMO"
              autoCapitalize="characters"
              error={error || undefined}
              leftIcon={<Ionicons name="business-outline" size={20} color={colors.textSecondary} />}
              required
            />

            <View style={styles.hintBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.hintText}>
                Demo code: <Text style={styles.codeHighlight}>KUMAR-TN</Text> (Kumar Pawnbrokers, Chennai)
              </Text>
            </View>

            <Button
              title="Continue to Login"
              size="lg"
              onPress={handleContinue}
              loading={loading}
              style={styles.continueBtn}
            />
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
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  logo: {
    width: 72,
    height: 72,
  },
  brandTitle: {
    ...typography.display,
    color: colors.charcoal,
    letterSpacing: 2,
  },
  subTitle: {
    ...typography.secondaryMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
  },
  formHeading: {
    ...typography.sectionTitle,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  formPrompt: {
    ...typography.secondary,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  hintText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  codeHighlight: {
    fontWeight: '700',
    color: colors.primary,
  },
  continueBtn: {
    marginTop: spacing.xs,
  },
});
