/**
 * Goldifi Inventory Detail Screen
 * Pledged ornament appraisal record and locker reallocation.
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { inventoryService } from '../../services/inventoryService';
import { ScreenHeader } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatINR, formatGrams } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '../../types';

export default function InventoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingLocker, setEditingLocker] = useState(false);
  const [newLocker, setNewLocker] = useState('');
  const [saving, setSaving] = useState(false);

  const canEdit = hasPermission('INVENTORY_EDIT');

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await inventoryService.getInventoryItemById(id);
        setItem(data);
        if (data) setNewLocker(data.storageLocker);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdateLocker = async () => {
    if (!item || !newLocker.trim()) return;
    setSaving(true);
    try {
      const updated = await inventoryService.updateLocation(item.id, newLocker);
      if (updated) setItem({ ...updated });
      setEditingLocker(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Collateral Vault Item" onBack={() => router.back()} />
        <LoadingState message="Fetching item custody records..." />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Collateral Vault Item" onBack={() => router.back()} />
        <EmptyState
          title="Item Not Found"
          message="No cataloged pledged item matches this identifier."
          onAction={() => router.back()}
          actionTitle="Go Back"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={item.itemCode}
        subtitle={item.description}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Item Card */}
        <Card style={styles.itemCard}>
          <View style={styles.itemTop}>
            <View>
              <Text style={styles.codeText}>{item.itemCode}</Text>
              <Text style={styles.descText}>{item.description}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>

          <View style={styles.valBox}>
            <Text style={styles.valLabel}>ESTIMATED COLLATERAL VALUE</Text>
            <Text style={styles.valAmount}>{formatINR(item.estimatedValue)}</Text>
          </View>
        </Card>

        {/* Technical Assay & Weight Specifications */}
        <Text style={styles.sectionTitle}>ASSAY & WEIGHT BREAKDOWN</Text>
        <Card style={styles.specCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Gross Weight</Text>
            <Text style={styles.specValBold}>{formatGrams(item.grossWeightGrams)}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Net Pure Gold</Text>
            <Text style={styles.specValBold}>{formatGrams(item.netWeightGrams)}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Gold Purity Standard</Text>
            <Text style={styles.specValPrimary}>{item.purityKarat || '22K (916)'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Assayed & Verified By</Text>
            <Text style={styles.specVal}>{item.verifiedBy}</Text>
          </View>
        </Card>

        {/* Vault Locker Custody */}
        <Text style={styles.sectionTitle}>STORAGE VAULT ALLOCATION</Text>
        <Card style={styles.lockerCard}>
          <View style={styles.lockerHeader}>
            <View style={styles.lockerLeft}>
              <Ionicons name="key" size={20} color={colors.primary} />
              <View style={styles.lockerTextCol}>
                <Text style={styles.lockerLabel}>Assigned Locker</Text>
                <Text style={styles.lockerCode}>{item.storageLocker}</Text>
              </View>
            </View>

            {canEdit && !editingLocker && (
              <Button
                title="Change"
                size="sm"
                variant="outline"
                onPress={() => setEditingLocker(true)}
              />
            )}
          </View>

          {editingLocker && (
            <View style={styles.editLockerBox}>
              <Input
                label="New Storage Location / Locker Code"
                value={newLocker}
                onChangeText={setNewLocker}
                placeholder="e.g. Vault 2 / Safe Box #14"
              />
              <View style={styles.lockerBtnRow}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  size="sm"
                  onPress={() => setEditingLocker(false)}
                  style={styles.halfBtn}
                />
                <Button
                  title="Save Location"
                  size="sm"
                  onPress={handleUpdateLocker}
                  loading={saving}
                  style={styles.halfBtn}
                />
              </View>
            </View>
          )}
        </Card>

        {/* Associated Loan & Customer */}
        <Text style={styles.sectionTitle}>PLEDGE AGREEMENT</Text>
        <Card style={styles.specCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Loan Account</Text>
            <Text style={styles.specValPrimary}>{item.loanNumber}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Pledgor (Customer)</Text>
            <Text style={styles.specVal}>{item.customerName}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Branch Safe</Text>
            <Text style={styles.specVal}>{item.branchName}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Received Date</Text>
            <Text style={styles.specVal}>{formatDate(item.receivedDate)}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  itemCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  descText: {
    ...typography.sectionTitle,
    color: colors.text,
    marginTop: 2,
  },
  valBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  valLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  valAmount: {
    ...typography.display,
    color: colors.text,
    fontSize: 26,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  specCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  specLabel: {
    ...typography.secondary,
    color: colors.textSecondary,
  },
  specVal: {
    ...typography.secondaryBold,
    color: colors.text,
  },
  specValBold: {
    ...typography.bodyBold,
    color: colors.text,
  },
  specValPrimary: {
    ...typography.secondaryBold,
    color: colors.primary,
  },
  lockerCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lockerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockerTextCol: {
    marginLeft: spacing.sm,
  },
  lockerLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  lockerCode: {
    ...typography.bodyBold,
    color: colors.charcoal,
  },
  editLockerBox: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  lockerBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  halfBtn: {
    flex: 1,
  },
});
