/**
 * Goldifi Audit Log Service (Read-Only)
 */

import { MOCK_AUDIT_LOGS } from '../mock/auditLogs';
import { AuditLog, User } from '../types';
import { filterByDataScope } from '../permissions/access';

class AuditService {
  private logs: AuditLog[] = [...MOCK_AUDIT_LOGS];

  async getAuditLogs(user: User | null, module?: string): Promise<AuditLog[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = filterByDataScope(this.logs, user);

    if (module && module !== 'ALL') {
      list = list.filter((l) => l.module === module);
    }
    return list;
  }
}

export const auditService = new AuditService();
