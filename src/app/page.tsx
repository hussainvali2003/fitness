"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Target,
  Activity,
  Zap,
  RotateCw,
  Trophy,
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
import { WorkoutDayPlan, BodyEntry, MuscleGroup } from "@/types";
import { HumanBodyCanvasHQ } from "@/components/3d/HumanBodyCanvasHQ";

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
  const [heroImageTab, setHeroImageTab] = useState<"solo" | "duo">("solo");

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

  // Extract target muscles for today's workout
  const todayPrimaryMuscle: MuscleGroup =
    todayPlan.targetMuscles?.[0] || "chest";

  const todaySecondaryMuscles: MuscleGroup[] =
    todayPlan.targetMuscles?.slice(1) || [];

  const [selectedDashboardMuscle, setSelectedDashboardMuscle] = useState<MuscleGroup>(todayPrimaryMuscle);

  useEffect(() => {
    setSelectedDashboardMuscle(todayPrimaryMuscle);
  }, [todayPrimaryMuscle]);

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
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ========================================================================= */}
      {/* GYM X HERO SECTION (Dribbble Aliza Anis Spec + User Face HQ Looping GIF) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-[#111114] border border-[#26262b] p-6 sm:p-10 shadow-2xl">
        {/* Ambient Orange Glow */}
        <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-[#ee4d00]/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_12px_rgba(238,77,0,0.25)] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-[#ee4d00]" />
                <span>GYM X HYPERTROPHY ENGINE</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono font-bold">
                {currentDayOfWeek.toUpperCase()} &bull; 12-WEEK CYCLE
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.05]">
                START YOUR <br />
                WORKOUT <span className="text-[#ee4d00]">FITNESS</span> TODAY!
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 font-medium mt-3 max-w-xl leading-relaxed">
                Sculpt your physique with advanced 3D biomechanics, scientific progressive overload, and personalized tracking for Md Sadique Amin.
              </p>
            </div>

            {/* Program Highlights Pill Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08080a] border border-[#26262b] text-xs font-bold text-neutral-200">
                <Layers className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>{todayPlan.exercises?.length || 8} Movements</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08080a] border border-[#26262b] text-xs font-bold text-neutral-200">
                <Dumbbell className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>~{todayPlan.estimatedMinutes} Mins Session</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08080a] border border-[#26262b] text-xs font-bold text-neutral-200">
                <Trophy className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>Target: 70.0 kg (-2.2kg Lost)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/workout/active?day=${todayPlan.id}`}
                className="px-7 py-3.5 rounded-full bg-[#ee4d00] hover:bg-[#ff5500] active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(238,77,0,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Workout Session</span>
              </Link>
              <Link
                href="/workout"
                className="px-6 py-3.5 rounded-full bg-[#111114] hover:bg-[#1a1a20] text-white border border-[#26262b] hover:border-[#ee4d00]/50 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Prescribed 8 Exercises</span>
                <ChevronRight className="w-4 h-4 text-[#ee4d00]" />
              </Link>
            </div>
          </div>

          {/* Right Hero: HQ Animated Looping GIF of User (Sadique) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#26262b] bg-[#08080a] shadow-[0_0_40px_rgba(0,0,0,0.8)] group">
              <div className="relative w-full h-80 sm:h-96">
                <Image
                  src={heroImageTab === "solo" ? "/sadique_hero.gif" : "/gymx_sadique_duo.gif"}
                  alt="Md Sadique Amin - GYM X Athlete"
                  fill
                  unoptimized
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-black/20 pointer-events-none" />

                {/* Floating Athlete Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur border border-white/10 flex items-center gap-2 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d00] animate-pulse shadow-[0_0_8px_#ee4d00]" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      Md Sadique Amin &bull; GYM X
                    </span>
                  </div>
                </div>

                {/* Image Switcher: Solo Athlete (Previous) vs Duo */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/70 backdrop-blur p-1 rounded-xl border border-white/10 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setHeroImageTab("solo")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      heroImageTab === "solo"
                        ? "bg-[#ee4d00] text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Solo Athlete
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroImageTab("duo")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      heroImageTab === "duo"
                        ? "bg-[#ee4d00] text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Duo Scene
                  </button>
                </div>

                {/* Bottom Floating Stats Pill (Dribbble 252K style) */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3.5 rounded-2xl bg-[#111114]/90 backdrop-blur border border-[#26262b] shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                      Active Reps &amp; Volume
                    </span>
                    <span className="text-lg font-black text-white">252K+ lbs Lifted</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#ee4d00] uppercase tracking-wider block font-bold">
                      Program Phase
                    </span>
                    <span className="text-sm font-bold text-white">Hypertrophy W3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Daily Metric StatCards - GYM X Styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Weight StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Weight</span>
            <Scale className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {currentWeight} <span className="text-xs text-neutral-400 font-sans font-normal">kg</span>
            </p>
            <p className="text-[11px] font-semibold text-[#ee4d00] flex items-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>{weightChange > 0 ? `+${weightChange}` : weightChange} kg</span>
            </p>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono">7d avg: {sevenDayAvgWeight}kg</p>
        </div>

        {/* Steps StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Steps</span>
            <Footprints className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">{todaySteps.toLocaleString()}</p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">/ {stepTarget.toLocaleString()}</p>
          </div>
          <div className="w-full bg-[#1b1b22] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#ee4d00] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_#ee4d00]" style={{ width: `${stepPct}%` }} />
          </div>
        </div>

        {/* Protein StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Protein</span>
            <UtensilsCrossed className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {totalProtein} <span className="text-xs text-neutral-400 font-sans font-normal">g</span>
            </p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">/ {proteinTarget} g target</p>
          </div>
          <div className="w-full bg-[#1b1b22] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#ee4d00] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_#ee4d00]"
              style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Calories StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Calories</span>
            <Flame className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">{totalCalories.toLocaleString()}</p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">/ {calorieTarget} kcal</p>
          </div>
          <div className="w-full bg-[#1b1b22] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#ee4d00] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_#ee4d00]"
              style={{ width: `${Math.min(100, (totalCalories / calorieTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Water StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Water</span>
            <Droplets className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {waterLiters} <span className="text-xs text-neutral-400 font-sans font-normal">L</span>
            </p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">/ 3.0 L target</p>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickAddWater(250)}
              className="px-2.5 py-1 rounded-lg bg-[#26262b] hover:bg-[#ee4d00]/20 text-[10px] font-bold text-[#ee4d00] transition-colors"
            >
              +250ml
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddWater(500)}
              className="px-2.5 py-1 rounded-lg bg-[#26262b] hover:bg-[#ee4d00]/20 text-[10px] font-bold text-[#ee4d00] transition-colors"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Sleep StatCard */}
        <div className="bg-[#111114] border border-[#26262b] rounded-2xl p-4 shadow-lg hover:border-[#ee4d00]/50 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Sleep</span>
            <Moon className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">{sleepDuration}</p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Target: 7.5h</p>
          </div>
          <p className="text-[10px] text-[#ee4d00] font-bold">Rested &amp; Ready</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 360° & 3D REAL-TIME ANATOMICAL HUMAN HUB (Insan, NOT Robot) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#111114] border border-[#26262b] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262b] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_12px_rgba(238,77,0,0.2)]">
                ⚡ 360&deg; 3D HUMAN ANATOMY LAB
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Anatomical Hypertrophy Simulation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-2 flex items-center gap-2">
              <span>Target Muscular Anatomy &bull;</span>
              <span className="text-[#ee4d00]">{todayPlan.name}</span>
            </h2>
          </div>

          <Link
            href="/muscle-map"
            className="px-5 py-2.5 rounded-full bg-[#26262b] hover:bg-[#32323a] text-white font-bold text-xs border border-white/5 hover:border-[#ee4d00]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <span>Full Anatomy Explorer</span>
            <ChevronRight className="w-4 h-4 text-[#ee4d00]" />
          </Link>
        </div>

        {/* Split Grid: 3D Canvas on Left, Biomechanical Target Matrix on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Real-Time Model Canvas */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
            <HumanBodyCanvasHQ
              primaryMuscle={selectedDashboardMuscle}
              secondaryMuscles={todaySecondaryMuscles}
              selectedMuscle={selectedDashboardMuscle}
              onSelectMuscle={(m) => setSelectedDashboardMuscle(m)}
              height="h-[480px]"
              showControls={true}
              initialPreset={todayPrimaryMuscle === "chest" ? "chest" : "front"}
            />
          </div>

          {/* Right Side: Biomechanical Muscle Focus Matrix */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Muscle Selector for Today's Workout */}
            <div className="p-5 rounded-2xl bg-[#08080a] border border-[#26262b] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>Today&apos;s Muscle Activation Focus</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {[todayPrimaryMuscle, ...todaySecondaryMuscles].map((m) => {
                  const isSelected = selectedDashboardMuscle === m;
                  const isPrimary = m === todayPrimaryMuscle;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedDashboardMuscle(m)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-[#ee4d00] text-white shadow-[0_0_15px_rgba(238,77,0,0.35)]"
                          : "bg-[#111114] text-neutral-300 hover:text-white border border-[#26262b]"
                      }`}
                    >
                      <span className="capitalize">{m.replace("_", " ")}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? "bg-black/30 text-white" : isPrimary ? "bg-[#ee4d00]/20 text-[#ee4d00]" : "bg-white/5 text-neutral-400"
                        }`}
                      >
                        {isPrimary ? "PRIMARY" : "SECONDARY"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Targeted Exercises in Today's Session */}
            <div className="p-5 rounded-2xl bg-[#08080a] border border-[#26262b] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#ee4d00]" />
                  <span>Programmed Movements</span>
                </span>
                <span className="text-[10px] font-mono text-[#ee4d00] font-bold">
                  {todayPlan.exercises.length} Exercises Today
                </span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {todayPlan.exercises.map((ex, idx) => {
                  const fullDef = allExercises.find((e) => e.id === ex.exerciseId);
                  const name = fullDef?.name || ex.exerciseId;
                  return (
                    <Link
                      key={idx}
                      href={`/workout`}
                      className="p-3 rounded-xl bg-[#111114] border border-[#26262b] hover:border-[#ee4d00]/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#ee4d00]/15 text-[#ee4d00] text-[11px] font-bold font-mono flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#ee4d00] transition-colors">{name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {ex.sets} sets &times; {ex.repRange} reps
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#ee4d00] transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Action CTA */}
            <Link
              href={`/workout`}
              className="w-full py-3.5 bg-[#ee4d00] hover:bg-[#ff5500] active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(238,77,0,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>View 8 Exercises &amp; 3D Stage</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Weekly Consistency & Quick Habit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consistency Card */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ee4d00]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Weekly Workout Consistency (5-Day Split)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#ee4d00]">2/5 Completed</span>
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
                    ? "bg-[#ee4d00]/15 border-[#ee4d00] text-[#ee4d00] shadow-[0_0_10px_rgba(238,77,0,0.2)]"
                    : d.status === "rest"
                    ? "bg-[#08080a] border-[#26262b] text-neutral-500"
                    : "bg-[#08080a] border-[#26262b] text-white"
                }`}
              >
                <span className="text-xs font-bold">{d.day}</span>
                <span className="text-[10px] font-medium mt-0.5">{d.title}</span>
                <div className="mt-2">
                  {d.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#ee4d00]" />
                  ) : d.status === "rest" ? (
                    <span className="text-[10px] font-bold text-neutral-500">Zzz</span>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Action Box */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-3 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#ee4d00]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Habit Entry</h3>
            </div>
            <p className="text-xs text-neutral-400">Log today&apos;s weight or steps in one tap:</p>
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
                className="flex-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
              />
              <button
                type="button"
                onClick={handleSaveQuickWeight}
                className="px-4 py-2.5 bg-[#26262b] hover:bg-[#ee4d00] text-white hover:text-white font-bold text-xs rounded-xl transition-all"
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
                className="flex-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
              />
              <button
                type="button"
                onClick={handleSaveQuickSteps}
                className="px-4 py-2.5 bg-[#26262b] hover:bg-[#ee4d00] text-white hover:text-white font-bold text-xs rounded-xl transition-all"
              >
                Log
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/nutrition"
              className="text-[11px] font-bold text-[#ee4d00] hover:underline flex items-center gap-1"
            >
              <span>+ Add Meals to Nutrition Diary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid - GYM X Fiery Orange Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Progress Chart */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Bench Press Strength Progress
              </h3>
              <p className="text-[11px] text-neutral-400">Double-progression overload timeline</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30">
              +2.5 kg load &bull; +4.2% e1RM
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={benchPressProgression}>
                <defs>
                  <linearGradient id="gymxOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ee4d00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ee4d00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="session" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" domain={[25, 45]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111114", borderColor: "#26262b", borderRadius: "12px" }}
                  itemStyle={{ color: "#ee4d00" }}
                />
                <Area
                  type="monotone"
                  dataKey="e1rm"
                  name="Est. 1RM (kg)"
                  stroke="#ee4d00"
                  strokeWidth={2.5}
                  fill="url(#gymxOrangeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Weight Trend Chart */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Body Weight Trend
              </h3>
              <p className="text-[11px] text-neutral-400">Baseline 82.0 kg &rarr; Goal 70.0 kg</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ee4d00]/20 text-[#ee4d00] border border-[#ee4d00]/30">
              -2.2 kg Total Lost
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightChartData}>
                <defs>
                  <linearGradient id="gymxWeightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ee4d00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ee4d00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" domain={[68, 84]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111114", borderColor: "#26262b", borderRadius: "12px" }}
                  itemStyle={{ color: "#ee4d00" }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#ee4d00"
                  strokeWidth={2.5}
                  fill="url(#gymxWeightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Muscle Volume Bar Breakdown */}
      <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Weekly Muscle Hypertrophy Volume (Direct Working Sets)
            </h3>
            <p className="text-[11px] text-neutral-400">Optimal hypertrophy range: 10–20 weekly sets per muscle</p>
          </div>
          <Link href="/muscle-map" className="text-xs font-bold text-[#ee4d00] hover:underline">
            Open 3D Muscle Map &rarr;
          </Link>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={muscleVolumeData}>
              <XAxis dataKey="muscle" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111114", borderColor: "#26262b", borderRadius: "12px" }}
                itemStyle={{ color: "#ee4d00" }}
              />
              <Bar dataKey="sets" name="Completed Sets" fill="#ee4d00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
