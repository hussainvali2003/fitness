import { LoggedSet, OverloadRecommendation } from "@/types";

/**
 * Calculates Estimated One-Rep Max (1RM) using the Epley Formula:
 * 1RM = weight * (1 + reps / 30)
 * For 1 rep, 1RM = weight.
 */
export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  const e1rm = weightKg * (1 + reps / 30);
  return Math.round(e1rm * 10) / 10;
}

/**
 * Parses a rep range string such as "8–12", "6-10", "12–15", "30-60 sec"
 */
export function parseRepRange(repRangeStr: string): { min: number; max: number } {
  const sanitized = repRangeStr.replace("–", "-").replace("sec", "").trim();
  const parts = sanitized.split("-").map((s) => parseInt(s.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return { min: parts[0], max: parts[0] };
  }
  return { min: 8, max: 12 };
}

/**
 * Double-Progression Progressive Overload Engine:
 * Analyzes previous logged session sets vs target rep range to produce
 * a deterministic, transparent recommendation for the next session.
 */
export function evaluateProgressiveOverload(
  previousSets: LoggedSet[],
  repRangeStr: string,
  equipmentType: string = "Barbell"
): OverloadRecommendation {
  const completedSets = previousSets.filter((s) => s.completed && s.reps > 0 && s.weightKg > 0);
  const { min: minReps, max: maxReps } = parseRepRange(repRangeStr);

  if (completedSets.length === 0) {
    return {
      status: "maintain",
      currentBestWeightKg: 0,
      currentBestReps: 0,
      recommendedWeightKg: 20,
      recommendedReps: repRangeStr,
      message: "Baseline Calibration Session",
      detail: `Start with a comfortable weight and target ${repRangeStr} controlled reps with clean technique.`,
      trendBadge: "Baseline",
    };
  }

  // Determine standard weight increment based on equipment
  const weightIncrementKg = equipmentType === "Dumbbell" ? 2.0 : equipmentType === "Cable" ? 2.5 : 2.5;

  const weights = completedSets.map((s) => s.weightKg);
  const reps = completedSets.map((s) => s.reps);
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);
  const avgReps = reps.reduce((a, b) => a + b, 0) / reps.length;
  const allReachedMaxReps = completedSets.every((s) => s.reps >= maxReps && s.weightKg >= maxWeight);
  const allInRepRange = completedSets.every((s) => s.reps >= minReps);

  // Scenario 1: Top of rep range reached on all sets -> Suggest weight bump
  if (allReachedMaxReps) {
    const nextWeight = maxWeight + weightIncrementKg;
    return {
      status: "increase_load",
      currentBestWeightKg: maxWeight,
      currentBestReps: Math.max(...reps),
      recommendedWeightKg: nextWeight,
      recommendedReps: `${minReps}–${Math.min(minReps + 2, maxReps)}`,
      message: "Outstanding Progress! Top of rep range unlocked.",
      detail: `You completed all ${completedSets.length} sets at the ceiling (${maxReps} reps) with ${maxWeight} kg. Progressive overload unlocked: increase load to ${nextWeight} kg and aim for ${minReps}–${minReps + 2} clean reps.`,
      trendBadge: `+${weightIncrementKg}kg Load Increase`,
    };
  }

  // Scenario 2: Within rep range but not at top on all sets -> Keep weight, build reps
  if (allInRepRange) {
    const bestSet = completedSets.reduce((prev, curr) => (curr.reps > prev.reps ? curr : prev), completedSets[0]);
    return {
      status: "increase_reps",
      currentBestWeightKg: bestSet.weightKg,
      currentBestReps: bestSet.reps,
      recommendedWeightKg: maxWeight,
      recommendedReps: `${Math.min(bestSet.reps + 1, maxReps)} reps`,
      message: "Solid execution. Aim for +1 to +2 reps next session.",
      detail: `You stayed in your target bracket (${minReps}–${maxReps} reps) at ${maxWeight} kg. Keep the same weight and build rep endurance toward ${maxReps} reps across all sets.`,
      trendBadge: "+Rep Progression",
    };
  }

  // Scenario 3: Dropped below minimum rep range -> Maintain load or focus on tempo/recovery
  return {
    status: "maintain",
    currentBestWeightKg: maxWeight,
    currentBestReps: Math.max(...reps),
    recommendedWeightKg: minWeight,
    recommendedReps: `${minReps} reps`,
    message: "Consolidate form and build rep volume.",
    detail: `Some sets fell below the ${minReps} rep target. Hold at ${minWeight} kg, focus on strict 3-second eccentric tempo, and ensure full rest intervals before bumping load.`,
    trendBadge: "Consolidate Form",
  };
}

/**
 * Calculates total volume in kg (Sum of weight * reps for completed sets)
 */
export function calculateTotalVolumeKg(sets: LoggedSet[]): number {
  return sets
    .filter((s) => s.completed && s.weightKg > 0 && s.reps > 0)
    .reduce((total, s) => total + s.weightKg * s.reps, 0);
}
