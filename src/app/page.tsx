"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Dumbbell,
  Footprints,
  UtensilsCrossed,
  Droplets,
  Moon,
  Scale,
  Play,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Plus,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  getStoredProfile,
  getStoredActiveWorkout,
  getStoredWorkoutHistory,
  getStoredBodyEntries,
  getStoredStepEntries,
  getStoredNutritionEntries,
  getStoredWaterLogs,
  getStoredSleepEntries,
  addWaterAmount,
  saveStepEntry,
  saveBodyEntry,
  calculate7DayWeightAverage,
} from "@/lib/storage";
import { weeklyWorkoutPlan, allExercises } from "@/lib/seedData";
import { WorkoutDayPlan, BodyEntry } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [bodyEntries, setBodyEntries] = useState<BodyEntry[]>([]);
  const [stepEntries, setStepEntries] = useState<any[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<any[]>([]);
  const [waterLogs, setWaterLogs] = useState<any[]>([]);
  const [sleepEntries, setSleepEntries] = useState<any[]>([]);

  // Quick log modals / inline inputs
  const [quickWeight, setQuickWeight] = useState("");
  const [quickSteps, setQuickSteps] = useState("");
  const [showQuickLog, setShowQuickLog] = useState(false);

  const loadAllData = () => {
    setProfile(getStoredProfile());
    setActiveWorkout(getStoredActiveWorkout());
    setHistory(getStoredWorkoutHistory());
    setBodyEntries(getStoredBodyEntries());
    setStepEntries(getStoredStepEntries());
    setNutritionEntries(getStoredNutritionEntries());
    setWaterLogs(getStoredWaterLogs());
    setSleepEntries(getStoredSleepEntries());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayOfWeek = dayNames[new Date().getDay()];

  // Today's scheduled plan
  const todayPlan: WorkoutDayPlan =
    weeklyWorkoutPlan.find((p) => p.dayOfWeek === currentDayOfWeek) || weeklyWorkoutPlan[0];

  // Today's metrics calculation
  const todayBody = bodyEntries.find((b) => b.date === todayStr) || bodyEntries[0];
  const currentWeight = todayBody?.weightKg || profile?.currentWeightKg || 79.8;
  const startingWeight = profile?.startingWeightKg || 82.0;
  const weightChange = Math.round((currentWeight - startingWeight) * 10) / 10;
  const sevenDayAvgWeight = calculate7DayWeightAverage(bodyEntries);

  const todayStepItem = stepEntries.find((s) => s.date === todayStr);
  const todaySteps = todayStepItem ? todayStepItem.steps : 7842;
  const stepTarget = profile?.stepTarget || 10000;
  const stepPct = Math.min(100, Math.round((todaySteps / stepTarget) * 100));

  const todayNutrition = nutritionEntries.filter((n) => n.date === todayStr);
  const totalCalories = todayNutrition.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Math.round(todayNutrition.reduce((acc, curr) => acc + curr.proteinG, 0));
  const calorieTarget = profile?.calorieTarget || 1850;
  const proteinTarget = profile?.proteinTargetMax || 135;

  const todayWaterTotalMl = waterLogs
    .filter((w) => w.date === todayStr)
    .reduce((acc, curr) => acc + curr.amountMl, 0);
  const waterTargetMl = (profile?.waterTargetLiters || 3.0) * 1000;
  const waterLiters = (todayWaterTotalMl / 1000).toFixed(1);

  const todaySleep = sleepEntries.find((s) => s.date === todayStr);
  const sleepDuration = todaySleep ? `${Math.floor(todaySleep.durationHours)}h ${Math.round((todaySleep.durationHours % 1) * 60)}m` : "7h 12m";

  // Bench Press Progression Chart Data
  const benchPressProgression = [
    { session: "Sep 1", weight: 30.0, reps: 8, e1rm: 38.0 },
    { session: "Sep 8", weight: 30.0, reps: 9, e1rm: 39.0 },
    { session: "Sep 15", weight: 30.0, reps: 10, e1rm: 40.0 },
    { session: "Sep 22", weight: 32.5, reps: 8, e1rm: 41.2 },
  ];

  // Weight Trend Data
  const weightChartData = [...bodyEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: e.date.slice(5),
      weight: e.weightKg,
      target: 70.0,
    }));

  // Muscle Volume Distribution Data
  const muscleVolumeData = [
    { muscle: "Chest", sets: 10, target: 12 },
    { muscle: "Back", sets: 12, target: 14 },
    { muscle: "Delts", sets: 10, target: 12 },
    { muscle: "Arms", sets: 14, target: 14 },
    { muscle: "Quads", sets: 8, target: 10 },
    { muscle: "Hams", sets: 8, target: 10 },
    { muscle: "Core", sets: 9, target: 9 },
  ];

  const handleQuickAddWater = (ml: number) => {
    addWaterAmount(ml);
    loadAllData();
  };

  const handleSaveQuickWeight = () => {
    const val = parseFloat(quickWeight);
    if (!val || val <= 0) return;
    saveBodyEntry({
      id: "b_" + Date.now(),
      date: todayStr,
      weightKg: val,
      notes: "Quick log from dashboard",
    });
    setQuickWeight("");
    loadAllData();
  };

  const handleSaveQuickSteps = () => {
    const val = parseInt(quickSteps, 10);
    if (!val || val <= 0) return;
    saveStepEntry({
      id: "st_" + Date.now(),
      date: todayStr,
      steps: val,
      targetSteps: 10000,
      source: "manual",
    });
    setQuickSteps("");
    loadAllData();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Hero Workout Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121826] via-[#101522] to-[#0A0D14] border border-surface-800 p-6 sm:p-8 shadow-glass-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-emerald/15 via-brand-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>TODAY&apos;S SCHEDULE</span>
              </span>
              <span className="text-xs text-surface-400 font-semibold font-mono">
                {currentDayOfWeek.toUpperCase()}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                {todayPlan.name}
              </h1>
              <p className="text-sm sm:text-base text-surface-300 font-medium mt-1">
                {todayPlan.focus}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-surface-400 pt-1">
              {!todayPlan.isRestDay ? (
                <>
                  <span className="flex items-center gap-1.5 bg-surface-900/80 px-2.5 py-1 rounded-lg border border-surface-800 text-surface-200">
                    <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                    <strong>{todayPlan.exercises.length} exercises</strong>
                  </span>
                  <span className="flex items-center gap-1.5 bg-surface-900/80 px-2.5 py-1 rounded-lg border border-surface-800 text-surface-200">
                    <Dumbbell className="w-3.5 h-3.5 text-brand-emerald" />
                    <strong>~{todayPlan.estimatedMinutes} minutes</strong>
                  </span>
                  {todayPlan.finisher && (
                    <span className="text-surface-400 hidden sm:inline">
                      Finisher: {todayPlan.finisher}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-surface-300 text-xs">
                  Active Recovery Day · Hydration, mobility &amp; 10,000 steps focus
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3">
            <Link
              href={`/workout/active?day=${todayPlan.id}`}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-black text-sm uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2.5 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{todayPlan.isRestDay ? "LOG EXTRA WORKOUT" : "START WORKOUT"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Daily Metric Rings / Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Weight Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Weight</span>
            <Scale className="w-4 h-4 text-brand-cyan" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{currentWeight} <span className="text-xs text-surface-400 font-sans">kg</span></p>
            <p className="text-[11px] font-bold text-brand-emerald flex items-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>{weightChange > 0 ? `+${weightChange}` : weightChange} kg</span>
            </p>
          </div>
          <p className="text-[10px] text-surface-500 font-mono">7d avg: {sevenDayAvgWeight}kg</p>
        </div>

        {/* Steps Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Steps</span>
            <Footprints className="w-4 h-4 text-brand-emerald" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{todaySteps.toLocaleString()}</p>
            <p className="text-[11px] text-surface-400 font-medium mt-0.5">/ {stepTarget.toLocaleString()}</p>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-emerald h-full rounded-full transition-all duration-500" style={{ width: `${stepPct}%` }} />
          </div>
        </div>

        {/* Protein Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Protein</span>
            <UtensilsCrossed className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{totalProtein} <span className="text-xs text-surface-400 font-sans">g</span></p>
            <p className="text-[11px] text-surface-400 font-medium mt-0.5">/ {proteinTarget} g target</p>
          </div>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-amber h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Calories Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Calories</span>
            <Flame className="w-4 h-4 text-brand-rose" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{totalCalories.toLocaleString()}</p>
            <p className="text-[11px] text-surface-400 font-medium mt-0.5">/ {calorieTarget} kcal</p>
          </div>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-rose h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCalories / calorieTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Water Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Water</span>
            <Droplets className="w-4 h-4 text-brand-cyan" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{waterLiters} <span className="text-xs text-surface-400 font-sans">L</span></p>
            <p className="text-[11px] text-surface-400 font-medium mt-0.5">/ 3.0 L target</p>
          </div>
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => handleQuickAddWater(250)}
              className="px-1.5 py-0.5 rounded bg-surface-800 hover:bg-surface-700 text-[10px] font-bold text-brand-cyan transition-colors"
            >
              +250ml
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddWater(500)}
              className="px-1.5 py-0.5 rounded bg-surface-800 hover:bg-surface-700 text-[10px] font-bold text-brand-cyan transition-colors"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2 hover:border-surface-700 transition-all">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sleep</span>
            <Moon className="w-4 h-4 text-brand-purple" />
          </div>
          <div>
            <p className="text-xl font-black text-white font-mono">{sleepDuration}</p>
            <p className="text-[11px] text-surface-400 font-medium mt-0.5">Target: 7.5h</p>
          </div>
          <p className="text-[10px] text-brand-emerald font-semibold">Rested &amp; Ready</p>
        </div>
      </div>

      {/* Weekly Workout Consistency & Quick Log Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consistency Card */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-emerald" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Weekly Workout Consistency (5-Day Split)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-brand-emerald">2/5 Completed</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {[
              { day: "Mon", status: "completed", title: "Push" },
              { day: "Tue", status: "completed", title: "Pull" },
              { day: "Wed", status: "scheduled", title: "Legs" },
              { day: "Thu", status: "scheduled", title: "Upper" },
              { day: "Fri", status: "scheduled", title: "Lower" },
              { day: "Sat", status: "rest", title: "Rest" },
              { day: "Sun", status: "rest", title: "Review" },
            ].map((d, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  d.status === "completed"
                    ? "bg-brand-emerald/10 border-brand-emerald/40 text-brand-emerald"
                    : d.status === "rest"
                    ? "bg-surface-900/50 border-surface-800/80 text-surface-500"
                    : "bg-surface-900 border-surface-800 text-surface-300"
                }`}
              >
                <span className="text-xs font-bold">{d.day}</span>
                <span className="text-[10px] font-medium mt-0.5">{d.title}</span>
                <div className="mt-2">
                  {d.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                  ) : d.status === "rest" ? (
                    <span className="text-[10px] font-bold text-surface-500">Zzz</span>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-surface-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Action Box */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Quick Habit Entry</h3>
            </div>
            <p className="text-xs text-surface-400">Log today&apos;s weight or steps in one tap:</p>
          </div>

          <div className="space-y-2">
            {/* Weight entry */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="Weight (kg) e.g. 79.6"
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                className="flex-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
              />
              <button
                type="button"
                onClick={handleSaveQuickWeight}
                className="px-3 py-2 bg-surface-800 hover:bg-surface-700 text-brand-cyan font-bold text-xs rounded-xl border border-surface-700 transition-colors"
              >
                Log
              </button>
            </div>

            {/* Steps entry */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Steps e.g. 10250"
                value={quickSteps}
                onChange={(e) => setQuickSteps(e.target.value)}
                className="flex-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
              />
              <button
                type="button"
                onClick={handleSaveQuickSteps}
                className="px-3 py-2 bg-surface-800 hover:bg-surface-700 text-brand-emerald font-bold text-xs rounded-xl border border-surface-700 transition-colors"
              >
                Log
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/nutrition"
              className="text-[11px] font-bold text-brand-emerald hover:underline flex items-center gap-1"
            >
              <span>+ Add Meals to Nutrition Diary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Progress Chart */}
        <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Bench Press Strength Progress
              </h3>
              <p className="text-[11px] text-surface-400">Double-progression overload timeline</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              +2.5 kg load &middot; +4.2% e1RM
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={benchPressProgression}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F59B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F59B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="session" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" domain={[25, 45]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121826", borderColor: "#202B3F", borderRadius: "12px" }}
                  itemStyle={{ color: "#00F59B" }}
                />
                <Area
                  type="monotone"
                  dataKey="e1rm"
                  name="Est. 1RM (kg)"
                  stroke="#00F59B"
                  strokeWidth={2.5}
                  fill="url(#emeraldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Weight Trend Chart */}
        <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Body Weight Trend
              </h3>
              <p className="text-[11px] text-surface-400">Baseline 82.0 kg &rarr; Goal 70.0 kg</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              -2.2 kg Total Lost
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightChartData}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" domain={[68, 84]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121826", borderColor: "#202B3F", borderRadius: "12px" }}
                  itemStyle={{ color: "#38BDF8" }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="url(#cyanGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Muscle Volume Bar Breakdown */}
      <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Weekly Muscle Hypertrophy Volume (Direct Working Sets)
            </h3>
            <p className="text-[11px] text-surface-400">Optimal hypertrophy range: 10–20 weekly sets per muscle</p>
          </div>
          <Link href="/muscle-map" className="text-xs font-bold text-brand-emerald hover:underline">
            Open 3D Muscle Map &rarr;
          </Link>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={muscleVolumeData}>
              <XAxis dataKey="muscle" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#121826", borderColor: "#202B3F", borderRadius: "12px" }}
                itemStyle={{ color: "#00F59B" }}
              />
              <Bar dataKey="sets" name="Completed Sets" fill="#00F59B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
