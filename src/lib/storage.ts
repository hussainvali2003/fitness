import {
  UserProfile,
  WorkoutSession,
  BodyEntry,
  NutritionEntry,
  WaterLog,
  SleepEntry,
  RecoveryEntry,
  StepEntry,
  PersonalRecord,
  ProgressPhoto,
  FoodItem,
} from "@/types";
import {
  initialUserProfile,
  sampleHistoricalWorkouts,
  samplePersonalRecords,
  sampleBodyEntries,
  defaultFoodLibrary,
} from "./seedData";

// Storage Keys
const KEYS = {
  PROFILE: "apex_user_profile",
  ACTIVE_WORKOUT: "apex_active_workout",
  WORKOUT_HISTORY: "apex_workout_history",
  BODY_ENTRIES: "apex_body_entries",
  NUTRITION_ENTRIES: "apex_nutrition_entries",
  WATER_LOGS: "apex_water_logs",
  SLEEP_ENTRIES: "apex_sleep_entries",
  RECOVERY_ENTRIES: "apex_recovery_entries",
  STEP_ENTRIES: "apex_step_entries",
  PERSONAL_RECORDS: "apex_personal_records",
  PROGRESS_PHOTOS: "apex_progress_photos",
  CUSTOM_FOODS: "apex_custom_foods",
};

// Safe LocalStorage Helpers
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// User Profile
export function getStoredProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.PROFILE, initialUserProfile);
}

export function saveStoredProfile(profile: UserProfile): void {
  setItem(KEYS.PROFILE, profile);
}

// Active In-Progress Workout (Survives Refresh)
export function getStoredActiveWorkout(): WorkoutSession | null {
  return getItem<WorkoutSession | null>(KEYS.ACTIVE_WORKOUT, null);
}

export function saveStoredActiveWorkout(workout: WorkoutSession | null): void {
  setItem(KEYS.ACTIVE_WORKOUT, workout);
}

// Workout History
export function getStoredWorkoutHistory(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(KEYS.WORKOUT_HISTORY, sampleHistoricalWorkouts);
}

export function saveWorkoutSession(session: WorkoutSession): void {
  const history = getStoredWorkoutHistory();
  const index = history.findIndex((w) => w.id === session.id);
  let updated: WorkoutSession[];
  if (index >= 0) {
    updated = [...history];
    updated[index] = session;
  } else {
    updated = [session, ...history];
  }
  setItem(KEYS.WORKOUT_HISTORY, updated);
}

// Body Entries (Weight & Girth)
export function getStoredBodyEntries(): BodyEntry[] {
  return getItem<BodyEntry[]>(KEYS.BODY_ENTRIES, sampleBodyEntries);
}

