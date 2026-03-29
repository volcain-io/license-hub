import type { AuditLogEntry } from './audit-types';

// Mock audit log entries per license
const auditLogs: AuditLogEntry[] = [
  { id: 'AL1', licenseId: 'L1', action: 'license.created', details: 'License created for Acme Corp', performedBy: 'sarah@support.com', timestamp: '2024-02-01T10:00:00Z' },
  { id: 'AL2', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-001 activated (192.168.1.10)', performedBy: 'system', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'AL3', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-002 activated (192.168.1.11)', performedBy: 'system', timestamp: '2024-02-06T11:00:00Z' },
  { id: 'AL4', licenseId: 'L1', action: 'license.updated', details: 'Max activations changed from 3 to 5', performedBy: 'mike@support.com', timestamp: '2024-04-10T14:20:00Z' },
  { id: 'AL5', licenseId: 'L1', action: 'license.renewed', details: 'Expiry extended to Dec 31, 2025', performedBy: 'sarah@support.com', timestamp: '2024-11-15T09:30:00Z' },
  { id: 'AL6', licenseId: 'L2', action: 'license.created', details: 'License created for Globex Inc', performedBy: 'sarah@support.com', timestamp: '2024-03-15T10:00:00Z' },
  { id: 'AL7', licenseId: 'L2', action: 'activation.added', details: 'Device GLOBEX-SRV-01 activated (10.0.0.5)', performedBy: 'system', timestamp: '2024-03-20T08:00:00Z' },
  { id: 'AL8', licenseId: 'L3', action: 'license.created', details: 'License created for Wayne Enterprises', performedBy: 'mike@support.com', timestamp: '2024-01-10T10:00:00Z' },
  { id: 'AL9', licenseId: 'L3', action: 'license.expired', details: 'License expired automatically', performedBy: 'system', timestamp: '2025-01-01T00:00:00Z' },
  { id: 'AL10', licenseId: 'L4', action: 'license.created', details: 'Lifetime license created for Stark Industries', performedBy: 'sarah@support.com', timestamp: '2024-07-01T10:00:00Z' },
  { id: 'AL11', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-01 activated (172.16.0.1)', performedBy: 'system', timestamp: '2024-07-05T10:00:00Z' },
  { id: 'AL12', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-02 activated (172.16.0.2)', performedBy: 'system', timestamp: '2024-07-05T10:30:00Z' },
  { id: 'AL13', licenseId: 'L4', action: 'activation.deactivated', details: 'Device STARK-NODE-02 deactivated', performedBy: 'mike@support.com', timestamp: '2025-03-20T08:00:00Z' },
  { id: 'AL14', licenseId: 'L5', action: 'license.created', details: 'License created for Umbrella Corp', performedBy: 'mike@support.com', timestamp: '2024-04-20T10:00:00Z' },
  { id: 'AL15', licenseId: 'L5', action: 'license.suspended', details: 'License suspended due to payment issue', performedBy: 'sarah@support.com', timestamp: '2025-02-15T11:00:00Z' },
];

export const getAuditLogsByLicense = (licenseId: string) =>
  auditLogs.filter(e => e.licenseId === licenseId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
