
export enum DeviceStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export enum OSType {
  ANDROID = 'Android',
  IOS = 'iOS',
  HARMONY = 'HarmonyOS',
  UNKNOWN = 'Unknown'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'day' | 'week' | 'month' | 'year';
  features: string[];
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'expired' | 'none';
  expiryDate?: string;
}

export interface User {
  email: string;
  name: string;
  role?: 'Admin' | 'Operator';
  avatar?: string;
  subscription?: UserSubscription;
}

export interface Operator extends User {
  id: string;
  joinedDate: string;
  status: 'active' | 'suspended';
}

export interface LoginLog {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
}

export interface DeviceBug {
  id: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  component: string;
}

export interface DeviceInfo {
  model: string;
  brand: string;
  os: OSType;
  osVersion: string;
  osBuild: string;
  serialNumber: string;
  imei: string;
  phoneNumber: string;
  associatedEmail: string;
  batteryHealth: number;
  storageTotal: number;
  storageUsed: number;
  cpu: string;
  ram: string;
  networkType: string;
  signalStrength: number; // -dBm
  carrierName: string;
  bugs?: DeviceBug[];
  updateAvailable?: boolean;
}

export interface DeviceProfile {
  id: string;
  profileName: string;
  deviceInfo: DeviceInfo;
  timestamp: string;
  category: 'Diagnostic' | 'Audit' | 'Forensic' | 'Custom';
  cloudSynced?: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppSettings {
  autoSync: boolean;
  theme: 'dark' | 'high-contrast';
  logRetentionDays: number;
  securityLevel: 'Standard' | 'Strict' | 'Paranoid';
  enableBetaFeatures: boolean;
}

export type CloudSyncStatus = 'idle' | 'syncing' | 'success' | 'error';
