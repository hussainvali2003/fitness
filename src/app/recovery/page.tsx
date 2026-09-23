"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredSleepEntries,
  saveSleepEntry,
  getStoredRecoveryEntries,
  saveRecoveryEntry,
} from "@/lib/storage";
import { SleepEntry, RecoveryEntry } from "@/types";
import {
  Moon,
  Zap,
  Plus,
  HeartPulse,
  Sparkles,
  Info,
  CheckCircle2,
  Smile,
  Activity,
} from "lucide-react";

export default function RecoveryPage() {
  const [sleepList, setSleepList] = useState<SleepEntry[]>([]);
  const [recoveryList, setRecoveryList] = useState<RecoveryEntry[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bedtime, setBedtime] = useState("23:15");
  const [wakeTime, setWakeTime] = useState("06:45");
  const [quality, setQuality] = useState(4);

  const [energyScore, setEnergyScore] = useState(4);
  const [sorenessScore, setSorenessScore] = useState(2);
  const [stressScore, setStressScore] = useState(2);
  const [notes, setNotes] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = () => {
    setSleepList(getStoredSleepEntries());
    setRecoveryList(getStoredRecoveryEntries());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute duration in hours from bedtime and wake time
  const calculateDuration = (bed: string, wake: string): number => {
    const [bH, bM] = bed.split(":").map(Number);
    const [wH, wM] = wake.split(":").map(Number);
    let diffMinutes = wH * 60 + wM - (bH * 60 + bM);
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    return Math.round((diffMinutes / 60) * 100) / 100;
  };

  const currentDuration = calculateDuration(bedtime, wakeTime);

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();

    const sleepEntry: SleepEntry = {
      id: "s_" + Date.now(),
      date,
      bedtime,
      wakeTime,
      durationHours: currentDuration,
      quality,
      notes,
    };

    const recoveryEntry: RecoveryEntry = {
      id: "r_" + Date.now(),
      date,
      energyScore,
      sorenessScore,
      stressScore,
      notes,
    };

    saveSleepEntry(sleepEntry);
    saveRecoveryEntry(recoveryEntry);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    loadData();
  };

  const latestSleep = sleepList[0] || { durationHours: 7.33, quality: 4 };
  const latestRecovery = recoveryList[0] || { energyScore: 4, sorenessScore: 2, stressScore: 2 };

  // Calculate readiness score (0-100%)
  const readinessPct = Math.round(
    ((latestRecovery.energyScore + (6 - latestRecovery.sorenessScore) + (6 - latestRecovery.stressScore)) / 15) * 100
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-purple/15 text-brand-purple border border-brand-purple/30">
              CNS &amp; Muscle Repair
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">Target: 7.5h &middot; High Energy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Sleep &amp; Recovery Hub
          </h1>
          <p className="text-xs text-surface-400">
            Track deep sleep duration, neuromuscular soreness, and daily workout readiness.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Sleep Duration</span>
          <p className="text-2xl font-black text-[#ee4d00] font-mono">
            {Math.floor(latestSleep.durationHours)}h {Math.round((latestSleep.durationHours % 1) * 60)}m
          </p>
          <p className="text-[11px] text-[#10b981] font-semibold">Target: 7.5 hours</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Readiness Score</span>
          <p className="text-2xl font-black text-[#ee4d00] font-mono">{readinessPct}%</p>
          <p className="text-[10px] text-neutral-400">Optimal for Morning Lifting</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Energy Level</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{latestRecovery.energyScore} / 5</p>
          <p className="text-[11px] text-neutral-400">Subjective CNS energy</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Muscle Soreness</span>
          <p className="text-2xl font-black text-[#ee4d00] font-mono">{latestRecovery.sorenessScore} / 5</p>
          <p className="text-[11px] text-neutral-400">1: Fresh &middot; 5: High DOMS</p>
        </div>
      </div>

      {/* Sleep & Recovery Log Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sleep Logging */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#ee4d00]" />
            <span>Log Sleep Session</span>
          </h3>

          <form onSubmit={handleSaveLogs} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Bedtime</label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00] font-mono"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#08080a] border border-[#26262b] flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-medium">Calculated Duration:</span>
              <span className="font-mono font-black text-[#ee4d00] text-base">
                {Math.floor(currentDuration)}h {Math.round((currentDuration % 1) * 60)}m
              </span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1 block">Sleep Quality</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setQuality(star)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      quality === star
                        ? "bg-[#ee4d00] text-[#08080a] shadow-[0_0_12px_rgba(56,189,248,0.3)] font-black"
                        : "bg-[#08080a] text-neutral-400 hover:text-white border border-[#26262b]"
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#ee4d00] text-[#08080a] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 fill-current" />
              <span>Save Sleep &amp; Recovery</span>
            </button>

            {savedSuccess && (
              <p className="text-xs font-bold text-[#ee4d00] text-center flex items-center justify-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recovery log saved!</span>
              </p>
            )}
          </form>
        </div>

        {/* Right: Subjective Recovery & Readiness */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] space-y-5">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Subjective Readiness Metrics (1–5)</span>
          </h3>

          <div className="space-y-4">
            {/* Energy */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-neutral-300">Energy &amp; Drive</span>
                <span className="font-mono font-bold text-amber-400">{energyScore} / 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEnergyScore(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      energyScore === val ? "bg-amber-400 text-black font-black" : "bg-[#08080a] text-neutral-400 border border-[#26262b]"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Muscle Soreness */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-neutral-300">Muscle Soreness (DOMS)</span>
                <span className="font-mono font-bold text-[#ee4d00]">{sorenessScore} / 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSorenessScore(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      sorenessScore === val ? "bg-[#ee4d00] text-[#08080a] font-black" : "bg-[#08080a] text-neutral-400 border border-[#26262b]"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-neutral-300">Life / Work Stress</span>
                <span className="font-mono font-bold text-indigo-400">{stressScore} / 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStressScore(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      stressScore === val ? "bg-indigo-500 text-white font-black" : "bg-[#08080a] text-neutral-400 border border-[#26262b]"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Recovery Note</label>
              <input
                type="text"
                placeholder="e.g. Legs slightly tight from Wednesday, shoulder mobility 100%"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
