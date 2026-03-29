export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'revoked';

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  status: LicenseStatus;
  maxActivations: number;
  expiresAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activation {
  id: string;
  licenseId: string;
  deviceName: string;
  deviceFingerprint: string;
  ipAddress: string;
  activatedAt: string;
  lastSeenAt: string;
  isActive: boolean;
}
