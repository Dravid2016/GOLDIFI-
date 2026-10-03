/**
 * Goldifi Welcome Screen
 */

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, SecondaryButton } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.logoBadge}>
          <Image
            source={require('../../../assets/images/goldifi-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandTitle}>GOLDIFI</Text>
        <Text style={styles.tagline}>Financial Operating System for Modern Pawnshops</Text>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Role-Based Access Control</Text>
            <Text style={styles.featureDesc}>Tailored dashboards for Owners, Managers, Officers, & Cashiers.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Vault & Pledge Custody</Text>
            <Text style={styles.featureDesc}>Granular locker tracking, gross/net weights, and 916 karat purity.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Instant Receipts & Collections</Text>
            <Text style={styles.featureDesc}>Cash counter, UPI settlements, and physical receipt printouts.</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title="Connect Shop / Branch"
          size="lg"
          onPress={() => router.push('/(auth)/shop-code')}
        />
        <SecondaryButton
          title="Sign In to Existing Session"
          size="lg"
          onPress={() => router.push('/(auth)/login')}
          style={styles.loginBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenHorizontal,
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoBadge: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 80,
    height: 80,
  },
  brandTitle: {
    ...typography.display,
    color: colors.charcoal,
    letterSpacing: 2,
  },
  tagline: {
    ...typography.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxs,
    maxWidth: 280,
  },
  featuresSection: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  bottomSection: {
    paddingBottom: spacing.sm,
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
});
