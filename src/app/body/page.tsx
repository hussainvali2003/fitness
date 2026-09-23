"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredBodyEntries,
  saveBodyEntry,
  getStoredProfile,
  calculate7DayWeightAverage,
  getStoredProgressPhotos,
  saveProgressPhoto,
} from "@/lib/storage";
import { BodyEntry, ProgressPhoto } from "@/types";
import {
  Scale,
  Plus,
  TrendingDown,
  Calendar,
  Camera,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BodyTrackingPage() {
  const [entries, setEntries] = useState<BodyEntry[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  // Log Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arms, setArms] = useState("");
  const [thighs, setThighs] = useState("");
  const [hips, setHips] = useState("");
  const [neck, setNeck] = useState("");
  const [notes, setNotes] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = () => {
    setEntries(getStoredBodyEntries());
    setProfile(getStoredProfile());
    setPhotos(getStoredProgressPhotos());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const wVal = parseFloat(weight);
    if (!wVal || wVal <= 0) return;

    const newEntry: BodyEntry = {
      id: "b_" + Date.now(),
      date,
      weightKg: wVal,
      waistCm: waist ? parseFloat(waist) : undefined,
      chestCm: chest ? parseFloat(chest) : undefined,
      armsCm: arms ? parseFloat(arms) : undefined,
      thighsCm: thighs ? parseFloat(thighs) : undefined,
      hipsCm: hips ? parseFloat(hips) : undefined,
      neckCm: neck ? parseFloat(neck) : undefined,
      notes: notes || undefined,
    };

    saveBodyEntry(newEntry);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    // Reset inputs
    setWeight("");
    setWaist("");
    setChest("");
    setArms("");
    setThighs("");
    setHips("");
    setNeck("");
    setNotes("");
    loadData();
  };

  const latest = entries[0] || { weightKg: 79.8, waistCm: 86.0, chestCm: 102.0, armsCm: 35.0, thighsCm: 58.5, hipsCm: 102.0 };
  const baseline = entries[entries.length - 1] || latest;

  const currentWeight = latest.weightKg;
  const startingWeight = profile?.startingWeightKg || 82.0;
  const targetWeight = profile?.targetWeightKg || 70.0;
  const totalLost = Math.round((currentWeight - startingWeight) * 10) / 10;
  const remaining = Math.round((currentWeight - targetWeight) * 10) / 10;
  const sevenDayAvg = calculate7DayWeightAverage(entries);

  // Chart data
  const chartData = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: e.date.slice(5),
      weight: e.weightKg,
      waist: e.waistCm,
    }));

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              Body Composition
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">Fat Loss &amp; Retention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Weight &amp; Girth Measurements
          </h1>
          <p className="text-xs text-surface-400">
            Track daily weight fluctuations, 7-day moving averages, and anatomical circumferences.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-1">
          <span className="text-[10px] text-surface-400 font-bold uppercase">Current Weight</span>
          <p className="text-2xl font-black text-white font-mono">{currentWeight} <span className="text-xs text-surface-400 font-sans">kg</span></p>
          <p className="text-[11px] font-bold text-brand-emerald flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{totalLost} kg from baseline</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-1">
          <span className="text-[10px] text-surface-400 font-bold uppercase">7-Day Moving Avg</span>
          <p className="text-2xl font-black text-brand-cyan font-mono">{sevenDayAvg} <span className="text-xs text-surface-400 font-sans">kg</span></p>
          <p className="text-[10px] text-surface-400">Smoothed daily water fluctuation</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-1">
          <span className="text-[10px] text-surface-400 font-bold uppercase">Target Goal</span>
          <p className="text-2xl font-black text-brand-emerald font-mono">{targetWeight} <span className="text-xs text-surface-400 font-sans">kg</span></p>
          <p className="text-[11px] text-surface-300 font-mono font-bold">{remaining} kg remaining to goal</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121826] border border-surface-800 space-y-1">
          <span className="text-[10px] text-surface-400 font-bold uppercase">Waist Circumference</span>
          <p className="text-2xl font-black text-white font-mono">
            {latest.waistCm || 86.0} <span className="text-xs text-surface-400 font-sans">cm</span>
          </p>
          <p className="text-[11px] font-bold text-brand-emerald">
            -3.0 cm down from 89.0cm
          </p>
        </div>
      </div>

      {/* Measurement Deltas Grid */}
      <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Key Anatomical Circumference Deltas
          </h3>
          <span className="text-[11px] text-surface-400">Starting vs Latest</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Waist", start: 89.0, current: latest.waistCm || 86.0, unit: "cm" },
            { label: "Chest", start: 101.0, current: latest.chestCm || 102.0, unit: "cm" },
            { label: "Arms", start: 34.5, current: latest.armsCm || 35.0, unit: "cm" },
            { label: "Thighs", start: 60.0, current: latest.thighsCm || 58.5, unit: "cm" },
            { label: "Hips", start: 104.0, current: latest.hipsCm || 102.0, unit: "cm" },
            { label: "Neck", start: 39.0, current: latest.neckCm || 38.5, unit: "cm" },
          ].map((m, i) => {
            const delta = Math.round((m.current - m.start) * 10) / 10;
            return (
              <div key={i} className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800 space-y-1">
                <span className="text-[10px] text-surface-400 font-bold uppercase">{m.label}</span>
                <p className="text-base font-black text-white font-mono">
                  {m.current} <span className="text-[10px] font-sans text-surface-400">{m.unit}</span>
                </p>
                <p
                  className={`text-[10px] font-mono font-bold ${
                    delta <= 0 ? "text-brand-emerald" : "text-brand-cyan"
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta} {m.unit}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Weight Chart & Log Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Weight Trend &amp; Moving Average
              </h3>
              <p className="text-[11px] text-surface-400">7-day average is more reliable than daily scale noise</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Target: 70.0 kg
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" domain={[72, 84]} fontSize={11} />
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
                  fill="url(#bodyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Log Measurement Entry Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-emerald" />
            <span>Log Daily Weight &amp; Measurements</span>
          </h3>

          <form onSubmit={handleSaveEntry} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Entry Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-brand-emerald uppercase">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 79.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-surface-400 uppercase">Waist (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 85.5"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-surface-400 uppercase">Chest (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 102.0"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-surface-400 uppercase">Arms (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 35.0"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Optional Notes</label>
              <input
                type="text"
                placeholder="e.g. Post-cardio weigh in, feeling light"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 fill-black" />
              <span>Save Measurement Entry</span>
            </button>

            {savedSuccess && (
              <p className="text-xs font-bold text-brand-emerald text-center flex items-center justify-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Entry saved successfully!</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
