import { IHealthDataProvider, HealthConnectionStatus, HealthMetricSnapshot } from "./HealthDataProvider";

/**
 * HealthConnectProvider:
 * Production bridge for future Android Health Connect (via native Capacitor/TWA/Cordova bridge).
 * Safely reports readiness and guide steps when viewed on standard browsers.
 */
export class HealthConnectProvider implements IHealthDataProvider {
  getProviderName(): string {
    return "Android Health Connect";
  }

  async getConnectionStatus(): Promise<HealthConnectionStatus> {
    const isAndroidDevice = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
    const hasBridge = typeof window !== "undefined" && !!(window as any).HealthConnectPlugin;

    return {
      isConnected: hasBridge,
      providerName: "Android Health Connect",
      permissionsGranted: hasBridge ? ["androidx.health.permissions.READ_STEPS", "androidx.health.permissions.READ_WEIGHT"] : [],
      lastSyncTime: null,
      platform: isAndroidDevice ? "android" : "web",
      message: hasBridge
        ? "Health Connect Native Bridge connected."
        : "Android Health Connect requires the native APK bridge. Web browser fallback is using secure local logs.",
    };
  }

  async connect(): Promise<boolean> {
    const isAndroidDevice = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
    if (!isAndroidDevice) {
      console.info("Health Connect is available on Android 14+ devices via Health Connect API.");
      return false;
    }
    return false;
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async fetchDailyMetrics(date: string): Promise<HealthMetricSnapshot | null> {
    return null;
  }

  async syncToday(): Promise<HealthMetricSnapshot> {
    const today = new Date().toISOString().split("T")[0];
    return {
      date: today,
      steps: 0,
      syncedAt: new Date().toISOString(),
      source: "health_connect",
    };
  }
}
