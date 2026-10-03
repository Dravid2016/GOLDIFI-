/**
 * Goldifi Bottom Tab Navigator
 * Permission-driven mobile navigation.
 * Tabs only appear if the authenticated user has permission.
 * No emojis used. Professional vector iconography.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function TabLayout() {
  const { hasPermission } = useAuth();

  const canViewCustomers = hasPermission('CUSTOMERS_VIEW');
  const canViewLoans = hasPermission('LOANS_VIEW');
  const canViewPayments = hasPermission('PAYMENTS_VIEW');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          href: canViewCustomers ? '/(tabs)/customers' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          href: canViewLoans ? '/(tabs)/loans' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cash' : 'cash-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          href: canViewPayments ? '/(tabs)/payments' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    height: spacing.tabBarHeight,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    ...typography.captionBold,
    fontSize: 11,
    marginTop: 2,
  },
});
