export interface HealthMetricSnapshot {
  date: string;
  steps: number;
  weightKg?: number;
  activeCaloriesBurned?: number;
  sleepDurationHours?: number;
  heartRateAvg?: number;
  distanceMeters?: number;
  syncedAt: string;
  source: "manual" | "health_connect" | "google_fit";
}

export interface HealthConnectionStatus {
  isConnected: boolean;
  providerName: string;
  permissionsGranted: string[];
  lastSyncTime: string | null;
  platform: "web" | "android" | "ios";
  message: string;
}

export interface IHealthDataProvider {
  getProviderName(): string;
  getConnectionStatus(): Promise<HealthConnectionStatus>;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  fetchDailyMetrics(date: string): Promise<HealthMetricSnapshot | null>;
  syncToday(): Promise<HealthMetricSnapshot>;
}
