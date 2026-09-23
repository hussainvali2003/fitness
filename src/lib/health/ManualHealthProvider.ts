import { IHealthDataProvider, HealthConnectionStatus, HealthMetricSnapshot } from "./HealthDataProvider";
import { getStoredStepEntries, getStoredBodyEntries, getStoredSleepEntries } from "../storage";

export class ManualHealthProvider implements IHealthDataProvider {
  getProviderName(): string {
    return "Manual Health Input";
  }

  async getConnectionStatus(): Promise<HealthConnectionStatus> {
    return {
      isConnected: true,
      providerName: "Manual Health Input",
      permissionsGranted: ["READ_STEPS", "READ_WEIGHT", "READ_SLEEP"],
      lastSyncTime: new Date().toISOString(),
      platform: "web",
      message: "Direct manual logging active (Zero external data tracking).",
    };
  }

  async connect(): Promise<boolean> {
    return true;
  }

  async disconnect(): Promise<void> {
    // No-op for manual
  }

  async fetchDailyMetrics(date: string): Promise<HealthMetricSnapshot | null> {
    const stepsList = getStoredStepEntries();
    const bodyList = getStoredBodyEntries();
    const sleepList = getStoredSleepEntries();

    const stepEntry = stepsList.find((s) => s.date === date);
    const bodyEntry = bodyList.find((b) => b.date === date);
    const sleepEntry = sleepList.find((s) => s.date === date);

    return {
      date,
      steps: stepEntry ? stepEntry.steps : 0,
      weightKg: bodyEntry ? bodyEntry.weightKg : undefined,
      sleepDurationHours: sleepEntry ? sleepEntry.durationHours : undefined,
      activeCaloriesBurned: stepEntry ? Math.round(stepEntry.steps * 0.04) : 0,
      distanceMeters: stepEntry ? Math.round(stepEntry.steps * 0.76) : 0,
      syncedAt: new Date().toISOString(),
      source: "manual",
    };
  }

  async syncToday(): Promise<HealthMetricSnapshot> {
    const today = new Date().toISOString().split("T")[0];
    const snapshot = await this.fetchDailyMetrics(today);
    return (
      snapshot || {
        date: today,
        steps: 0,
        syncedAt: new Date().toISOString(),
        source: "manual",
      }
    );
  }
}
