/**
 * Goldifi Auth Stack Navigator
 */

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="shop-code" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="session-expired" />
    </Stack>
  );
}
