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
];

let licenses: License[] = [
  { id: 'L1', licenseKey: 'DSP-2024-ABCD-1234', productId: '1', customerName: 'Acme Corp', customerEmail: 'admin@acme.com', status: 'active', maxActivations: 5, expiresAt: '2025-12-31T23:59:59Z', notes: 'Enterprise plan', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'L2', licenseKey: 'DSP-2024-EFGH-5678', productId: '1', customerName: 'Globex Inc', customerEmail: 'it@globex.com', status: 'active', maxActivations: 10, expiresAt: '2025-06-30T23:59:59Z', notes: '', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'L3', licenseKey: 'SV-2024-IJKL-9012', productId: '2', customerName: 'Wayne Enterprises', customerEmail: 'bruce@wayne.com', status: 'expired', maxActivations: 3, expiresAt: '2024-12-31T23:59:59Z', notes: 'Renewal pending', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z' },
  { id: 'L4', licenseKey: 'CM-2024-MNOP-3456', productId: '3', customerName: 'Stark Industries', customerEmail: 'pepper@stark.com', status: 'active', maxActivations: 20, expiresAt: null, notes: 'Lifetime license', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  { id: 'L5', licenseKey: 'SV-2024-QRST-7890', productId: '2', customerName: 'Umbrella Corp', customerEmail: 'admin@umbrella.com', status: 'suspended', maxActivations: 2, expiresAt: '2025-03-31T23:59:59Z', notes: 'Payment issue', createdAt: '2024-04-20T10:00:00Z', updatedAt: '2024-04-20T10:00:00Z' },
];

let grants: Grant[] = [
  { id: 'G1', licenseId: 'L1', name: '2024 Annual Access', featureCode: 'full-access', status: 'active', maxActivations: 5, startsAt: '2024-02-01T00:00:00Z', expiresAt: '2025-12-31T23:59:59Z', metadata: '', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'G2', licenseId: 'L1', name: 'PDF Export Add-on', featureCode: 'pdf-export', status: 'active', maxActivations: 3, startsAt: '2024-06-01T00:00:00Z', expiresAt: '2025-12-31T23:59:59Z', metadata: '', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: 'G3', licenseId: 'L2', name: '2024 Standard Access', featureCode: 'standard', status: 'active', maxActivations: 10, startsAt: '2024-03-15T00:00:00Z', expiresAt: '2025-06-30T23:59:59Z', metadata: '', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'G4', licenseId: 'L3', name: '2024 Vault Access', featureCode: 'vault-full', status: 'expired', maxActivations: 3, startsAt: '2024-01-10T00:00:00Z', expiresAt: '2024-12-31T23:59:59Z', metadata: '', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z' },
  { id: 'G5', licenseId: 'L4', name: 'Lifetime Monitoring', featureCode: 'monitor-all', status: 'active', maxActivations: 20, startsAt: '2024-07-01T00:00:00Z', expiresAt: null, metadata: '{"tier":"enterprise"}', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  { id: 'G6', licenseId: 'L5', name: '2024 Vault Basic', featureCode: 'vault-basic', status: 'active', maxActivations: 2, startsAt: '2024-04-20T00:00:00Z', expiresAt: '2025-03-31T23:59:59Z', metadata: '', createdAt: '2024-04-20T10:00:00Z', updatedAt: '2024-04-20T10:00:00Z' },
];

let activations: Activation[] = [
  { id: 'A1', grantId: 'G1', licenseId: 'L1', deviceName: 'ACME-WS-001', deviceFingerprint: 'fp_abc123', ipAddress: '192.168.1.10', activatedAt: '2024-02-05T09:00:00Z', lastSeenAt: '2025-03-28T14:30:00Z', isActive: true },
  { id: 'A2', grantId: 'G1', licenseId: 'L1', deviceName: 'ACME-WS-002', deviceFingerprint: 'fp_def456', ipAddress: '192.168.1.11', activatedAt: '2024-02-06T11:00:00Z', lastSeenAt: '2025-03-27T09:15:00Z', isActive: true },
  { id: 'A3', grantId: 'G3', licenseId: 'L2', deviceName: 'GLOBEX-SRV-01', deviceFingerprint: 'fp_ghi789', ipAddress: '10.0.0.5', activatedAt: '2024-03-20T08:00:00Z', lastSeenAt: '2025-03-28T16:00:00Z', isActive: true },
  { id: 'A4', grantId: 'G5', licenseId: 'L4', deviceName: 'STARK-NODE-01', deviceFingerprint: 'fp_jkl012', ipAddress: '172.16.0.1', activatedAt: '2024-07-05T10:00:00Z', lastSeenAt: '2025-03-28T12:00:00Z', isActive: true },
  { id: 'A5', grantId: 'G5', licenseId: 'L4', deviceName: 'STARK-NODE-02', deviceFingerprint: 'fp_mno345', ipAddress: '172.16.0.2', activatedAt: '2024-07-05T10:30:00Z', lastSeenAt: '2025-03-20T08:00:00Z', isActive: false },
];

let responseLogs: ResponseLog[] = [
  { id: 'RL1', activationId: 'A1', result: 'approved', reasonCode: 'VALID', details: 'License and grant valid, activation permitted', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'RL2', activationId: 'A1', result: 'approved', reasonCode: 'VALID', details: 'Periodic validation check passed', timestamp: '2025-03-28T14:30:00Z' },
  { id: 'RL3', activationId: 'A2', result: 'approved', reasonCode: 'VALID', details: 'License and grant valid, activation permitted', timestamp: '2024-02-06T11:00:00Z' },
  { id: 'RL4', activationId: 'A3', result: 'approved', reasonCode: 'VALID', details: 'First activation on grant', timestamp: '2024-03-20T08:00:00Z' },
  { id: 'RL5', activationId: 'A5', result: 'denied', reasonCode: 'DEACTIVATED', details: 'Activation has been deactivated', timestamp: '2025-03-20T08:00:00Z' },
  { id: 'RL6', activationId: 'A4', result: 'approved', reasonCode: 'VALID', details: 'Heartbeat check passed', timestamp: '2025-03-28T12:00:00Z' },
];

let historyLogs: HistoryLog[] = [
  { id: 'HL1', activationId: 'A1', fromState: '', toState: 'activated', reason: 'Initial activation', performedBy: 'admin@acme.com', timestamp: '2024-02-05T09:00:00Z' },
  { id: 'HL2', activationId: 'A2', fromState: '', toState: 'activated', reason: 'Initial activation', performedBy: 'admin@acme.com', timestamp: '2024-02-06T11:00:00Z' },
  { id: 'HL3', activationId: 'A3', fromState: '', toState: 'activated', reason: 'Server deployment', performedBy: 'it@globex.com', timestamp: '2024-03-20T08:00:00Z' },
  { id: 'HL4', activationId: 'A4', fromState: '', toState: 'activated', reason: 'Node provisioning', performedBy: 'pepper@stark.com', timestamp: '2024-07-05T10:00:00Z' },
  { id: 'HL5', activationId: 'A5', fromState: '', toState: 'activated', reason: 'Node provisioning', performedBy: 'pepper@stark.com', timestamp: '2024-07-05T10:30:00Z' },
  { id: 'HL6', activationId: 'A5', fromState: 'activated', toState: 'deactivated', reason: 'Node decommissioned', performedBy: 'pepper@stark.com', timestamp: '2025-03-15T10:00:00Z' },
];

let nextId = 100;
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
