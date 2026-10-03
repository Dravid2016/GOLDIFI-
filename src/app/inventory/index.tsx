/**
 * Goldifi Inventory / Pledged Collateral Vault Screen
 * Vault tracking, locker custody, purity karat, and weight management.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { inventoryService } from '../../services/inventoryService';
import { SearchInput } from '../../components/ui/Input';
import { Card, StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState, AccessDeniedState } from '../../components/ui/States';
import { ScreenHeader } from '../../components/ui/Header';
import { formatINR, formatGrams } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem, InventoryStatus } from '../../types';

const STATUS_FILTERS: { key: InventoryStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Items' },
  { key: 'IN_STORAGE', label: 'In Vault' },
  { key: 'PLEDGED', label: 'Pledged' },
  { key: 'RELEASED', label: 'Released' },
];

export default function InventoryScreen() {
  const router = useRouter();
  const { user, hasPermission, setDevSimulatorVisible } = useAuth();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<InventoryStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const canView = hasPermission('INVENTORY_VIEW');

  const loadInventory = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      const data = await inventoryService.getInventory(user, {
        status: selectedStatus,
        query: searchQuery,
      });
      setItems(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, selectedStatus, searchQuery, canView]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadInventory();
  };

  if (!canView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Pledged Vault" onBack={() => router.back()} />
        <AccessDeniedState
          requiredPermission="INVENTORY_VIEW"
          message="Your current role does not have authorization to view vault locker locations or pledged jewelry custody."
          onOpenRoleSimulator={() => setDevSimulatorVisible(true)}
        />
      </SafeAreaView>
    );
  }

  const totalVaultValue = items
    .filter((i) => i.status !== 'RELEASED')
    .reduce((sum, i) => sum + i.estimatedValue, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Pledged Vault"
        subtitle={`Vault Valuation: ${formatINR(totalVaultValue)}`}
        onBack={() => router.back()}
      />

      <View style={styles.searchBarWrapper}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by item code, description, locker..."
        />
      </View>

      <View style={styles.filterTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map((f) => {
            const isSelected = selectedStatus === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setSelectedStatus(f.key)}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Loading pledged inventory records..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No Items in Vault"
          message={searchQuery ? `No collateral matching "${searchQuery}".` : 'No pledged items cataloged.'}
          iconName="cube-outline"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push({ pathname: '/inventory/[id]', params: { id: item.id } })}
              style={styles.itemCard}
            >
              <View style={styles.cardHeader}>
                <View>
                  <View style={styles.itemCodeRow}>
                    <Text style={styles.itemCode}>{item.itemCode}</Text>
                    <StatusBadge status={item.status} size="sm" />
                  </View>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.customerText}>Borrower: {item.customerName}</Text>
                </View>

                <View style={styles.valueBox}>
                  <Text style={styles.valLabel}>Est. Value</Text>
                  <Text style={styles.valAmount}>{formatINR(item.estimatedValue)}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.specsRow}>
                <View style={styles.spec}>
                  <Text style={styles.specLabel}>Gross Wt</Text>
                  <Text style={styles.specVal}>{formatGrams(item.grossWeightGrams)}</Text>
                </View>
                <View style={styles.spec}>
                  <Text style={styles.specLabel}>Net Gold</Text>
                  <Text style={styles.specVal}>{formatGrams(item.netWeightGrams)}</Text>
                </View>
                <View style={styles.spec}>
                  <Text style={styles.specLabel}>Purity</Text>
                  <Text style={styles.specVal}>{item.purityKarat || '22K'}</Text>
                </View>
              </View>

              <View style={styles.lockerBar}>
                <Ionicons name="key-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.lockerText}>Custody: {item.storageLocker}</Text>
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
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  filterTabsContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterScroll: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipSelected: {
    backgroundColor: '#7D479C',
    borderColor: '#7D479C',
  },
  filterChipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  itemCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemCode: {
    ...typography.captionBold,
    color: colors.primary,
  },
  description: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: 2,
  },
  customerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  valueBox: {
    alignItems: 'flex-end',
  },
  valLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  valAmount: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spec: {
    flex: 1,
  },
  specLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  specVal: {
    ...typography.secondaryBold,
    color: colors.textSecondary,
    marginTop: 1,
  },
  lockerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    gap: 4,
  },
  lockerText: {
    ...typography.captionBold,
    color: colors.charcoal,
  },
});
