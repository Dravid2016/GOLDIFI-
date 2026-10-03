/**
 * Goldifi Inventory / Pledged Items Service
 */

import { MOCK_INVENTORY } from '../mock/inventory';
import { InventoryItem, InventoryStatus, User } from '../types';
import { filterByDataScope } from '../permissions/access';

class InventoryService {
  private inventory: InventoryItem[] = [...MOCK_INVENTORY];

  async getInventory(
    user: User | null,
    filter?: { status?: InventoryStatus | 'ALL'; query?: string }
  ): Promise<InventoryItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = filterByDataScope(this.inventory, user);

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((i) => i.status === filter.status);
    }
    if (filter?.query && filter.query.trim()) {
      const q = filter.query.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.itemCode.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.storageLocker.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.inventory.find((i) => i.id === id || i.itemCode === id) || null;
  }

  async updateLocation(id: string, newLocker: string): Promise<InventoryItem | null> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = this.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    this.inventory[idx] = {
      ...this.inventory[idx],
      storageLocker: newLocker,
    };
    return this.inventory[idx];
  }
}

export const inventoryService = new InventoryService();
