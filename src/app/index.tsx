/**
 * Goldifi Entry Route
 * Determines whether user is authenticated or needs to enter through authentication flow.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { LoadingState } from '../components/ui/States';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, isShopIdentified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else if (!isShopIdentified) {
        router.replace('/(auth)/shop-code');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, isShopIdentified]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* Brand Logo Asset */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/goldifi-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.brandTitle}>GOLDIFI</Text>
        <Text style={styles.brandTagline}>Pawnshop Management CRM</Text>
      </View>

      <View style={styles.bottomLoader}>
        <LoadingState message="Initializing secure workspace..." />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.huge,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  brandTitle: {
    ...typography.display,
    color: colors.charcoal,
    letterSpacing: 2,
  },
  brandTagline: {
    ...typography.secondaryMedium,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  bottomLoader: {
    paddingBottom: spacing.lg,
  },
});
