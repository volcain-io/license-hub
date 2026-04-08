import { Product, License, Grant, Activation, ResponseLog, HistoryLog } from './types';

type Listener = () => void;
const listeners = new Set<Listener>();
let productSnap: Product[] = [];
let licenseSnap: License[] = [];
let grantSnap: Grant[] = [];
let activationSnap: Activation[] = [];
let responseLogSnap: ResponseLog[] = [];
let historyLogSnap: HistoryLog[] = [];

function notify() {
  productSnap = [...products];
  licenseSnap = [...licenses];
  grantSnap = [...grants];
  activationSnap = [...activations];
  responseLogSnap = [...responseLogs];
  historyLogSnap = [...historyLogs];
  listeners.forEach(fn => fn());
}
export function subscribe(fn: Listener) { listeners.add(fn); return () => listeners.delete(fn); }

let products: Product[] = [
  { id: '1', name: 'DataSync Pro', slug: 'datasync-pro', description: 'Enterprise data synchronization tool', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: '2', name: 'SecureVault', slug: 'securevault', description: 'Password management & encryption', createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z' },
  { id: '3', name: 'CloudMonitor', slug: 'cloudmonitor', description: 'Infrastructure monitoring dashboard', createdAt: '2024-06-10T10:00:00Z', updatedAt: '2024-06-10T10:00:00Z' },
  { id: '4', name: 'DevToolkit', slug: 'devtoolkit', description: 'Developer productivity suite', createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-08-01T10:00:00Z' },
  { id: '5', name: 'AnalyticsHub', slug: 'analyticshub', description: 'Business intelligence & reporting', createdAt: '2024-09-15T10:00:00Z', updatedAt: '2024-09-15T10:00:00Z' },
  { id: '6', name: 'FormBuilder', slug: 'formbuilder', description: 'Dynamic form creation platform', createdAt: '2024-10-01T10:00:00Z', updatedAt: '2024-10-01T10:00:00Z' },
];

let licenses: License[] = [
  { id: 'L1', licenseKey: 'DSP-2024-ABCD-1234', productId: '1', customerName: 'Acme Corp', customerEmail: 'admin@acme.com', status: 'active', maxActivations: 10, expiresAt: '2025-12-31T23:59:59Z', notes: 'Enterprise plan', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'L2', licenseKey: 'DSP-2024-EFGH-5678', productId: '1', customerName: 'Globex Inc', customerEmail: 'it@globex.com', status: 'active', maxActivations: 15, expiresAt: '2025-06-30T23:59:59Z', notes: '', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'L3', licenseKey: 'SV-2024-IJKL-9012', productId: '2', customerName: 'Wayne Enterprises', customerEmail: 'bruce@wayne.com', status: 'expired', maxActivations: 5, expiresAt: '2024-12-31T23:59:59Z', notes: 'Renewal pending', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z' },
  { id: 'L4', licenseKey: 'CM-2024-MNOP-3456', productId: '3', customerName: 'Stark Industries', customerEmail: 'pepper@stark.com', status: 'active', maxActivations: 25, expiresAt: null, notes: 'Lifetime license', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  { id: 'L5', licenseKey: 'SV-2024-QRST-7890', productId: '2', customerName: 'Umbrella Corp', customerEmail: 'admin@umbrella.com', status: 'suspended', maxActivations: 3, expiresAt: '2025-03-31T23:59:59Z', notes: 'Payment issue', createdAt: '2024-04-20T10:00:00Z', updatedAt: '2024-04-20T10:00:00Z' },
  { id: 'L6', licenseKey: 'DT-2024-UVWX-1111', productId: '4', customerName: 'Oscorp', customerEmail: 'norman@oscorp.com', status: 'active', maxActivations: 8, expiresAt: '2025-09-30T23:59:59Z', notes: 'Team license', createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-08-10T10:00:00Z' },
  { id: 'L7', licenseKey: 'AH-2024-YZAB-2222', productId: '5', customerName: 'LexCorp', customerEmail: 'admin@lexcorp.com', status: 'active', maxActivations: 12, expiresAt: '2026-01-31T23:59:59Z', notes: '', createdAt: '2024-09-20T10:00:00Z', updatedAt: '2024-09-20T10:00:00Z' },
  { id: 'L8', licenseKey: 'FB-2024-CDEF-3333', productId: '6', customerName: 'Daily Planet', customerEmail: 'clark@dailyplanet.com', status: 'active', maxActivations: 5, expiresAt: '2025-11-30T23:59:59Z', notes: '', createdAt: '2024-10-05T10:00:00Z', updatedAt: '2024-10-05T10:00:00Z' },
  { id: 'L9', licenseKey: 'DSP-2024-GHIJ-4444', productId: '1', customerName: 'Initech', customerEmail: 'peter@initech.com', status: 'revoked', maxActivations: 3, expiresAt: '2025-06-30T23:59:59Z', notes: 'Terms violation', createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'L10', licenseKey: 'CM-2024-KLMN-5555', productId: '3', customerName: 'Hooli', customerEmail: 'gavin@hooli.com', status: 'active', maxActivations: 20, expiresAt: '2026-03-31T23:59:59Z', notes: 'Premium tier', createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
];

let grants: Grant[] = [
  // L1 - Acme Corp
  { id: 'G1', licenseId: 'L1', usageStatus: 'usable', licenseKey: 'DSP-2024-ABCD-1234', name: '2024 Annual Access', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-02-01T00:00:00Z', endDate: '2025-12-31T23:59:59Z', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'G2', licenseId: 'L1', usageStatus: 'usable', licenseKey: 'DSP-2024-ABCD-1234', name: 'PDF Export Add-on', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-06-01T00:00:00Z', endDate: '2025-12-31T23:59:59Z', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: 'G2b', licenseId: 'L1', usageStatus: 'usable', licenseKey: 'DSP-2024-ABCD-1234', name: 'API Access', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-08-01T00:00:00Z', endDate: '2025-12-31T23:59:59Z', createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-08-01T10:00:00Z' },
  // L2 - Globex
  { id: 'G3', licenseId: 'L2', usageStatus: 'usable', licenseKey: 'DSP-2024-EFGH-5678', name: '2024 Standard Access', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-03-15T00:00:00Z', endDate: '2025-06-30T23:59:59Z', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'G3b', licenseId: 'L2', usageStatus: 'usable', licenseKey: 'DSP-2024-EFGH-5678', name: 'Real-time Sync', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-05-01T00:00:00Z', endDate: '2025-06-30T23:59:59Z', createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z' },
  // L3 - Wayne
  { id: 'G4', licenseId: 'L3', usageStatus: 'unusable', licenseKey: 'SV-2024-IJKL-9012', name: '2024 Vault Access', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'inactive', startDate: '2024-01-10T00:00:00Z', endDate: '2024-12-31T23:59:59Z', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z' },
  { id: 'G4b', licenseId: 'L3', usageStatus: 'unusable', licenseKey: 'SV-2024-IJKL-9012', name: 'MFA Module', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'inactive', startDate: '2024-03-01T00:00:00Z', endDate: '2024-12-31T23:59:59Z', createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z' },
  // L4 - Stark
  { id: 'G5', licenseId: 'L4', usageStatus: 'usable', licenseKey: 'CM-2024-MNOP-3456', name: 'Lifetime Monitoring', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-07-01T00:00:00Z', endDate: null, createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  { id: 'G5b', licenseId: 'L4', usageStatus: 'usable', licenseKey: 'CM-2024-MNOP-3456', name: 'Alerting Engine', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-07-01T00:00:00Z', endDate: null, createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  { id: 'G5c', licenseId: 'L4', usageStatus: 'usable', licenseKey: 'CM-2024-MNOP-3456', name: 'Custom Dashboards', grantType: 'sublicense', grantIdentity: 'test', grantState: 'active', startDate: '2024-09-01T00:00:00Z', endDate: null, createdAt: '2024-09-01T10:00:00Z', updatedAt: '2024-09-01T10:00:00Z' },
  // L5 - Umbrella
  { id: 'G6', licenseId: 'L5', usageStatus: 'usable', licenseKey: 'SV-2024-QRST-7890', name: '2024 Vault Basic', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-04-20T00:00:00Z', endDate: '2025-03-31T23:59:59Z', createdAt: '2024-04-20T10:00:00Z', updatedAt: '2024-04-20T10:00:00Z' },
  // L6 - Oscorp
  { id: 'G7', licenseId: 'L6', usageStatus: 'usable', licenseKey: 'DT-2024-UVWX-1111', name: 'DevToolkit Full', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-08-10T00:00:00Z', endDate: '2025-09-30T23:59:59Z', createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-08-10T10:00:00Z' },
  { id: 'G7b', licenseId: 'L6', usageStatus: 'usable', licenseKey: 'DT-2024-UVWX-1111', name: 'CI/CD Integration', grantType: 'sublicense', grantIdentity: 'test', grantState: 'active', startDate: '2024-09-01T00:00:00Z', endDate: '2025-09-30T23:59:59Z', createdAt: '2024-09-01T10:00:00Z', updatedAt: '2024-09-01T10:00:00Z' },
  // L7 - LexCorp
  { id: 'G8', licenseId: 'L7', usageStatus: 'usable', licenseKey: 'AH-2024-YZAB-2222', name: 'Analytics Full Suite', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-09-20T00:00:00Z', endDate: '2026-01-31T23:59:59Z', createdAt: '2024-09-20T10:00:00Z', updatedAt: '2024-09-20T10:00:00Z' },
  { id: 'G8b', licenseId: 'L7', usageStatus: 'usable', licenseKey: 'AH-2024-YZAB-2222', name: 'ML Predictions', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-11-01T00:00:00Z', endDate: '2026-01-31T23:59:59Z', createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  // L8 - Daily Planet
  { id: 'G9', licenseId: 'L8', usageStatus: 'usable', licenseKey: 'FB-2024-CDEF-3333', name: 'FormBuilder Pro', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-10-05T00:00:00Z', endDate: '2025-11-30T23:59:59Z', createdAt: '2024-10-05T10:00:00Z', updatedAt: '2024-10-05T10:00:00Z' },
  // L10 - Hooli
  { id: 'G10', licenseId: 'L10', usageStatus: 'usable', licenseKey: 'CM-2024-KLMN-5555', name: 'CloudMonitor Premium', grantType: 'main_license', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-11-01T00:00:00Z', endDate: '2026-03-31T23:59:59Z', createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'G10b', licenseId: 'L10', usageStatus: 'usable', licenseKey: 'CM-2024-KLMN-5555', name: 'Log Aggregation', grantType: 'sublicense', grantIdentity: 'commercial', grantState: 'active', startDate: '2024-11-15T00:00:00Z', endDate: '2026-03-31T23:59:59Z', createdAt: '2024-11-15T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
];

let activations: Activation[] = [
  // L1 / G1 - Acme full access
  { id: 'A1', grantId: 'G1', licenseId: 'L1', systemId: 'SYS-9690-A1', installationType: 'standalone', productFamily: 'DataSync', deviceName: 'ACME-WS-001', deviceFingerprint: 'fp_abc123', ipAddress: '192.168.1.10', activatedAt: '2024-02-05T09:00:00Z', lastActivationCall: '2025-03-28T14:30:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T14:30:00Z', interval: 5, activationType: 'online', productVersion: '2.1.0', isActive: true },
  { id: 'A2', grantId: 'G1', licenseId: 'L1', systemId: 'SYS-2820-A2', installationType: 'standalone', productFamily: 'DataSync', deviceName: 'ACME-WS-002', deviceFingerprint: 'fp_def456', ipAddress: '192.168.1.11', activatedAt: '2024-02-06T11:00:00Z', lastActivationCall: '2025-03-27T09:15:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-27T09:15:00Z', interval: 5, activationType: 'offline', productVersion: '2.1.0', isActive: true },
  { id: 'A20', grantId: 'G1', licenseId: 'L1', systemId: 'SYS-9726-A20', installationType: 'network', productFamily: 'DataSync', deviceName: 'ACME-WS-003', deviceFingerprint: 'fp_qqq111', ipAddress: '192.168.1.12', activatedAt: '2024-04-10T08:00:00Z', lastActivationCall: '2025-03-25T11:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-25T11:00:00Z', interval: 10, activationType: 'offline', productVersion: '4.0.0-beta', isActive: true },
  // L1 / G2 - PDF export
  { id: 'A21', grantId: 'G2', licenseId: 'L1', systemId: 'SYS-6452-A21', installationType: 'container', productFamily: 'DataSync', deviceName: 'ACME-WS-001', deviceFingerprint: 'fp_abc123', ipAddress: '192.168.1.10', activatedAt: '2024-06-02T10:00:00Z', lastActivationCall: '2025-03-28T14:30:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T14:30:00Z', interval: 15, activationType: 'offline', productVersion: '2.3.1', isActive: true },
  { id: 'A22', grantId: 'G2', licenseId: 'L1', systemId: 'SYS-6122-A22', installationType: 'container', productFamily: 'DataSync', deviceName: 'ACME-WS-004', deviceFingerprint: 'fp_rrr222', ipAddress: '192.168.1.13', activatedAt: '2024-06-15T09:00:00Z', lastActivationCall: '2025-02-20T10:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2025-02-20T10:00:00Z', interval: 15, activationType: 'online', productVersion: '2.3.1', isActive: false },
  // L1 / G2b - API access
  { id: 'A23', grantId: 'G2b', licenseId: 'L1', systemId: 'SYS-0099-A23', installationType: 'embedded', productFamily: 'DataSync', deviceName: 'ACME-API-SRV', deviceFingerprint: 'fp_sss333', ipAddress: '192.168.1.100', activatedAt: '2024-08-05T07:00:00Z', lastActivationCall: '2025-03-28T16:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T16:00:00Z', interval: 60, activationType: 'hybrid', productVersion: '3.0.1', isActive: true },
  // L2 / G3 - Globex standard
  { id: 'A3', grantId: 'G3', licenseId: 'L2', systemId: 'SYS-0822-A3', installationType: 'container', productFamily: 'DataSync', deviceName: 'GLOBEX-SRV-01', deviceFingerprint: 'fp_ghi789', ipAddress: '10.0.0.5', activatedAt: '2024-03-20T08:00:00Z', lastActivationCall: '2025-03-28T16:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T16:00:00Z', interval: 15, activationType: 'hybrid', productVersion: '2.3.1', isActive: true },
  { id: 'A24', grantId: 'G3', licenseId: 'L2', systemId: 'SYS-1185-A24', installationType: 'standalone', productFamily: 'DataSync', deviceName: 'GLOBEX-SRV-02', deviceFingerprint: 'fp_ttt444', ipAddress: '10.0.0.6', activatedAt: '2024-04-01T10:00:00Z', lastActivationCall: '2025-03-28T15:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T15:00:00Z', interval: 5, activationType: 'online', productVersion: '3.2.0', isActive: true },
  { id: 'A25', grantId: 'G3', licenseId: 'L2', systemId: 'SYS-7617-A25', installationType: 'container', productFamily: 'DataSync', deviceName: 'GLOBEX-DEV-01', deviceFingerprint: 'fp_uuu555', ipAddress: '10.0.1.10', activatedAt: '2024-04-15T09:00:00Z', lastActivationCall: '2025-03-20T08:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2025-03-20T08:00:00Z', interval: 15, activationType: 'offline', productVersion: '1.9.5', isActive: false },
  // L2 / G3b - Realtime sync
  { id: 'A26', grantId: 'G3b', licenseId: 'L2', systemId: 'SYS-9898-A26', installationType: 'cloud', productFamily: 'DataSync', deviceName: 'GLOBEX-SRV-01', deviceFingerprint: 'fp_ghi789', ipAddress: '10.0.0.5', activatedAt: '2024-05-05T10:00:00Z', lastActivationCall: '2025-03-28T16:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T16:00:00Z', interval: 30, activationType: 'offline', productVersion: '2.0.0', isActive: true },
  // L3 / G4 - Wayne vault
  { id: 'A27', grantId: 'G4', licenseId: 'L3', systemId: 'SYS-6545-A27', installationType: 'standalone', productFamily: 'SecureVault', deviceName: 'WAYNE-SEC-01', deviceFingerprint: 'fp_vvv666', ipAddress: '10.10.0.1', activatedAt: '2024-01-15T09:00:00Z', lastActivationCall: '2024-12-30T23:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2024-12-30T23:00:00Z', interval: 5, activationType: 'offline', productVersion: '3.2.0', isActive: false },
  { id: 'A28', grantId: 'G4', licenseId: 'L3', systemId: 'SYS-5625-A28', installationType: 'standalone', productFamily: 'SecureVault', deviceName: 'WAYNE-SEC-02', deviceFingerprint: 'fp_www777', ipAddress: '10.10.0.2', activatedAt: '2024-02-01T10:00:00Z', lastActivationCall: '2024-12-30T22:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2024-12-30T22:00:00Z', interval: 5, activationType: 'hybrid', productVersion: '3.2.0', isActive: false },
  // L3 / G4b - Wayne MFA
  { id: 'A29', grantId: 'G4b', licenseId: 'L3', systemId: 'SYS-5741-A29', installationType: 'network', productFamily: 'SecureVault', deviceName: 'WAYNE-SEC-01', deviceFingerprint: 'fp_vvv666', ipAddress: '10.10.0.1', activatedAt: '2024-03-05T08:00:00Z', lastActivationCall: '2024-12-30T23:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2024-12-30T23:00:00Z', interval: 10, activationType: 'online', productVersion: '2.2.0', isActive: false },
  // L4 / G5 - Stark monitoring
  { id: 'A4', grantId: 'G5', licenseId: 'L4', systemId: 'SYS-8304-A4', installationType: 'embedded', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-01', deviceFingerprint: 'fp_jkl012', ipAddress: '172.16.0.1', activatedAt: '2024-07-05T10:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 60, activationType: 'offline', productVersion: '3.1.0', isActive: true },
  { id: 'A5', grantId: 'G5', licenseId: 'L4', systemId: 'SYS-2234-A5', installationType: 'embedded', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-02', deviceFingerprint: 'fp_mno345', ipAddress: '172.16.0.2', activatedAt: '2024-07-05T10:30:00Z', lastActivationCall: '2025-03-20T08:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2025-03-20T08:00:00Z', interval: 60, activationType: 'hybrid', productVersion: '3.1.0', isActive: false },
  { id: 'A30', grantId: 'G5', licenseId: 'L4', systemId: 'SYS-6156-A30', installationType: 'network', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-03', deviceFingerprint: 'fp_xxx888', ipAddress: '172.16.0.3', activatedAt: '2024-08-01T09:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 10, activationType: 'online', productVersion: '4.0.0-beta', isActive: true },
  { id: 'A31', grantId: 'G5', licenseId: 'L4', systemId: 'SYS-5948-A31', installationType: 'cloud', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-04', deviceFingerprint: 'fp_yyy999', ipAddress: '172.16.0.4', activatedAt: '2024-09-01T10:00:00Z', lastActivationCall: '2025-03-28T11:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T11:00:00Z', interval: 30, activationType: 'hybrid', productVersion: '2.0.0', isActive: true },
  // L4 / G5b - Stark alerts
  { id: 'A32', grantId: 'G5b', licenseId: 'L4', systemId: 'SYS-9337-A32', installationType: 'container', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-01', deviceFingerprint: 'fp_jkl012', ipAddress: '172.16.0.1', activatedAt: '2024-07-10T10:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 15, activationType: 'hybrid', productVersion: '1.9.5', isActive: true },
  { id: 'A33', grantId: 'G5b', licenseId: 'L4', systemId: 'SYS-5538-A33', installationType: 'cloud', productFamily: 'CloudMonitor', deviceName: 'STARK-NODE-03', deviceFingerprint: 'fp_xxx888', ipAddress: '172.16.0.3', activatedAt: '2024-08-05T09:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 30, activationType: 'online', productVersion: '2.0.0', isActive: true },
  // L4 / G5c - Stark custom dash
  { id: 'A34', grantId: 'G5c', licenseId: 'L4', systemId: 'SYS-0610-A34', installationType: 'standalone', productFamily: 'CloudMonitor', deviceName: 'STARK-DASH-01', deviceFingerprint: 'fp_aaa001', ipAddress: '172.16.1.1', activatedAt: '2024-09-05T08:00:00Z', lastActivationCall: '2025-03-28T10:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T10:00:00Z', interval: 5, activationType: 'online', productVersion: '2.1.0', isActive: true },
  // L6 / G7 - Oscorp devtool
  { id: 'A35', grantId: 'G7', licenseId: 'L6', systemId: 'SYS-6501-A35', installationType: 'network', productFamily: 'DevToolkit', deviceName: 'OSCORP-DEV-01', deviceFingerprint: 'fp_bbb002', ipAddress: '10.20.0.1', activatedAt: '2024-08-15T09:00:00Z', lastActivationCall: '2025-03-27T14:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-27T14:00:00Z', interval: 10, activationType: 'offline', productVersion: '2.2.0', isActive: true },
  { id: 'A36', grantId: 'G7', licenseId: 'L6', systemId: 'SYS-1871-A36', installationType: 'network', productFamily: 'DevToolkit', deviceName: 'OSCORP-DEV-02', deviceFingerprint: 'fp_ccc003', ipAddress: '10.20.0.2', activatedAt: '2024-08-20T10:00:00Z', lastActivationCall: '2025-03-26T09:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-26T09:00:00Z', interval: 10, activationType: 'online', productVersion: '2.2.0', isActive: true },
  { id: 'A37', grantId: 'G7', licenseId: 'L6', systemId: 'SYS-0033-A37', installationType: 'cloud', productFamily: 'DevToolkit', deviceName: 'OSCORP-DEV-03', deviceFingerprint: 'fp_ddd004', ipAddress: '10.20.0.3', activatedAt: '2024-09-10T11:00:00Z', lastActivationCall: '2025-03-10T08:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2025-03-10T08:00:00Z', interval: 30, activationType: 'online', productVersion: '3.0.0', isActive: false },
  // L6 / G7b - Oscorp CI/CD
  { id: 'A38', grantId: 'G7b', licenseId: 'L6', systemId: 'SYS-4648-A38', installationType: 'cloud', productFamily: 'DevToolkit', deviceName: 'OSCORP-CI-01', deviceFingerprint: 'fp_eee005', ipAddress: '10.20.1.1', activatedAt: '2024-09-15T08:00:00Z', lastActivationCall: '2025-03-28T07:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T07:00:00Z', interval: 30, activationType: 'hybrid', productVersion: '2.0.0', isActive: true },
  // L7 / G8 - LexCorp analytics
  { id: 'A39', grantId: 'G8', licenseId: 'L7', systemId: 'SYS-1544-A39', installationType: 'embedded', productFamily: 'AnalyticsHub', deviceName: 'LEX-ANALYTICS-01', deviceFingerprint: 'fp_fff006', ipAddress: '10.30.0.1', activatedAt: '2024-09-25T09:00:00Z', lastActivationCall: '2025-03-28T15:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T15:00:00Z', interval: 60, activationType: 'hybrid', productVersion: '3.1.0', isActive: true },
  { id: 'A40', grantId: 'G8', licenseId: 'L7', systemId: 'SYS-2314-A40', installationType: 'embedded', productFamily: 'AnalyticsHub', deviceName: 'LEX-ANALYTICS-02', deviceFingerprint: 'fp_ggg007', ipAddress: '10.30.0.2', activatedAt: '2024-10-01T10:00:00Z', lastActivationCall: '2025-03-28T14:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T14:00:00Z', interval: 60, activationType: 'offline', productVersion: '3.1.0', isActive: true },
  { id: 'A41', grantId: 'G8', licenseId: 'L7', systemId: 'SYS-8920-A41', installationType: 'standalone', productFamily: 'AnalyticsHub', deviceName: 'LEX-ANALYTICS-03', deviceFingerprint: 'fp_hhh008', ipAddress: '10.30.0.3', activatedAt: '2024-10-15T11:00:00Z', lastActivationCall: '2025-03-28T13:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T13:00:00Z', interval: 5, activationType: 'online', productVersion: '2.1.0', isActive: true },
  // L7 / G8b - LexCorp ML
  { id: 'A42', grantId: 'G8b', licenseId: 'L7', systemId: 'SYS-6312-A42', installationType: 'container', productFamily: 'AnalyticsHub', deviceName: 'LEX-ML-01', deviceFingerprint: 'fp_iii009', ipAddress: '10.30.1.1', activatedAt: '2024-11-05T08:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 15, activationType: 'online', productVersion: '2.3.1', isActive: true },
  // L8 / G9 - Daily Planet
  { id: 'A43', grantId: 'G9', licenseId: 'L8', systemId: 'SYS-7473-A43', installationType: 'cloud', productFamily: 'FormBuilder', deviceName: 'DP-DESK-001', deviceFingerprint: 'fp_jjj010', ipAddress: '10.40.0.1', activatedAt: '2024-10-10T09:00:00Z', lastActivationCall: '2025-03-28T11:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T11:00:00Z', interval: 30, activationType: 'offline', productVersion: '3.0.0', isActive: true },
  { id: 'A44', grantId: 'G9', licenseId: 'L8', systemId: 'SYS-8124-A44', installationType: 'embedded', productFamily: 'FormBuilder', deviceName: 'DP-DESK-002', deviceFingerprint: 'fp_kkk011', ipAddress: '10.40.0.2', activatedAt: '2024-10-12T10:00:00Z', lastActivationCall: '2025-03-27T10:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-27T10:00:00Z', interval: 60, activationType: 'online', productVersion: '3.1.0', isActive: true },
  // L10 / G10 - Hooli
  { id: 'A45', grantId: 'G10', licenseId: 'L10', systemId: 'SYS-0899-A45', installationType: 'embedded', productFamily: 'CloudMonitor', deviceName: 'HOOLI-SRV-01', deviceFingerprint: 'fp_lll012', ipAddress: '10.50.0.1', activatedAt: '2024-11-05T09:00:00Z', lastActivationCall: '2025-03-28T16:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T16:00:00Z', interval: 60, activationType: 'offline', productVersion: '3.0.1', isActive: true },
  { id: 'A46', grantId: 'G10', licenseId: 'L10', systemId: 'SYS-4127-A46', installationType: 'container', productFamily: 'CloudMonitor', deviceName: 'HOOLI-SRV-02', deviceFingerprint: 'fp_mmm013', ipAddress: '10.50.0.2', activatedAt: '2024-11-10T10:00:00Z', lastActivationCall: '2025-03-28T15:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T15:00:00Z', interval: 15, activationType: 'online', productVersion: '1.9.5', isActive: true },
  { id: 'A47', grantId: 'G10', licenseId: 'L10', systemId: 'SYS-5896-A47', installationType: 'network', productFamily: 'CloudMonitor', deviceName: 'HOOLI-SRV-03', deviceFingerprint: 'fp_nnn014', ipAddress: '10.50.0.3', activatedAt: '2024-11-15T11:00:00Z', lastActivationCall: '2025-03-28T14:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T14:00:00Z', interval: 10, activationType: 'hybrid', productVersion: '4.0.0-beta', isActive: true },
  { id: 'A48', grantId: 'G10', licenseId: 'L10', systemId: 'SYS-0673-A48', installationType: 'cloud', productFamily: 'CloudMonitor', deviceName: 'HOOLI-DEV-01', deviceFingerprint: 'fp_ooo015', ipAddress: '10.50.1.1', activatedAt: '2024-12-01T08:00:00Z', lastActivationCall: '2025-03-20T09:00:00Z', lastProductActivationState: 'deactivated', lastSeenAt: '2025-03-20T09:00:00Z', interval: 30, activationType: 'hybrid', productVersion: '3.0.0', isActive: false },
  // L10 / G10b - Hooli log agg
  { id: 'A49', grantId: 'G10b', licenseId: 'L10', systemId: 'SYS-3129-A49', installationType: 'embedded', productFamily: 'CloudMonitor', deviceName: 'HOOLI-LOG-01', deviceFingerprint: 'fp_ppp016', ipAddress: '10.50.2.1', activatedAt: '2024-11-20T09:00:00Z', lastActivationCall: '2025-03-28T13:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T13:00:00Z', interval: 60, activationType: 'hybrid', productVersion: '3.0.1', isActive: true },
  { id: 'A50', grantId: 'G10b', licenseId: 'L10', systemId: 'SYS-3723-A50', installationType: 'cloud', productFamily: 'CloudMonitor', deviceName: 'HOOLI-LOG-02', deviceFingerprint: 'fp_qqq017', ipAddress: '10.50.2.2', activatedAt: '2024-12-01T10:00:00Z', lastActivationCall: '2025-03-28T12:00:00Z', lastProductActivationState: 'activated', lastSeenAt: '2025-03-28T12:00:00Z', interval: 30, activationType: 'online', productVersion: '3.0.0', isActive: true },
];

let responseLogs: ResponseLog[] = [
  // A1
  { id: 'RL1', activationId: 'A1', result: 'approved', reasonCode: 'VALID', details: 'License and grant valid, activation permitted', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'RL2', activationId: 'A1', result: 'approved', reasonCode: 'VALID', details: 'Periodic validation check passed', timestamp: '2025-03-28T14:30:00Z' },
  { id: 'RL50', activationId: 'A1', result: 'approved', reasonCode: 'VALID', details: 'Heartbeat check passed', timestamp: '2025-02-15T10:00:00Z' },
  { id: 'RL51', activationId: 'A1', result: 'denied', reasonCode: 'RATE_LIMIT', details: 'Validation rate limit exceeded, retry after 60s', timestamp: '2025-01-10T12:00:00Z' },
  // A2
  { id: 'RL3', activationId: 'A2', result: 'approved', reasonCode: 'VALID', details: 'License and grant valid, activation permitted', timestamp: '2024-02-06T11:00:00Z' },
  { id: 'RL52', activationId: 'A2', result: 'approved', reasonCode: 'VALID', details: 'Heartbeat passed', timestamp: '2025-03-01T08:00:00Z' },
  // A20
  { id: 'RL53', activationId: 'A20', result: 'approved', reasonCode: 'VALID', details: 'Initial activation approved', timestamp: '2024-04-10T08:00:00Z' },
  // A21
  { id: 'RL54', activationId: 'A21', result: 'approved', reasonCode: 'VALID', details: 'PDF export grant activated', timestamp: '2024-06-02T10:00:00Z' },
  // A22
  { id: 'RL55', activationId: 'A22', result: 'approved', reasonCode: 'VALID', details: 'Activation approved', timestamp: '2024-06-15T09:00:00Z' },
  { id: 'RL56', activationId: 'A22', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Device deactivated by admin', timestamp: '2025-02-20T10:00:00Z' },
  // A3
  { id: 'RL4', activationId: 'A3', result: 'approved', reasonCode: 'VALID', details: 'First activation on grant', timestamp: '2024-03-20T08:00:00Z' },
  { id: 'RL57', activationId: 'A3', result: 'approved', reasonCode: 'VALID', details: 'Validation passed', timestamp: '2025-03-01T09:00:00Z' },
  // A24
  { id: 'RL58', activationId: 'A24', result: 'approved', reasonCode: 'VALID', details: 'Activation approved', timestamp: '2024-04-01T10:00:00Z' },
  // A25
  { id: 'RL59', activationId: 'A25', result: 'approved', reasonCode: 'VALID', details: 'Initial activation', timestamp: '2024-04-15T09:00:00Z' },
  { id: 'RL60', activationId: 'A25', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Device offline, deactivated', timestamp: '2025-03-20T08:00:00Z' },
  // A5
  { id: 'RL5', activationId: 'A5', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Activation has been deactivated', timestamp: '2025-03-20T08:00:00Z' },
  // A4
  { id: 'RL6', activationId: 'A4', result: 'approved', reasonCode: 'VALID', details: 'Heartbeat check passed', timestamp: '2025-03-28T12:00:00Z' },
  { id: 'RL61', activationId: 'A4', result: 'approved', reasonCode: 'VALID', details: 'Initial activation', timestamp: '2024-07-05T10:00:00Z' },
  // A30-A34
  { id: 'RL62', activationId: 'A30', result: 'approved', reasonCode: 'VALID', details: 'Node 03 activated', timestamp: '2024-08-01T09:00:00Z' },
  { id: 'RL63', activationId: 'A31', result: 'approved', reasonCode: 'VALID', details: 'Node 04 activated', timestamp: '2024-09-01T10:00:00Z' },
  { id: 'RL64', activationId: 'A32', result: 'approved', reasonCode: 'VALID', details: 'Alerting activated on node 01', timestamp: '2024-07-10T10:00:00Z' },
  { id: 'RL65', activationId: 'A33', result: 'approved', reasonCode: 'VALID', details: 'Alerting activated on node 03', timestamp: '2024-08-05T09:00:00Z' },
  { id: 'RL66', activationId: 'A34', result: 'approved', reasonCode: 'VALID', details: 'Dashboard access activated', timestamp: '2024-09-05T08:00:00Z' },
  // Oscorp
  { id: 'RL67', activationId: 'A35', result: 'approved', reasonCode: 'VALID', details: 'DevToolkit activated', timestamp: '2024-08-15T09:00:00Z' },
  { id: 'RL68', activationId: 'A36', result: 'approved', reasonCode: 'VALID', details: 'DevToolkit activated', timestamp: '2024-08-20T10:00:00Z' },
  { id: 'RL69', activationId: 'A37', result: 'approved', reasonCode: 'VALID', details: 'Initial activation', timestamp: '2024-09-10T11:00:00Z' },
  { id: 'RL70', activationId: 'A37', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Device removed from fleet', timestamp: '2025-03-10T08:00:00Z' },
  { id: 'RL71', activationId: 'A38', result: 'approved', reasonCode: 'VALID', details: 'CI/CD runner activated', timestamp: '2024-09-15T08:00:00Z' },
  // LexCorp
  { id: 'RL72', activationId: 'A39', result: 'approved', reasonCode: 'VALID', details: 'Analytics suite activated', timestamp: '2024-09-25T09:00:00Z' },
  { id: 'RL73', activationId: 'A40', result: 'approved', reasonCode: 'VALID', details: 'Activated', timestamp: '2024-10-01T10:00:00Z' },
  { id: 'RL74', activationId: 'A41', result: 'approved', reasonCode: 'VALID', details: 'Activated', timestamp: '2024-10-15T11:00:00Z' },
  { id: 'RL75', activationId: 'A42', result: 'approved', reasonCode: 'VALID', details: 'ML module activated', timestamp: '2024-11-05T08:00:00Z' },
  // Daily Planet
  { id: 'RL76', activationId: 'A43', result: 'approved', reasonCode: 'VALID', details: 'FormBuilder activated', timestamp: '2024-10-10T09:00:00Z' },
  { id: 'RL77', activationId: 'A44', result: 'approved', reasonCode: 'VALID', details: 'FormBuilder activated', timestamp: '2024-10-12T10:00:00Z' },
  // Hooli
  { id: 'RL78', activationId: 'A45', result: 'approved', reasonCode: 'VALID', details: 'Monitor activated', timestamp: '2024-11-05T09:00:00Z' },
  { id: 'RL79', activationId: 'A46', result: 'approved', reasonCode: 'VALID', details: 'Monitor activated', timestamp: '2024-11-10T10:00:00Z' },
  { id: 'RL80', activationId: 'A47', result: 'approved', reasonCode: 'VALID', details: 'Monitor activated', timestamp: '2024-11-15T11:00:00Z' },
  { id: 'RL81', activationId: 'A48', result: 'approved', reasonCode: 'VALID', details: 'Initial activation', timestamp: '2024-12-01T08:00:00Z' },
  { id: 'RL82', activationId: 'A48', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Dev environment decommissioned', timestamp: '2025-03-20T09:00:00Z' },
  { id: 'RL83', activationId: 'A49', result: 'approved', reasonCode: 'VALID', details: 'Log aggregation started', timestamp: '2024-11-20T09:00:00Z' },
  { id: 'RL84', activationId: 'A50', result: 'approved', reasonCode: 'VALID', details: 'Log aggregation started', timestamp: '2024-12-01T10:00:00Z' },
];

let historyLogs: HistoryLog[] = [
  // A1
  { id: 'HL1', activationId: 'A1', fromState: '', toState: 'activated', reason: 'Initial activation', performedBy: 'admin@acme.com', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'HL20', activationId: 'A1', fromState: 'activated', toState: 'suspended', reason: 'Maintenance window', performedBy: 'sarah@support.com', timestamp: '2024-08-01T10:00:00Z' },
  { id: 'HL21', activationId: 'A1', fromState: 'suspended', toState: 'reactivated', reason: 'Maintenance complete', performedBy: 'sarah@support.com', timestamp: '2024-08-02T08:00:00Z' },
  // A2
  { id: 'HL2', activationId: 'A2', fromState: '', toState: 'activated', reason: 'Initial activation', performedBy: 'admin@acme.com', timestamp: '2024-02-06T11:00:00Z' },
  // A20
  { id: 'HL22', activationId: 'A20', fromState: '', toState: 'activated', reason: 'New workstation added', performedBy: 'admin@acme.com', timestamp: '2024-04-10T08:00:00Z' },
  // A21
  { id: 'HL23', activationId: 'A21', fromState: '', toState: 'activated', reason: 'PDF export enabled', performedBy: 'admin@acme.com', timestamp: '2024-06-02T10:00:00Z' },
  // A22
  { id: 'HL24', activationId: 'A22', fromState: '', toState: 'activated', reason: 'PDF export enabled', performedBy: 'admin@acme.com', timestamp: '2024-06-15T09:00:00Z' },
  { id: 'HL25', activationId: 'A22', fromState: 'activated', toState: 'deactivated', reason: 'Device retired', performedBy: 'mike@support.com', timestamp: '2025-02-20T10:00:00Z' },
  // A23
  { id: 'HL26', activationId: 'A23', fromState: '', toState: 'activated', reason: 'API server deployed', performedBy: 'admin@acme.com', timestamp: '2024-08-05T07:00:00Z' },
  // A3
  { id: 'HL3', activationId: 'A3', fromState: '', toState: 'activated', reason: 'Server deployment', performedBy: 'it@globex.com', timestamp: '2024-03-20T08:00:00Z' },
  // A24
  { id: 'HL27', activationId: 'A24', fromState: '', toState: 'activated', reason: 'Second server', performedBy: 'it@globex.com', timestamp: '2024-04-01T10:00:00Z' },
  // A25
  { id: 'HL28', activationId: 'A25', fromState: '', toState: 'activated', reason: 'Dev environment', performedBy: 'it@globex.com', timestamp: '2024-04-15T09:00:00Z' },
  { id: 'HL29', activationId: 'A25', fromState: 'activated', toState: 'deactivated', reason: 'Dev environment shut down', performedBy: 'it@globex.com', timestamp: '2025-03-20T08:00:00Z' },
  // A27-A29
  { id: 'HL30', activationId: 'A27', fromState: '', toState: 'activated', reason: 'Security deployment', performedBy: 'bruce@wayne.com', timestamp: '2024-01-15T09:00:00Z' },
  { id: 'HL31', activationId: 'A27', fromState: 'activated', toState: 'expired', reason: 'Grant expired', performedBy: 'system', timestamp: '2025-01-01T00:00:00Z' },
  { id: 'HL32', activationId: 'A28', fromState: '', toState: 'activated', reason: 'Backup node', performedBy: 'bruce@wayne.com', timestamp: '2024-02-01T10:00:00Z' },
  { id: 'HL33', activationId: 'A28', fromState: 'activated', toState: 'expired', reason: 'Grant expired', performedBy: 'system', timestamp: '2025-01-01T00:00:00Z' },
  { id: 'HL34', activationId: 'A29', fromState: '', toState: 'activated', reason: 'MFA enabled', performedBy: 'bruce@wayne.com', timestamp: '2024-03-05T08:00:00Z' },
  { id: 'HL35', activationId: 'A29', fromState: 'activated', toState: 'expired', reason: 'Grant expired', performedBy: 'system', timestamp: '2025-01-01T00:00:00Z' },
  // A4
  { id: 'HL4', activationId: 'A4', fromState: '', toState: 'activated', reason: 'Node provisioning', performedBy: 'pepper@stark.com', timestamp: '2024-07-05T10:00:00Z' },
  // A5
  { id: 'HL5', activationId: 'A5', fromState: '', toState: 'activated', reason: 'Node provisioning', performedBy: 'pepper@stark.com', timestamp: '2024-07-05T10:30:00Z' },
  { id: 'HL6', activationId: 'A5', fromState: 'activated', toState: 'deactivated', reason: 'Node decommissioned', performedBy: 'pepper@stark.com', timestamp: '2025-03-15T10:00:00Z' },
  // A30-A34
  { id: 'HL36', activationId: 'A30', fromState: '', toState: 'activated', reason: 'Node 03 added', performedBy: 'pepper@stark.com', timestamp: '2024-08-01T09:00:00Z' },
  { id: 'HL37', activationId: 'A31', fromState: '', toState: 'activated', reason: 'Node 04 added', performedBy: 'pepper@stark.com', timestamp: '2024-09-01T10:00:00Z' },
  { id: 'HL38', activationId: 'A32', fromState: '', toState: 'activated', reason: 'Alerting enabled', performedBy: 'pepper@stark.com', timestamp: '2024-07-10T10:00:00Z' },
  { id: 'HL39', activationId: 'A33', fromState: '', toState: 'activated', reason: 'Alerting enabled on node 03', performedBy: 'pepper@stark.com', timestamp: '2024-08-05T09:00:00Z' },
  { id: 'HL40', activationId: 'A34', fromState: '', toState: 'activated', reason: 'Dashboard provisioned', performedBy: 'pepper@stark.com', timestamp: '2024-09-05T08:00:00Z' },
  // Oscorp
  { id: 'HL41', activationId: 'A35', fromState: '', toState: 'activated', reason: 'Developer onboarded', performedBy: 'norman@oscorp.com', timestamp: '2024-08-15T09:00:00Z' },
  { id: 'HL42', activationId: 'A36', fromState: '', toState: 'activated', reason: 'Developer onboarded', performedBy: 'norman@oscorp.com', timestamp: '2024-08-20T10:00:00Z' },
  { id: 'HL43', activationId: 'A37', fromState: '', toState: 'activated', reason: 'Developer onboarded', performedBy: 'norman@oscorp.com', timestamp: '2024-09-10T11:00:00Z' },
  { id: 'HL44', activationId: 'A37', fromState: 'activated', toState: 'deactivated', reason: 'Device removed from fleet', performedBy: 'norman@oscorp.com', timestamp: '2025-03-10T08:00:00Z' },
  { id: 'HL45', activationId: 'A38', fromState: '', toState: 'activated', reason: 'CI runner deployed', performedBy: 'norman@oscorp.com', timestamp: '2024-09-15T08:00:00Z' },
  // LexCorp
  { id: 'HL46', activationId: 'A39', fromState: '', toState: 'activated', reason: 'Analytics node', performedBy: 'admin@lexcorp.com', timestamp: '2024-09-25T09:00:00Z' },
  { id: 'HL47', activationId: 'A40', fromState: '', toState: 'activated', reason: 'Analytics node 2', performedBy: 'admin@lexcorp.com', timestamp: '2024-10-01T10:00:00Z' },
  { id: 'HL48', activationId: 'A41', fromState: '', toState: 'activated', reason: 'Analytics node 3', performedBy: 'admin@lexcorp.com', timestamp: '2024-10-15T11:00:00Z' },
  { id: 'HL49', activationId: 'A42', fromState: '', toState: 'activated', reason: 'ML module deployed', performedBy: 'admin@lexcorp.com', timestamp: '2024-11-05T08:00:00Z' },
  // Daily Planet
  { id: 'HL50', activationId: 'A43', fromState: '', toState: 'activated', reason: 'Desktop install', performedBy: 'clark@dailyplanet.com', timestamp: '2024-10-10T09:00:00Z' },
  { id: 'HL51', activationId: 'A44', fromState: '', toState: 'activated', reason: 'Desktop install', performedBy: 'clark@dailyplanet.com', timestamp: '2024-10-12T10:00:00Z' },
  // Hooli
  { id: 'HL52', activationId: 'A45', fromState: '', toState: 'activated', reason: 'Production server', performedBy: 'gavin@hooli.com', timestamp: '2024-11-05T09:00:00Z' },
  { id: 'HL53', activationId: 'A46', fromState: '', toState: 'activated', reason: 'Production server 2', performedBy: 'gavin@hooli.com', timestamp: '2024-11-10T10:00:00Z' },
  { id: 'HL54', activationId: 'A47', fromState: '', toState: 'activated', reason: 'Production server 3', performedBy: 'gavin@hooli.com', timestamp: '2024-11-15T11:00:00Z' },
  { id: 'HL55', activationId: 'A48', fromState: '', toState: 'activated', reason: 'Dev environment', performedBy: 'gavin@hooli.com', timestamp: '2024-12-01T08:00:00Z' },
  { id: 'HL56', activationId: 'A48', fromState: 'activated', toState: 'deactivated', reason: 'Dev env decommissioned', performedBy: 'gavin@hooli.com', timestamp: '2025-03-20T09:00:00Z' },
  { id: 'HL57', activationId: 'A49', fromState: '', toState: 'activated', reason: 'Log collector deployed', performedBy: 'gavin@hooli.com', timestamp: '2024-11-20T09:00:00Z' },
  { id: 'HL58', activationId: 'A50', fromState: '', toState: 'activated', reason: 'Log collector 2', performedBy: 'gavin@hooli.com', timestamp: '2024-12-01T10:00:00Z' },
];

let nextId = 200;
const genId = () => String(nextId++);
const now = () => new Date().toISOString();

productSnap = [...products];
licenseSnap = [...licenses];
grantSnap = [...grants];
activationSnap = [...activations];
responseLogSnap = [...responseLogs];
historyLogSnap = [...historyLogs];

// Products
export const getProducts = () => productSnap;
export const getProduct = (id: string) => products.find(p => p.id === id);
export const createProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const p: Product = { ...data, id: genId(), createdAt: now(), updatedAt: now() };
  products = [...products, p]; notify(); return p;
};
export const updateProduct = (id: string, data: Partial<Product>) => {
  products = products.map(p => p.id === id ? { ...p, ...data, updatedAt: now() } : p); notify();
};
export const deleteProduct = (id: string) => { products = products.filter(p => p.id !== id); notify(); };

// Licenses
export const getLicenses = () => licenseSnap;
export const getLicense = (id: string) => licenses.find(l => l.id === id);
export const getLicensesByProduct = (productId: string) => licenses.filter(l => l.productId === productId);
export const createLicense = (data: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => {
  const l: License = { ...data, id: genId(), createdAt: now(), updatedAt: now() };
  licenses = [...licenses, l]; notify(); return l;
};
export const updateLicense = (id: string, data: Partial<License>) => {
  licenses = licenses.map(l => l.id === id ? { ...l, ...data, updatedAt: now() } : l); notify();
};
export const deleteLicense = (id: string) => { licenses = licenses.filter(l => l.id !== id); notify(); };

// Grants
export const getGrants = () => grantSnap;
export const getGrant = (id: string) => grants.find(g => g.id === id);
export const getGrantsByLicense = (licenseId: string) => grants.filter(g => g.licenseId === licenseId);
export const createGrant = (data: Omit<Grant, 'id' | 'createdAt' | 'updatedAt'>) => {
  const g: Grant = { ...data, id: genId(), createdAt: now(), updatedAt: now() };
  grants = [...grants, g]; notify(); return g;
};
export const updateGrant = (id: string, data: Partial<Grant>) => {
  grants = grants.map(g => g.id === id ? { ...g, ...data, updatedAt: now() } : g); notify();
};
export const deleteGrant = (id: string) => { grants = grants.filter(g => g.id !== id); notify(); };

// Activations
export const getActivations = () => activationSnap;
export const getActivationsByGrant = (grantId: string) => activations.filter(a => a.grantId === grantId);
export const getActivationsByLicense = (licenseId: string) => activations.filter(a => a.licenseId === licenseId);
export const createActivation = (data: Omit<Activation, 'id'>) => {
  const a: Activation = { ...data, id: genId() };
  activations = [...activations, a]; notify(); return a;
};
export const updateActivation = (id: string, data: Partial<Activation>) => {
  activations = activations.map(a => a.id === id ? { ...a, ...data } : a); notify();
};
export const deleteActivation = (id: string) => { activations = activations.filter(a => a.id !== id); notify(); };

// Response Logs
export const getResponseLogs = () => responseLogSnap;
export const getResponseLogsByActivation = (activationId: string) => responseLogs.filter(r => r.activationId === activationId);
export const createResponseLog = (data: Omit<ResponseLog, 'id'>) => {
  const r: ResponseLog = { ...data, id: genId() };
  responseLogs = [...responseLogs, r]; notify(); return r;
};

// History Logs
export const getHistoryLogs = () => historyLogSnap;
export const getHistoryLogsByActivation = (activationId: string) => historyLogs.filter(h => h.activationId === activationId);
export const createHistoryLog = (data: Omit<HistoryLog, 'id'>) => {
  const h: HistoryLog = { ...data, id: genId() };
  historyLogs = [...historyLogs, h]; notify(); return h;
};

// Hook
export function useStore() {
  return {
    products: getProducts(),
    licenses: getLicenses(),
    grants: getGrants(),
    activations: getActivations(),
    responseLogs: getResponseLogs(),
    historyLogs: getHistoryLogs(),
  };
}
