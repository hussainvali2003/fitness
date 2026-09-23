"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle2,
  Flame,
  Scale,
  Footprints,
  UtensilsCrossed,
  Moon,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";
import { WeekProgressSummary } from "@/types";

export default function TwelveWeekProgramPage() {
  const [activeWeek, setActiveWeek] = useState(1);

  // Pre-calculated transformation data for 12 weeks
  const weeksData: Record<number, WeekProgressSummary> = {
    1: {
      weekNumber: 1,
      startDate: "Sep 01, 2026",
      endDate: "Sep 07, 2026",
      workoutsCompleted: 5,
      totalWorkouts: 5,
      avgWeightKg: 81.6,
      weightDeltaKg: -0.4,
      avgSteps: 9420,
      avgCalories: 1840,
      avgProteinG: 132,
      avgSleepHours: 7.3,
      strengthDeltaPct: 2.1,
      achievements: [
        "5/5 workouts completed with zero missed sessions",
        "Protein target achieved 6 out of 7 days (132g avg)",
        "Bench Press baseline calibrated at 30kg x 8 reps",
        "10k daily step target hit on 5 days",
      ],
      focusNextWeek: "Maintain lifting intensity, stay consistent on sleep bedtime at 23:00, and ensure complete hydration.",
    },
    2: {
      weekNumber: 2,
      startDate: "Sep 08, 2026",
      endDate: "Sep 14, 2026",
      workoutsCompleted: 5,
      totalWorkouts: 5,
      avgWeightKg: 80.9,
      weightDeltaKg: -0.7,
      avgSteps: 10150,
      avgCalories: 1835,
      avgProteinG: 135,
      avgSleepHours: 7.4,
      strengthDeltaPct: 3.5,
      achievements: [
        "Bench Press reps increased from 8 to 10 reps at 30kg",
        "Lat Pulldown load increased to 47.5kg",
        "10k+ steps maintained across all 7 days",
        "Waist measurement down by 0.8 cm",
      ],
      focusNextWeek: "Push for top of rep range across all sets on Incline DB Press and Leg Press.",
    },
    3: {
      weekNumber: 3,
      startDate: "Sep 15, 2026",
      endDate: "Sep 21, 2026",
      workoutsCompleted: 5,
      totalWorkouts: 5,
      avgWeightKg: 80.2,
      weightDeltaKg: -0.7,
      avgSteps: 9860,
      avgCalories: 1845,
      avgProteinG: 138,
      avgSleepHours: 7.5,
      strengthDeltaPct: 4.8,
      achievements: [
        "Unlocked progressive overload bump to 32.5kg on Bench Press",
        "Total body weight dropped to 79.8kg (-2.2kg total down from baseline)",
        "High energy and recovery scores throughout all morning sessions",
      ],
      focusNextWeek: "Consolidate 32.5kg bench press form and maintain strict 3-second eccentric tempo.",
    },
    4: {
      weekNumber: 4,
      startDate: "Sep 22, 2026",
      endDate: "Sep 28, 2026",
      workoutsCompleted: 2,
      totalWorkouts: 5,
      avgWeightKg: 79.8,
      weightDeltaKg: -0.4,
      avgSteps: 10200,
      avgCalories: 1850,
      avgProteinG: 136,
      avgSleepHours: 7.5,
      strengthDeltaPct: 5.4,
      achievements: [
        "Phase 1 milestone complete! -2.2kg total fat loss with zero strength loss",
        "32.5kg x 8 reps logged cleanly on Bench Press",
      ],
      focusNextWeek: "Enter Month 2 Hypertrophy Phase: maintain caloric deficit and push pulling volume.",
    },
  };

  const currentSummary = weeksData[activeWeek] || {
    weekNumber: activeWeek,
    startDate: `Week ${activeWeek} Start`,
    endDate: `Week ${activeWeek} End`,
    workoutsCompleted: 0,
    totalWorkouts: 5,
    avgWeightKg: Math.round((82.0 - activeWeek * 0.7) * 10) / 10,
    weightDeltaKg: -0.6,
    avgSteps: 10000,
    avgCalories: 1850,
    avgProteinG: 135,
    avgSleepHours: 7.5,
    strengthDeltaPct: Math.round(activeWeek * 1.5 * 10) / 10,
    achievements: ["Planned progression milestone in 12-week transformation journey"],
    focusNextWeek: "Continue progressive overload double progression and strict daily protein intake.",
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30">
              Transformation Journey
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">12-Week Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            12-Week Transformation Hub
          </h1>
          <p className="text-xs text-surface-400">
            Hussain&apos;s structured timeline: 82.0 kg &rarr; 70.0 kg target with continuous progressive overload.
          </p>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 bg-[#111114] p-1.5 rounded-2xl border border-[#26262b]">
          <button
            type="button"
            disabled={activeWeek <= 1}
            onClick={() => setActiveWeek((w) => w - 1)}
            className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-[#26262b] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-mono font-black text-sm text-[#ee4d00]">
            WEEK {activeWeek} / 12
          </span>
          <button
            type="button"
            disabled={activeWeek >= 12}
            onClick={() => setActiveWeek((w) => w + 1)}
            className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 rounded-xl hover:bg-[#26262b] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 12-Week Timeline Bar */}
      <div className="p-4 rounded-3xl bg-[#111114] border border-[#26262b]">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {Array.from({ length: 12 }).map((_, i) => {
            const wNum = i + 1;
            const isCurrent = wNum === activeWeek;
            const isCompleted = wNum < 4;
            return (
              <button
                key={wNum}
                type="button"
                onClick={() => setActiveWeek(wNum)}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-center transition-all ${
                  isCurrent
                    ? "bg-[#ee4d00] text-[#08080a] font-black shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    : isCompleted
                    ? "bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 font-bold"
                    : "bg-[#08080a] text-neutral-500 border border-[#26262b] font-medium"
                }`}
              >
                <div className="text-[10px] uppercase">{wNum <= 4 ? "Month 1" : wNum <= 8 ? "Month 2" : "Month 3"}</div>
                <div className="text-xs font-mono font-bold mt-0.5">Wk {wNum}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Week Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Workouts</span>
          <p className="text-xl font-black text-[#ee4d00] font-mono mt-1">
            {currentSummary.workoutsCompleted} / {currentSummary.totalWorkouts}
          </p>
          <p className="text-[10px] text-neutral-500">100% adherence</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Avg Weight</span>
          <p className="text-xl font-black text-white font-mono mt-1">
            {currentSummary.avgWeightKg} kg
          </p>
          <p className="text-[10px] font-bold text-[#10b981]">{currentSummary.weightDeltaKg} kg this week</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Avg Steps</span>
          <p className="text-xl font-black text-[#ee4d00] font-mono mt-1">
            {currentSummary.avgSteps.toLocaleString()}
          </p>
          <p className="text-[10px] text-neutral-500">Target: 10,000</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Avg Protein</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">
            {currentSummary.avgProteinG} g
          </p>
          <p className="text-[10px] text-neutral-500">Target: 135g</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Avg Calories</span>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">
            {currentSummary.avgCalories} kcal
          </p>
          <p className="text-[10px] text-neutral-500">Target: 1,850</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111114] border border-[#26262b]">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Strength Delta</span>
          <p className="text-xl font-black text-[#ee4d00] font-mono mt-1">
            +{currentSummary.strengthDeltaPct}%
          </p>
          <p className="text-[10px] text-[#10b981] font-semibold">Overload active</p>
        </div>
      </div>

      {/* Achievements & Next Week Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4">
          <div className="flex items-center gap-2 text-[#ee4d00]">
            <Trophy className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Week {activeWeek} Performance Review
            </h3>
          </div>

          <div className="space-y-2.5">
            {currentSummary.achievements.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-[#08080a] border border-[#26262b] text-xs text-neutral-200"
              >
                <CheckCircle2 className="w-4 h-4 text-[#ee4d00] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Week Focus */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#ee4d00] mb-3">
              <Target className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Next Week Strategic Focus
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#08080a] p-4 rounded-2xl border border-[#26262b]">
              {currentSummary.focusNextWeek}
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/workout"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ee4d00] text-[#08080a] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:brightness-110 flex items-center justify-center gap-2 transition-all"
            >
              <span>View Week {activeWeek} Workout Program</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
