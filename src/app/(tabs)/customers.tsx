/**
 * Goldifi Customers Directory Screen
 * Search, filter, customer list, KYC status, and customer profile navigation.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { SearchInput } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState, AccessDeniedState } from '../../components/ui/States';
import { ScreenHeader } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';
import { formatINR } from '../../utils/currency';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Customer } from '../../types';

export default function CustomersScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canView = hasPermission('CUSTOMERS_VIEW');
  const canCreate = hasPermission('CUSTOMERS_CREATE');

  const loadCustomers = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      const data = await customerService.getCustomers(user, searchQuery);
      setCustomers(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, searchQuery, canView]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Customers Directory" />
        <AccessDeniedState
          requiredPermission="CUSTOMERS_VIEW"
          message="Your current role does not have authorization to view customer personal information or KYC records."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Customers"
        subtitle={`${customers.length} registered borrowers`}
        rightAction={
          canCreate ? (
            <Button
              title="Add"
              size="sm"
              leftIcon={<Ionicons name="person-add-outline" size={16} color={colors.white} />}
              onPress={() => router.push('/customers/create')}
            />
          ) : undefined
        }
      />

      <View style={styles.searchBarWrapper}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by customer name, mobile, ID..."
        />
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Loading customers records..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          message={searchQuery ? `No customer matching "${searchQuery}" was found.` : 'No customers registered yet.'}
          iconName="people-outline"
          actionTitle={canCreate ? 'Create First Customer' : undefined}
          onAction={canCreate ? () => router.push('/customers/create') : undefined}
        />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push({ pathname: '/customers/[id]', params: { id: item.id } })}
              style={styles.customerCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatarRow}>
                  <Avatar name={item.name} size={46} />
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{item.name}</Text>
                    <View style={styles.idRow}>
                      <Text style={styles.idText}>{item.customerId}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.phoneText}>{item.phone}</Text>
                    </View>
                  </View>
                </View>
                <StatusBadge status={item.status} size="sm" />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.footerStat}>
                  <Text style={styles.statLabel}>Active Loans</Text>
                  <Text style={styles.statVal}>{item.activeLoansCount}</Text>
                </View>

                <View style={styles.footerStat}>
                  <Text style={styles.statLabel}>Outstanding</Text>
                  <Text style={styles.statValHighlight}>
                    {formatINR(item.currentOutstandingAmount)}
                  </Text>
                </View>

                <View style={styles.footerStat}>
                  <Text style={styles.statLabel}>Govt ID</Text>
                  <Text style={styles.statVal}>{item.governmentIdType}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarWrapper: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  listContent: {
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  customerCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  customerInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  customerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  idText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  dot: {
    marginHorizontal: 4,
    color: colors.textMuted,
  },
  phoneText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerStat: {
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  statVal: {
    ...typography.secondaryBold,
    color: colors.text,
    marginTop: 1,
  },
  statValHighlight: {
    ...typography.secondaryBold,
    color: colors.charcoal,
    marginTop: 1,
  },
});
