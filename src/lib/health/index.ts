import { IHealthDataProvider } from "./HealthDataProvider";
import { ManualHealthProvider } from "./ManualHealthProvider";
import { HealthConnectProvider } from "./HealthConnectProvider";

export * from "./HealthDataProvider";
export * from "./ManualHealthProvider";
export * from "./HealthConnectProvider";

export function getHealthProvider(type: "manual" | "health_connect" = "manual"): IHealthDataProvider {
  if (type === "health_connect") {
    return new HealthConnectProvider();
  }
  return new ManualHealthProvider();
}
