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

export type GrantUsageStatus = 'usable' | 'unusable';
export type GrantType = 'main_license' | 'sublicense';
export type GrantIdentity = 'test' | 'commercial';
export type GrantState = 'active' | 'inactive';

export interface Grant {
  id: string;
  licenseId: string;
  usageStatus: GrantUsageStatus;
  licenseKey: string;
  name: string;
  grantType: GrantType;
  grantIdentity: GrantIdentity;
  grantState: GrantState;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ActivationType = 'online' | 'offline' | 'hybrid';
export type ProductActivationState = 'activated' | 'deactivated' | 'pending' | 'error';
export type InstallationType = 'standalone' | 'network' | 'container' | 'cloud' | 'embedded';

export interface Activation {
  id: string;
  grantId: string;
  /** Denormalized for convenience — derived from grant.licenseId */
  licenseId: string;
  systemId: string;
  installationType: InstallationType;
  productFamily: string;
  deviceName: string;
  deviceFingerprint: string;
  ipAddress: string;
  activatedAt: string;
  lastActivationCall: string;
  lastProductActivationState: ProductActivationState;
  lastSeenAt: string;
  interval: number; // heartbeat interval in minutes
  activationType: ActivationType;
  productVersion: string;
  isActive: boolean;
}

export type ValidationResult = 'approved' | 'denied' | 'error';

export interface ResponseLog {
  id: string;
  activationId: string;
  result: ValidationResult;
  reasonCode: string;
  details: string;
  timestamp: string;
}

export type StateTransition =
  | 'activated'
  | 'deactivated'
  | 'reactivated'
  | 'suspended'
  | 'revoked'
  | 'expired';

export interface HistoryLog {
  id: string;
  activationId: string;
  fromState: string;
  toState: StateTransition;
  reason: string;
  performedBy: string;
  timestamp: string;
}
