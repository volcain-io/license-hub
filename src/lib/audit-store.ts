import type { AuditLogEntry } from './audit-types';

const auditLogs: AuditLogEntry[] = [
  // L1 - Acme
  { id: 'AL1', licenseId: 'L1', action: 'license.created', details: 'License created for Acme Corp', performedBy: 'sarah@support.com', timestamp: '2024-02-01T10:00:00Z' },
  { id: 'AL2', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-001 activated on grant G1 (full-access)', performedBy: 'system', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'AL3', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-002 activated on grant G1 (full-access)', performedBy: 'system', timestamp: '2024-02-06T11:00:00Z' },
  { id: 'AL4', licenseId: 'L1', action: 'license.updated', details: 'Max activations changed from 3 to 10', performedBy: 'mike@support.com', timestamp: '2024-04-10T14:20:00Z' },
  { id: 'AL16', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-003 activated on grant G1 (full-access)', performedBy: 'system', timestamp: '2024-04-10T08:00:00Z' },
  { id: 'AL17', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-001 activated on grant G2 (pdf-export)', performedBy: 'system', timestamp: '2024-06-02T10:00:00Z' },
  { id: 'AL18', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-004 activated on grant G2 (pdf-export)', performedBy: 'system', timestamp: '2024-06-15T09:00:00Z' },
  { id: 'AL19', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-API-SRV activated on grant G2b (api-access)', performedBy: 'system', timestamp: '2024-08-05T07:00:00Z' },
  { id: 'AL20', licenseId: 'L1', action: 'activation.deactivated', details: 'Device ACME-WS-001 suspended for maintenance on grant G1', performedBy: 'sarah@support.com', timestamp: '2024-08-01T10:00:00Z' },
  { id: 'AL21', licenseId: 'L1', action: 'activation.added', details: 'Device ACME-WS-001 reactivated after maintenance on grant G1', performedBy: 'sarah@support.com', timestamp: '2024-08-02T08:00:00Z' },
  { id: 'AL5', licenseId: 'L1', action: 'license.renewed', details: 'Expiry extended to Dec 31, 2025', performedBy: 'sarah@support.com', timestamp: '2024-11-15T09:30:00Z' },
  { id: 'AL22', licenseId: 'L1', action: 'activation.deactivated', details: 'Device ACME-WS-004 deactivated on grant G2 (pdf-export)', performedBy: 'mike@support.com', timestamp: '2025-02-20T10:00:00Z' },
  // L2 - Globex
  { id: 'AL6', licenseId: 'L2', action: 'license.created', details: 'License created for Globex Inc', performedBy: 'sarah@support.com', timestamp: '2024-03-15T10:00:00Z' },
  { id: 'AL7', licenseId: 'L2', action: 'activation.added', details: 'Device GLOBEX-SRV-01 activated on grant G3 (standard)', performedBy: 'system', timestamp: '2024-03-20T08:00:00Z' },
  { id: 'AL23', licenseId: 'L2', action: 'activation.added', details: 'Device GLOBEX-SRV-02 activated on grant G3 (standard)', performedBy: 'system', timestamp: '2024-04-01T10:00:00Z' },
  { id: 'AL24', licenseId: 'L2', action: 'activation.added', details: 'Device GLOBEX-DEV-01 activated on grant G3 (standard)', performedBy: 'system', timestamp: '2024-04-15T09:00:00Z' },
  { id: 'AL25', licenseId: 'L2', action: 'activation.added', details: 'Device GLOBEX-SRV-01 activated on grant G3b (realtime-sync)', performedBy: 'system', timestamp: '2024-05-05T10:00:00Z' },
  { id: 'AL26', licenseId: 'L2', action: 'activation.deactivated', details: 'Device GLOBEX-DEV-01 deactivated on grant G3', performedBy: 'it@globex.com', timestamp: '2025-03-20T08:00:00Z' },
  // L3 - Wayne
  { id: 'AL8', licenseId: 'L3', action: 'license.created', details: 'License created for Wayne Enterprises', performedBy: 'mike@support.com', timestamp: '2024-01-10T10:00:00Z' },
  { id: 'AL27', licenseId: 'L3', action: 'activation.added', details: 'Device WAYNE-SEC-01 activated on grant G4 (vault-full)', performedBy: 'system', timestamp: '2024-01-15T09:00:00Z' },
  { id: 'AL28', licenseId: 'L3', action: 'activation.added', details: 'Device WAYNE-SEC-02 activated on grant G4 (vault-full)', performedBy: 'system', timestamp: '2024-02-01T10:00:00Z' },
  { id: 'AL29', licenseId: 'L3', action: 'activation.added', details: 'Device WAYNE-SEC-01 activated on grant G4b (mfa)', performedBy: 'system', timestamp: '2024-03-05T08:00:00Z' },
  { id: 'AL9', licenseId: 'L3', action: 'license.expired', details: 'License expired automatically', performedBy: 'system', timestamp: '2025-01-01T00:00:00Z' },
  // L4 - Stark
  { id: 'AL10', licenseId: 'L4', action: 'license.created', details: 'Lifetime license created for Stark Industries', performedBy: 'sarah@support.com', timestamp: '2024-07-01T10:00:00Z' },
  { id: 'AL11', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-01 activated on grant G5 (monitor-all)', performedBy: 'system', timestamp: '2024-07-05T10:00:00Z' },
  { id: 'AL12', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-02 activated on grant G5 (monitor-all)', performedBy: 'system', timestamp: '2024-07-05T10:30:00Z' },
  { id: 'AL30', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-01 activated on grant G5b (alerts)', performedBy: 'system', timestamp: '2024-07-10T10:00:00Z' },
  { id: 'AL31', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-03 activated on grant G5 (monitor-all)', performedBy: 'system', timestamp: '2024-08-01T09:00:00Z' },
  { id: 'AL32', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-03 activated on grant G5b (alerts)', performedBy: 'system', timestamp: '2024-08-05T09:00:00Z' },
  { id: 'AL33', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-NODE-04 activated on grant G5 (monitor-all)', performedBy: 'system', timestamp: '2024-09-01T10:00:00Z' },
  { id: 'AL34', licenseId: 'L4', action: 'activation.added', details: 'Device STARK-DASH-01 activated on grant G5c (custom-dash)', performedBy: 'system', timestamp: '2024-09-05T08:00:00Z' },
  { id: 'AL13', licenseId: 'L4', action: 'activation.deactivated', details: 'Device STARK-NODE-02 deactivated on grant G5', performedBy: 'mike@support.com', timestamp: '2025-03-20T08:00:00Z' },
  // L5 - Umbrella
  { id: 'AL14', licenseId: 'L5', action: 'license.created', details: 'License created for Umbrella Corp', performedBy: 'mike@support.com', timestamp: '2024-04-20T10:00:00Z' },
  { id: 'AL15', licenseId: 'L5', action: 'license.suspended', details: 'License suspended due to payment issue', performedBy: 'sarah@support.com', timestamp: '2025-02-15T11:00:00Z' },
  // L6 - Oscorp
  { id: 'AL35', licenseId: 'L6', action: 'license.created', details: 'License created for Oscorp', performedBy: 'sarah@support.com', timestamp: '2024-08-10T10:00:00Z' },
  { id: 'AL36', licenseId: 'L6', action: 'activation.added', details: 'Device OSCORP-DEV-01 activated on grant G7 (devtool-full)', performedBy: 'system', timestamp: '2024-08-15T09:00:00Z' },
  { id: 'AL37', licenseId: 'L6', action: 'activation.added', details: 'Device OSCORP-DEV-02 activated on grant G7 (devtool-full)', performedBy: 'system', timestamp: '2024-08-20T10:00:00Z' },
  { id: 'AL38', licenseId: 'L6', action: 'activation.added', details: 'Device OSCORP-DEV-03 activated on grant G7 (devtool-full)', performedBy: 'system', timestamp: '2024-09-10T11:00:00Z' },
  { id: 'AL39', licenseId: 'L6', action: 'activation.added', details: 'Device OSCORP-CI-01 activated on grant G7b (cicd)', performedBy: 'system', timestamp: '2024-09-15T08:00:00Z' },
  { id: 'AL40', licenseId: 'L6', action: 'activation.deactivated', details: 'Device OSCORP-DEV-03 deactivated on grant G7', performedBy: 'norman@oscorp.com', timestamp: '2025-03-10T08:00:00Z' },
  // L7 - LexCorp
  { id: 'AL41', licenseId: 'L7', action: 'license.created', details: 'License created for LexCorp', performedBy: 'sarah@support.com', timestamp: '2024-09-20T10:00:00Z' },
  { id: 'AL42', licenseId: 'L7', action: 'activation.added', details: 'Device LEX-ANALYTICS-01 activated on grant G8 (analytics-full)', performedBy: 'system', timestamp: '2024-09-25T09:00:00Z' },
  { id: 'AL43', licenseId: 'L7', action: 'activation.added', details: 'Device LEX-ANALYTICS-02 activated on grant G8', performedBy: 'system', timestamp: '2024-10-01T10:00:00Z' },
  { id: 'AL44', licenseId: 'L7', action: 'activation.added', details: 'Device LEX-ANALYTICS-03 activated on grant G8', performedBy: 'system', timestamp: '2024-10-15T11:00:00Z' },
  { id: 'AL45', licenseId: 'L7', action: 'activation.added', details: 'Device LEX-ML-01 activated on grant G8b (ml-predict)', performedBy: 'system', timestamp: '2024-11-05T08:00:00Z' },
  // L8 - Daily Planet
  { id: 'AL46', licenseId: 'L8', action: 'license.created', details: 'License created for Daily Planet', performedBy: 'mike@support.com', timestamp: '2024-10-05T10:00:00Z' },
  { id: 'AL47', licenseId: 'L8', action: 'activation.added', details: 'Device DP-DESK-001 activated on grant G9 (forms-pro)', performedBy: 'system', timestamp: '2024-10-10T09:00:00Z' },
  { id: 'AL48', licenseId: 'L8', action: 'activation.added', details: 'Device DP-DESK-002 activated on grant G9 (forms-pro)', performedBy: 'system', timestamp: '2024-10-12T10:00:00Z' },
  // L9 - Initech
  { id: 'AL49', licenseId: 'L9', action: 'license.created', details: 'License created for Initech', performedBy: 'sarah@support.com', timestamp: '2024-05-01T10:00:00Z' },
  { id: 'AL50', licenseId: 'L9', action: 'license.revoked', details: 'License revoked due to terms violation', performedBy: 'mike@support.com', timestamp: '2024-11-01T10:00:00Z' },
  // L10 - Hooli
  { id: 'AL51', licenseId: 'L10', action: 'license.created', details: 'License created for Hooli', performedBy: 'sarah@support.com', timestamp: '2024-11-01T10:00:00Z' },
  { id: 'AL52', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-SRV-01 activated on grant G10 (monitor-premium)', performedBy: 'system', timestamp: '2024-11-05T09:00:00Z' },
  { id: 'AL53', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-SRV-02 activated on grant G10', performedBy: 'system', timestamp: '2024-11-10T10:00:00Z' },
  { id: 'AL54', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-SRV-03 activated on grant G10', performedBy: 'system', timestamp: '2024-11-15T11:00:00Z' },
  { id: 'AL55', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-LOG-01 activated on grant G10b (log-agg)', performedBy: 'system', timestamp: '2024-11-20T09:00:00Z' },
  { id: 'AL56', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-DEV-01 activated on grant G10', performedBy: 'system', timestamp: '2024-12-01T08:00:00Z' },
  { id: 'AL57', licenseId: 'L10', action: 'activation.added', details: 'Device HOOLI-LOG-02 activated on grant G10b (log-agg)', performedBy: 'system', timestamp: '2024-12-01T10:00:00Z' },
  { id: 'AL58', licenseId: 'L10', action: 'activation.deactivated', details: 'Device HOOLI-DEV-01 deactivated on grant G10', performedBy: 'gavin@hooli.com', timestamp: '2025-03-20T09:00:00Z' },
];

export const getAuditLogsByLicense = (licenseId: string) =>
  auditLogs.filter(e => e.licenseId === licenseId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
