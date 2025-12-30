
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
  bugs?: DeviceBug[];
  updateAvailable?: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
