import { Product, License, Activation } from './types';

// Simple in-memory store with event-based reactivity
type Listener = () => void;
const listeners = new Set<Listener>();
let productSnap: Product[] = [];
let licenseSnap: License[] = [];
let activationSnap: Activation[] = [];
function notify() {
  productSnap = [...products];
  licenseSnap = [...licenses];
  activationSnap = [...activations];
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

let activations: Activation[] = [
  { id: 'A1', licenseId: 'L1', deviceName: 'ACME-WS-001', deviceFingerprint: 'fp_abc123', ipAddress: '192.168.1.10', activatedAt: '2024-02-05T09:00:00Z', lastSeenAt: '2025-03-28T14:30:00Z', isActive: true },
  { id: 'A2', licenseId: 'L1', deviceName: 'ACME-WS-002', deviceFingerprint: 'fp_def456', ipAddress: '192.168.1.11', activatedAt: '2024-02-06T11:00:00Z', lastSeenAt: '2025-03-27T09:15:00Z', isActive: true },
  { id: 'A3', licenseId: 'L2', deviceName: 'GLOBEX-SRV-01', deviceFingerprint: 'fp_ghi789', ipAddress: '10.0.0.5', activatedAt: '2024-03-20T08:00:00Z', lastSeenAt: '2025-03-28T16:00:00Z', isActive: true },
  { id: 'A4', licenseId: 'L4', deviceName: 'STARK-NODE-01', deviceFingerprint: 'fp_jkl012', ipAddress: '172.16.0.1', activatedAt: '2024-07-05T10:00:00Z', lastSeenAt: '2025-03-28T12:00:00Z', isActive: true },
  { id: 'A5', licenseId: 'L4', deviceName: 'STARK-NODE-02', deviceFingerprint: 'fp_mno345', ipAddress: '172.16.0.2', activatedAt: '2024-07-05T10:30:00Z', lastSeenAt: '2025-03-20T08:00:00Z', isActive: false },
];

let nextId = 100;
const genId = () => String(nextId++);
const now = () => new Date().toISOString();

// Init snapshots
productSnap = [...products];
licenseSnap = [...licenses];
activationSnap = [...activations];

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

// Activations
export const getActivations = () => activationSnap;
export const getActivationsByLicense = (licenseId: string) => activations.filter(a => a.licenseId === licenseId);
export const createActivation = (data: Omit<Activation, 'id'>) => {
  const a: Activation = { ...data, id: genId() };
  activations = [...activations, a]; notify(); return a;
};
export const updateActivation = (id: string, data: Partial<Activation>) => {
  activations = activations.map(a => a.id === id ? { ...a, ...data } : a); notify();
};
export const deleteActivation = (id: string) => { activations = activations.filter(a => a.id !== id); notify(); };

// Hook
export function useStore() {
  // We'll use this as a simple snapshot approach
  return {
    products: getProducts(),
    licenses: getLicenses(),
    activations: getActivations(),
  };
}
