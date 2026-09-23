export type MuscleGroup =
  | "chest"
  | "front_delts"
  | "side_delts"
  | "rear_delts"
  | "biceps"
  | "triceps"
  | "forearms"
  | "lats"
  | "traps"
  | "upper_back"
  | "lower_back"
  | "abs"
  | "obliques"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  startingWeightKg: number;
  targetWeightKg: number;
  currentWeightKg: number;
  primaryGoal: string;
  trainingDaysPerWeek: number;
  restDays: string[];
  gymTime: string;
  stepTarget: number;
  calorieTarget: number;
  proteinTargetMin: number;
  proteinTargetMax: number;
  waterTargetLiters: number;
  sleepTargetHours: number;
  weightUnit: "kg" | "lbs";
  lengthUnit: "cm" | "in";
  theme: "dark" | "athletic-obsidian";
}

export interface Exercise {
  id: string;
  name: string;
  category: "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Core" | "Conditioning";
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: "Barbell" | "Dumbbell" | "Cable" | "Machine" | "Bodyweight";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  defaultSets: number;
  repRange: string; // e.g. "8–12"
  restSeconds: number; // e.g. 150
  tempo: string; // e.g. "3-0-1-0"
  formCues: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  image?: string;
  glbModel?: string;
  animation?: string;
}

export interface PlanExerciseTarget {
  exerciseId: string;
  sets: number;
  repRange: string;
  restSeconds: number;
  defaultWeightKg: number;
  notes?: string;
}

export interface WorkoutDayPlan {
  id: string; // e.g. "mon_push"
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  name: string; // "PUSH", "PULL", etc.
  focus: string; // "Chest + Shoulders + Triceps"
  targetMuscles: MuscleGroup[];
  estimatedMinutes: number;
  exercises: PlanExerciseTarget[];
  finisher?: string;
  isRestDay?: boolean;
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  targetReps: string;
  targetWeight: number;
  completed: boolean;
  skipped: boolean;
  rpe?: number;
  isPr?: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  dayId: string;
  title: string;
  durationSeconds: number;
  exercises: LoggedExercise[];
  totalVolumeKg: number;
  completed: boolean;
  completedAt?: string;
  isDemo?: boolean;
}

export interface BodyEntry {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  neckCm?: number;
  shouldersCm?: number;
  armsCm?: number;
  thighsCm?: number;
  hipsCm?: number;
  bodyFatPct?: number;
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  category: "Protein" | "Carb" | "Dairy" | "Fruit/Veg" | "Supplement" | "Meal";
}

export interface NutritionEntry {
  id: string;
  date: string;
  foodName: string;
  quantity: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
}

export interface WaterLog {
  id: string;
  date: string;
  amountMl: number;
  timestamp: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string; // "23:00"
  wakeTime: string; // "06:30"
  durationHours: number;
  quality: number; // 1-5
  notes?: string;
}

export interface RecoveryEntry {
  id: string;
  date: string;
  energyScore: number; // 1-5
  sorenessScore: number; // 1-5
  stressScore: number; // 1-5
  notes?: string;
}

export interface StepEntry {
  id: string;
  date: string;
  steps: number;
  targetSteps: number;
  source: "manual" | "health_connect";
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  metricType: "max_weight" | "max_reps" | "max_volume" | "estimated_1rm";
  value: number;
  unit: string;
  date: string;
  achievedInSessionId?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  weightKg: number;
  weekNumber: number;
  frontUrl?: string;
  sideUrl?: string;
  backUrl?: string;
  notes?: string;
}

export interface OverloadRecommendation {
  status: "increase_load" | "increase_reps" | "maintain" | "deload_focus";
  currentBestWeightKg: number;
  currentBestReps: number;
  recommendedWeightKg: number;
  recommendedReps: string;
  message: string;
  detail: string;
  trendBadge: string;
}

export interface WeekProgressSummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  workoutsCompleted: number;
  totalWorkouts: number;
  avgWeightKg: number;
  weightDeltaKg: number;
  avgSteps: number;
  avgCalories: number;
  avgProteinG: number;
  avgSleepHours: number;
  strengthDeltaPct: number;
  achievements: string[];
  focusNextWeek: string;
}
