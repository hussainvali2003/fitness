"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredPersonalRecords,
  getStoredProfile,
  getStoredBodyEntries,
} from "@/lib/storage";
import { PersonalRecord } from "@/types";
import {
  Target,
  Trophy,
  Flame,
  Scale,
  Footprints,
  UtensilsCrossed,
  Moon,
  Sparkles,
  Award,
} from "lucide-react";

export default function GoalsAndPRsPage() {
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [bodyEntries, setBodyEntries] = useState<any[]>([]);

  useEffect(() => {
    setPrs(getStoredPersonalRecords());
    setProfile(getStoredProfile());
    setBodyEntries(getStoredBodyEntries());
  }, []);

  const currentWeight = bodyEntries[0]?.weightKg || profile?.currentWeightKg || 79.8;
  const startWeight = profile?.startingWeightKg || 82.0;
  const targetWeight = profile?.targetWeightKg || 70.0;
  const weightProgressPct = Math.min(
    100,
    Math.max(0, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100))
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Transformation Targets
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">12-Week Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Goals &amp; Personal Records (PRs)
          </h1>
          <p className="text-xs text-surface-400">
            Track key transformation milestones and personal best lifts achieved in the gym.
          </p>
        </div>
      </div>

      {/* Primary Goal Highlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-brand-emerald/20 text-brand-emerald">
              Primary Goal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-2">
              Fat Loss &amp; Lean Cut: 82.0 kg &rarr; 70.0 kg
            </h2>
            <p className="text-xs text-surface-400 mt-1">
              Muscle retention, 5-day hypertrophy program, and metabolic conditioning.
            </p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-black text-brand-emerald font-mono">{weightProgressPct}%</p>
            <p className="text-[10px] text-surface-400 uppercase font-bold">Goal Progress</p>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-surface-900 rounded-full h-3 overflow-hidden p-0.5 border border-surface-700">
            <div
              className="bg-gradient-to-r from-brand-emerald to-brand-cyan h-full rounded-full transition-all duration-1000"
              style={{ width: `${weightProgressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-surface-400">
            <span>Start: 82.0 kg</span>
            <span className="text-brand-emerald font-bold">Current: {currentWeight} kg</span>
            <span>Target: 70.0 kg</span>
          </div>
        </div>
      </div>

      {/* 4 Supporting Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-surface-400 uppercase">Daily Steps</span>
            <Footprints className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-xl font-black text-white font-mono">10,000 / day</p>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-emerald h-full rounded-full" style={{ width: "85%" }} />
          </div>
          <p className="text-[10px] text-surface-400">Active NEAT expenditure</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-surface-400 uppercase">Daily Protein</span>
            <UtensilsCrossed className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-xl font-black text-brand-amber font-mono">135 g / day</p>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-amber h-full rounded-full" style={{ width: "95%" }} />
          </div>
          <p className="text-[10px] text-surface-400">1.7g per kg bodyweight</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-surface-400 uppercase">Workout Frequency</span>
            <Flame className="w-4 h-4 text-brand-rose" />
          </div>
          <p className="text-xl font-black text-brand-rose font-mono">5 Sessions / wk</p>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-rose h-full rounded-full" style={{ width: "100%" }} />
          </div>
          <p className="text-[10px] text-surface-400">Monday &ndash; Friday</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-surface-400 uppercase">Nightly Sleep</span>
            <Moon className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="text-xl font-black text-brand-purple font-mono">7.5 Hours</p>
          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-purple h-full rounded-full" style={{ width: "90%" }} />
          </div>
          <p className="text-[10px] text-surface-400">CNS &amp; hormone balance</p>
        </div>
      </div>

      {/* Personal Records (PRs) Hall of Fame */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-800">
          <div className="flex items-center gap-2 text-brand-emerald">
            <Trophy className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Personal Records Hall of Fame
            </h3>
          </div>
          <span className="text-[11px] text-surface-400 font-mono">Auto-detected from logs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prs.map((pr) => (
            <div
              key={pr.id}
              className="p-5 rounded-2xl bg-surface-900/80 border border-surface-800 hover:border-brand-emerald/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                  {pr.metricType.replace("_", " ")}
                </span>
                <span className="text-[10px] font-mono text-surface-500">{pr.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{pr.exerciseName}</h4>
              <p className="text-2xl font-black text-brand-emerald font-mono">
                {pr.value} <span className="text-xs text-surface-400 font-sans">{pr.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
