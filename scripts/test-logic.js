// Automated Logic Verification Suite for Apex Fitness

function calculateEstimated1RM(weightKg, reps) {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

function parseRepRange(repRangeStr) {
  const sanitized = repRangeStr.replace("–", "-").replace("sec", "").trim();
  const parts = sanitized.split("-").map((s) => parseInt(s.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  return { min: 8, max: 12 };
}

function evaluateProgressiveOverload(completedSets, repRangeStr, equipmentType = "Barbell") {
  const { min: minReps, max: maxReps } = parseRepRange(repRangeStr);
  const weightIncrementKg = equipmentType === "Dumbbell" ? 2.0 : 2.5;

  const weights = completedSets.map((s) => s.weightKg);
  const reps = completedSets.map((s) => s.reps);
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);
  const allReachedMaxReps = completedSets.every((s) => s.reps >= maxReps && s.weightKg >= maxWeight);
  const allInRepRange = completedSets.every((s) => s.reps >= minReps);

  if (allReachedMaxReps) {
    return {
      status: "increase_load",
      recommendedWeightKg: maxWeight + weightIncrementKg,
    };
  }

  if (allInRepRange) {
    return {
      status: "increase_reps",
      recommendedWeightKg: maxWeight,
    };
  }

  return {
    status: "maintain",
    recommendedWeightKg: minWeight,
  };
}

function calculate7DayAvg(weights) {
  if (weights.length === 0) return 0;
  const sum = weights.slice(0, 7).reduce((a, b) => a + b, 0);
  return Math.round((sum / Math.min(weights.length, 7)) * 10) / 10;
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`\x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failed++;
  }
}

console.log("\n==========================================");
console.log("RUNNING APEX FITNESS LOGIC VERIFICATION");
console.log("==========================================\n");

// Test 1: 1RM Epley calculation
const e1rm1 = calculateEstimated1RM(30, 10);
assert(e1rm1 === 40, `1RM Epley for 30kg x 10 reps should be 40.0kg (got ${e1rm1}kg)`);

const e1rm2 = calculateEstimated1RM(100, 1);
assert(e1rm2 === 100, `1RM Epley for 100kg x 1 rep should be 100kg (got ${e1rm2}kg)`);

// Test 2: Double Progression - Top of Range
const setsTop = [
  { weightKg: 30, reps: 10, completed: true },
  { weightKg: 30, reps: 10, completed: true },
  { weightKg: 30, reps: 10, completed: true },
];
const resTop = evaluateProgressiveOverload(setsTop, "6–10", "Barbell");
assert(
  resTop.status === "increase_load" && resTop.recommendedWeightKg === 32.5,
  `Reaching 3x10 at 30kg triggers load increment to 32.5kg (got ${resTop.status}, ${resTop.recommendedWeightKg}kg)`
);

// Test 3: Double Progression - Mid Bracket Rep Progression
const setsMid = [
  { weightKg: 30, reps: 10, completed: true },
  { weightKg: 30, reps: 9, completed: true },
  { weightKg: 30, reps: 8, completed: true },
];
const resMid = evaluateProgressiveOverload(setsMid, "6–10", "Barbell");
assert(
  resMid.status === "increase_reps" && resMid.recommendedWeightKg === 30,
  `Reaching 10, 9, 8 reps stays at 30kg for rep progression (got ${resMid.status}, ${resMid.recommendedWeightKg}kg)`
);

// Test 4: Double Progression - Drop Below Range
const setsLow = [
  { weightKg: 30, reps: 7, completed: true },
  { weightKg: 30, reps: 6, completed: true },
  { weightKg: 30, reps: 5, completed: true },
];
const resLow = evaluateProgressiveOverload(setsLow, "6–10", "Barbell");
assert(
  resLow.status === "maintain",
  `Falling below minimum rep range maintains load (got ${resLow.status})`
);

// Test 5: 7-Day Weight Rolling Average
const weightHistory = [79.8, 80.0, 80.2, 80.5, 80.4, 80.7, 81.0, 81.5];
const avg7 = calculate7DayAvg(weightHistory);
assert(avg7 === 80.4, `7-day rolling weight average should be 80.4kg (got ${avg7}kg)`);

console.log("\n==========================================");
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log("==========================================\n");

if (failed > 0) process.exit(1);
