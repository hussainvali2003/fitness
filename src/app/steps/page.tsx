"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredStepEntries,
  saveStepEntry,
  getStoredProfile,
} from "@/lib/storage";
import { StepEntry } from "@/types";
import {
  Footprints,
  Plus,
  Flame,
  Calendar,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function StepsTrackingPage() {
  const [entries, setEntries] = useState<StepEntry[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [stepsInput, setStepsInput] = useState("");
  const [showHealthConnectInfo, setShowHealthConnectInfo] = useState(false);

  const loadData = () => {
    setEntries(getStoredStepEntries());
    setProfile(getStoredProfile());
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((e) => e.date === todayStr);
  const todaySteps = todayEntry ? todayEntry.steps : 7842;
  const targetSteps = profile?.stepTarget || 10000;
  const completionPct = Math.min(100, Math.round((todaySteps / targetSteps) * 100));

  // Weekly stats
  const totalLoggedSteps = entries.reduce((sum, e) => sum + e.steps, 0);
  const avgSteps = entries.length > 0 ? Math.round(totalLoggedSteps / entries.length) : 9420;
  const bestDay = entries.length > 0 ? Math.max(...entries.map((e) => e.steps)) : 11300;

  // Week Heatmap Chart Data
  const weeklyStepsData = [
    { day: "Mon", steps: 9400, target: 10000 },
    { day: "Tue", steps: 10800, target: 10000 },
    { day: "Wed", steps: 7200, target: 10000 },
    { day: "Thu", steps: 11300, target: 10000 },
    { day: "Fri", steps: 8900, target: 10000 },
    { day: "Sat", steps: 10500, target: 10000 },
    { day: "Sun", steps: 9800, target: 10000 },
  ];

  const handleSaveSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(stepsInput, 10);
    if (!val || val <= 0) return;

    saveStepEntry({
      id: "st_" + Date.now(),
      date,
      steps: val,
      targetSteps,
      source: "manual",
    });

    setStepsInput("");
    loadData();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30">
              Cardio &amp; NEAT
            </span>
            <span className="text-xs text-neutral-400 font-semibold font-mono">10,000 Daily Target</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Daily Step Tracker
          </h1>
          <p className="text-xs text-neutral-400">
            Maintain high Non-Exercise Activity Thermogenesis (NEAT) for consistent fat loss.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHealthConnectInfo(!showHealthConnectInfo)}
          className="px-4 py-2 rounded-xl bg-[#111114] hover:bg-[#26262b] text-[#ee4d00] font-bold text-xs border border-[#26262b] transition-colors flex items-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Connect Health Data</span>
        </button>
      </div>

      {/* Health Connect Architecture Info Card */}
      {showHealthConnectInfo && (
        <div className="p-6 rounded-3xl bg-[#ee4d00]/10 border border-[#ee4d00]/30 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-[#ee4d00] font-black text-xs uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Android Health Connect Bridge Architecture</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            The app utilizes a decoupled <strong>HealthDataProvider</strong> abstraction. In V1, logging is direct and private. For native Android step synchronization, an Android APK with Health Connect permissions can stream step and heart rate data directly into your Supabase database.
          </p>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Today&apos;s Steps</span>
          <p className="text-2xl font-black text-[#ee4d00] font-mono">{todaySteps.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-400 font-mono">/ {targetSteps.toLocaleString()} ({completionPct}%)</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Weekly Average</span>
          <p className="text-2xl font-black text-white font-mono">{avgSteps.toLocaleString()}</p>
          <p className="text-[11px] text-[#10b981] font-semibold">Consistent Fat Loss Zone</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Best Single Day</span>
          <p className="text-2xl font-black text-[#ee4d00] font-mono">{bestDay.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-400">Peak calorie expenditure</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Estimated Burn</span>
          <p className="text-2xl font-black text-rose-400 font-mono">~{Math.round(todaySteps * 0.04)} <span className="text-xs text-neutral-400 font-sans">kcal</span></p>
          <p className="text-[10px] text-neutral-500 font-mono">Based on 167cm / 80kg</p>
        </div>
      </div>

      {/* Main Grid: Weekly Bar Chart & Log Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weekly Step Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              7-Day Step Consistency
            </h3>
            <span className="text-xs font-mono font-bold text-[#ee4d00]">
              Target: 10,000 / day
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStepsData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" domain={[0, 14000]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111114", borderColor: "#26262b", borderRadius: "12px", color: "#f9fafb" }}
                  itemStyle={{ color: "#ee4d00" }}
                />
                <Bar dataKey="steps" name="Daily Steps" fill="#ee4d00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Manual Step Entry Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#ee4d00]" />
            <span>Log Step Count</span>
          </h3>

          <form onSubmit={handleSaveSteps} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#ee4d00] uppercase">Step Count *</label>
              <input
                type="number"
                placeholder="e.g. 10450"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#ee4d00] text-[#08080a] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 fill-current" />
              <span>Save Step Record</span>
            </button>
          </form>

          {/* Quick preset buttons */}
          <div className="pt-2">
            <p className="text-[10px] text-neutral-400 uppercase font-bold mb-2">Quick Presets</p>
            <div className="flex items-center gap-2">
              {[8000, 10000, 12000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStepsInput(String(val))}
                  className="flex-1 py-1.5 rounded-xl bg-[#08080a] hover:bg-[#26262b] text-xs font-mono font-bold text-neutral-300 border border-[#26262b] transition-colors"
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
