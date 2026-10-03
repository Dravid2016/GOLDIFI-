/**
 * Goldifi Session Expired Screen
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function SessionExpiredScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={40} color={colors.warning} />
        </View>
        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.message}>
          For your security and store compliance, your active pawnshop session has expired due to inactivity.
        </Text>
        <Button
          title="Sign In Again"
          size="lg"
          onPress={() => router.replace('/(auth)/login')}
          style={styles.btn}
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
    justifyContent: 'center',
  },
  centerBox: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  btn: {
    width: '100%',
  },
});