export function saveBodyEntry(entry: BodyEntry): void {
  const entries = getStoredBodyEntries();
  const existingIdx = entries.findIndex((e) => e.date === entry.date);
  let updated: BodyEntry[];
  if (existingIdx >= 0) {
    updated = [...entries];
    updated[existingIdx] = { ...updated[existingIdx], ...entry };
  } else {
    updated = [entry, ...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  setItem(KEYS.BODY_ENTRIES, updated);

  // Update profile current weight
  if (entry.weightKg) {
    const profile = getStoredProfile();
    saveStoredProfile({ ...profile, currentWeightKg: entry.weightKg });
  }
}

// Nutrition Entries
export function getStoredNutritionEntries(): NutritionEntry[] {
  const today = new Date().toISOString().split("T")[0];
  const defaults: NutritionEntry[] = [
    { id: "n1", date: today, foodName: "Whole Eggs (3)", quantity: 1, servingUnit: "portion", calories: 215, proteinG: 18, carbsG: 1.5, fatG: 15, mealType: "breakfast" },
    { id: "n2", date: today, foodName: "Rolled Oats & Milk", quantity: 1, servingUnit: "bowl", calories: 260, proteinG: 14, carbsG: 44, fatG: 3.9, mealType: "breakfast" },
    { id: "n3", date: today, foodName: "Banana", quantity: 1, servingUnit: "fruit", calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.3, mealType: "breakfast" },
    { id: "n4", date: today, foodName: "Cooked Chicken Breast & Rice", quantity: 1, servingUnit: "plate", calories: 440, proteinG: 50, carbsG: 43, fatG: 5.8, mealType: "lunch" },
    { id: "n5", date: today, foodName: "Low-fat Curd", quantity: 1, servingUnit: "150g", calories: 90, proteinG: 6, carbsG: 7, fatG: 4.5, mealType: "lunch" },
    { id: "n6", date: today, foodName: "Whey Protein Scoop", quantity: 1, servingUnit: "scoop", calories: 120, proteinG: 25, carbsG: 1.5, fatG: 0.8, mealType: "snack" },
  ];
  return getItem<NutritionEntry[]>(KEYS.NUTRITION_ENTRIES, defaults);
}

export function saveNutritionEntry(entry: NutritionEntry): void {
  const list = getStoredNutritionEntries();
  setItem(KEYS.NUTRITION_ENTRIES, [entry, ...list]);
}

export function deleteNutritionEntry(id: string): void {
  const list = getStoredNutritionEntries();
  setItem(KEYS.NUTRITION_ENTRIES, list.filter((e) => e.id !== id));
}

// Food Library
export function getStoredFoodLibrary(): FoodItem[] {
  return getItem<FoodItem[]>(KEYS.CUSTOM_FOODS, defaultFoodLibrary);
}

export function saveCustomFood(food: FoodItem): void {
  const list = getStoredFoodLibrary();
  setItem(KEYS.CUSTOM_FOODS, [food, ...list]);
}

// Water Logs
export function getStoredWaterLogs(): WaterLog[] {
  const today = new Date().toISOString().split("T")[0];
  const defaults: WaterLog[] = [
    { id: "w1", date: today, amountMl: 500, timestamp: "07:30" },
    { id: "w2", date: today, amountMl: 500, timestamp: "10:15" },
    { id: "w3", date: today, amountMl: 750, timestamp: "13:00" },
    { id: "w4", date: today, amountMl: 350, timestamp: "15:45" },
  ];
  return getItem<WaterLog[]>(KEYS.WATER_LOGS, defaults);
}

export function addWaterAmount(amountMl: number, dateStr?: string): void {
  const date = dateStr || new Date().toISOString().split("T")[0];
  const list = getStoredWaterLogs();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const newLog: WaterLog = {
    id: "w_" + Date.now(),
    date,
    amountMl,
    timestamp: time,
  };
  setItem(KEYS.WATER_LOGS, [...list, newLog]);
}

export function resetTodayWater(dateStr?: string): void {
  const date = dateStr || new Date().toISOString().split("T")[0];
  const list = getStoredWaterLogs();
  setItem(KEYS.WATER_LOGS, list.filter((l) => l.date !== date));
}

// Sleep Entries
export function getStoredSleepEntries(): SleepEntry[] {
  const today = new Date().toISOString().split("T")[0];
  const defaults: SleepEntry[] = [
    { id: "s1", date: today, bedtime: "23:15", wakeTime: "06:35", durationHours: 7.33, quality: 4, notes: "Felt rested and ready for morning Push" },
  ];
  return getItem<SleepEntry[]>(KEYS.SLEEP_ENTRIES, defaults);
}

export function saveSleepEntry(entry: SleepEntry): void {
  const list = getStoredSleepEntries();
  const idx = list.findIndex((s) => s.date === entry.date);
  let updated: SleepEntry[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = entry;
  } else {
    updated = [entry, ...list];
  }
  setItem(KEYS.SLEEP_ENTRIES, updated);
}

// Recovery Entries
export function getStoredRecoveryEntries(): RecoveryEntry[] {
  const today = new Date().toISOString().split("T")[0];
  const defaults: RecoveryEntry[] = [
    { id: "r1", date: today, energyScore: 4, sorenessScore: 2, stressScore: 2, notes: "High energy, minor chest tightness" },
  ];
  return getItem<RecoveryEntry[]>(KEYS.RECOVERY_ENTRIES, defaults);
}

export function saveRecoveryEntry(entry: RecoveryEntry): void {
  const list = getStoredRecoveryEntries();
  const idx = list.findIndex((r) => r.date === entry.date);
  let updated: RecoveryEntry[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = entry;
  } else {
    updated = [entry, ...list];
  }
  setItem(KEYS.RECOVERY_ENTRIES, updated);
}

// Steps Entries
export function getStoredStepEntries(): StepEntry[] {
  const today = new Date().toISOString().split("T")[0];
  const defaults: StepEntry[] = [
    { id: "st_today", date: today, steps: 7842, targetSteps: 10000, source: "manual" },
  ];
  return getItem<StepEntry[]>(KEYS.STEP_ENTRIES, defaults);
}

export function saveStepEntry(entry: StepEntry): void {
  const list = getStoredStepEntries();
  const idx = list.findIndex((s) => s.date === entry.date);
  let updated: StepEntry[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = entry;
  } else {
    updated = [entry, ...list];
  }
  setItem(KEYS.STEP_ENTRIES, updated);
}

// Personal Records
export function getStoredPersonalRecords(): PersonalRecord[] {
  return getItem<PersonalRecord[]>(KEYS.PERSONAL_RECORDS, samplePersonalRecords);
}

export function savePersonalRecord(record: PersonalRecord): void {
  const prs = getStoredPersonalRecords();
  const existingIdx = prs.findIndex((p) => p.exerciseId === record.exerciseId && p.metricType === record.metricType);
  let updated: PersonalRecord[];
  if (existingIdx >= 0) {
    updated = [...prs];
    updated[existingIdx] = record;
  } else {
    updated = [...prs, record];
  }
  setItem(KEYS.PERSONAL_RECORDS, updated);
}

// Progress Photos
export function getStoredProgressPhotos(): ProgressPhoto[] {
  return getItem<ProgressPhoto[]>(KEYS.PROGRESS_PHOTOS, []);
}

export function saveProgressPhoto(photo: ProgressPhoto): void {
  const list = getStoredProgressPhotos();
  setItem(KEYS.PROGRESS_PHOTOS, [photo, ...list]);
}

// 7-Day Rolling Averages
export function calculate7DayWeightAverage(entries: BodyEntry[]): number {
  if (entries.length === 0) return 82.0;
  const recent = entries.slice(0, 7);
  const sum = recent.reduce((acc, curr) => acc + curr.weightKg, 0);
  return Math.round((sum / recent.length) * 10) / 10;
}

// Full Export / Import (Data Sovereignty)
export function exportAllUserData(): string {
  const data = {
    profile: getStoredProfile(),
    workoutHistory: getStoredWorkoutHistory(),
    bodyEntries: getStoredBodyEntries(),
    nutritionEntries: getStoredNutritionEntries(),
    waterLogs: getStoredWaterLogs(),
    sleepEntries: getStoredSleepEntries(),
    recoveryEntries: getStoredRecoveryEntries(),
    stepEntries: getStoredStepEntries(),
    personalRecords: getStoredPersonalRecords(),
    progressPhotos: getStoredProgressPhotos(),
    customFoods: getStoredFoodLibrary(),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
  return JSON.stringify(data, null, 2);
}

export function importAllUserData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) setItem(KEYS.PROFILE, data.profile);
    if (data.workoutHistory) setItem(KEYS.WORKOUT_HISTORY, data.workoutHistory);
    if (data.bodyEntries) setItem(KEYS.BODY_ENTRIES, data.bodyEntries);
    if (data.nutritionEntries) setItem(KEYS.NUTRITION_ENTRIES, data.nutritionEntries);
    if (data.waterLogs) setItem(KEYS.WATER_LOGS, data.waterLogs);
    if (data.sleepEntries) setItem(KEYS.SLEEP_ENTRIES, data.sleepEntries);
    if (data.recoveryEntries) setItem(KEYS.RECOVERY_ENTRIES, data.recoveryEntries);
    if (data.stepEntries) setItem(KEYS.STEP_ENTRIES, data.stepEntries);
    if (data.personalRecords) setItem(KEYS.PERSONAL_RECORDS, data.personalRecords);
    if (data.progressPhotos) setItem(KEYS.PROGRESS_PHOTOS, data.progressPhotos);
    if (data.customFoods) setItem(KEYS.CUSTOM_FOODS, data.customFoods);
    return true;
  } catch (e) {
    console.error("Failed to import user data:", e);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.clear();
}
