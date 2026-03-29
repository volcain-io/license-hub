export interface AuditLogEntry {
  id: string;
  licenseId: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}
