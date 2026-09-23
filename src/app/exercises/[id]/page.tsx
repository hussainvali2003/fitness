"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { allExercises } from "@/lib/seedData";
import { getStoredWorkoutHistory } from "@/lib/storage";
import { HumanBodyCanvasHQ } from "@/components/3d/HumanBodyCanvasHQ";
import { FallbackBody2D } from "@/components/3d/FallbackBody2D";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Dumbbell,
  Sparkles,
  TrendingUp,
  History,
  RotateCw,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params?.id as string;

  const [activeTab, setActiveTab] = useState<"3d" | "gif">("3d");

  const exercise = allExercises.find((e) => e.id === exerciseId) || allExercises[0];
  const history = getStoredWorkoutHistory();

  // Find all historical sessions for this exercise
  const exerciseHistory = history
    .filter((sess) => sess.exercises.some((e) => e.exerciseId === exercise.id))
    .map((sess) => {
      const ex = sess.exercises.find((e) => e.exerciseId === exercise.id);
      const completedSets = ex?.sets.filter((s) => s.completed) || [];
      const maxWeight = completedSets.length > 0 ? Math.max(...completedSets.map((s) => s.weightKg)) : 30;
      const maxReps = completedSets.length > 0 ? Math.max(...completedSets.map((s) => s.reps)) : 8;
      const e1rm = Math.round(maxWeight * (1 + maxReps / 30) * 10) / 10;
      return {
        date: sess.date,
        weight: maxWeight,
        reps: maxReps,
        e1rm,
        setsSummary: completedSets.map((s) => `${s.weightKg}kg×${s.reps}`).join(" · "),
      };
    })
    .reverse();

  // Default historical graph data if no custom logs exist yet
  const chartData =
    exerciseHistory.length > 0
      ? exerciseHistory
      : [
          { date: "2026-09-01", weight: 30.0, reps: 8, e1rm: 38.0, setsSummary: "30kg×8 · 30kg×8 · 30kg×7" },
          { date: "2026-09-08", weight: 30.0, reps: 9, e1rm: 39.0, setsSummary: "30kg×9 · 30kg×8 · 30kg×8" },
          { date: "2026-09-15", weight: 30.0, reps: 10, e1rm: 40.0, setsSummary: "30kg×10 · 30kg×9 · 30kg×9" },
          { date: "2026-09-22", weight: 32.5, reps: 8, e1rm: 41.2, setsSummary: "32.5kg×8 · 32.5kg×8 · 32.5kg×7" },
        ];

  const gifPath = `/exercises/${exercise.id}.gif`;

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-[#111114] border border-[#26262b] hover:border-[#ee4d00]/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#ee4d00]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_10px_rgba(238,77,0,0.2)]">
                {exercise.category} &bull; {exercise.equipment}
              </span>
              <span className="text-xs text-neutral-400 font-medium font-mono">Difficulty: {exercise.difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mt-1">
              {exercise.name}
            </h1>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#111114] p-1.5 rounded-2xl border border-[#26262b]">
          <button
            type="button"
            onClick={() => setActiveTab("3d")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "3d"
                ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.3)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>3D Stage (360&deg;)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gif")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "gif"
                ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.3)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>HQ GIF Loop</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Visualization & Prescription Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Interactive Human Anatomy or HQ GIF */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ee4d00]" />
                <span>
                  {activeTab === "3d" ? "Real-Time 3D Biomechanics Simulation" : "HQ Cinematic Motion Loop"}
                </span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                {activeTab === "3d" ? "360° Free Orbit & Zoom" : "24-Frame Smooth Cycle"}
              </span>
            </div>

            {activeTab === "3d" ? (
              <div className="rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
                <HumanBodyCanvasHQ
                  exerciseId={exercise.id}
                  primaryMuscle={exercise.primaryMuscle}
                  secondaryMuscles={exercise.secondaryMuscles}
                  height="h-[460px]"
                  showControls={true}
                  enableAutoRotate={false}
                  initialPreset="front"
                />
              </div>
            ) : (
              <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
                <Image
                  src={gifPath}
                  alt={exercise.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prescription Badges & Form Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-5 shadow-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Training Prescription
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Target Rep Range</span>
                <p className="text-lg font-black text-white font-mono mt-0.5">{exercise.repRange}</p>
                <p className="text-[10px] text-neutral-500">{exercise.defaultSets} working sets</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Recommended Rest</span>
                <p className="text-lg font-black text-[#ee4d00] font-mono mt-0.5">
                  {Math.floor(exercise.restSeconds / 60)}:
                  {String(exercise.restSeconds % 60).padStart(2, "0")}
                </p>
                <p className="text-[10px] text-neutral-500">Auto rest timer</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Prescribed Tempo</span>
                <p className="text-lg font-black text-[#ee4d00] font-mono mt-0.5">{exercise.tempo}</p>
                <p className="text-[10px] text-neutral-500">Eccentric / Pause / Push</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Primary Target</span>
                <p className="text-sm font-black text-[#ee4d00] capitalize mt-1 truncate">
                  {exercise.primaryMuscle.replace("_", " ")}
                </p>
                <p className="text-[10px] text-neutral-500">Major prime mover</p>
              </div>
            </div>

            {/* Form Cues */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-[#ee4d00] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Execution Form Cues</span>
              </p>
              <ul className="space-y-1.5 bg-[#08080a] p-4 rounded-2xl border border-[#26262b]">
                {exercise.formCues.map((cue, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="text-[#ee4d00] font-bold">&bull;</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Instructions & Safety Pitfalls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-step instructions */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ee4d00]" />
            <span>Step-by-Step Technical Guide</span>
          </h3>
          <ol className="space-y-3">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-neutral-300">
                <span className="w-5 h-5 rounded-full bg-[#26262b] text-[#ee4d00] font-mono font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed mt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Common Mistakes & Safety */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ee4d00]" />
            <span>Common Pitfalls &amp; Joint Safety</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#ee4d00]/10 border border-[#ee4d00]/25 space-y-1">
              <p className="text-xs font-bold text-[#ee4d00] uppercase">Avoid These Mistakes</p>
              <ul className="space-y-1 mt-1">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="text-[#ee4d00] font-bold">&times;</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#08080a] border border-[#26262b] space-y-1">
              <p className="text-xs font-bold text-white uppercase">Safety Protocol</p>
              <ul className="space-y-1 mt-1">
                {exercise.safetyNotes.map((s, i) => (
                  <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                    <span className="text-[#ee4d00] font-bold">!</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Strength Progression Graph for this Exercise */}
      <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ee4d00]" />
              <span>Historical Strength Progression ({exercise.name})</span>
            </h3>
            <p className="text-[11px] text-neutral-400">Estimated 1RM (Epley formula) &amp; working load over time</p>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ee4d00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ee4d00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111114", borderColor: "#26262b", borderRadius: "12px", color: "#ffffff" }}
                itemStyle={{ color: "#ee4d00" }}
              />
              <Area
                type="monotone"
                dataKey="e1rm"
                name="Est. 1RM (kg)"
                stroke="#ee4d00"
                strokeWidth={2.5}
                fill="url(#exGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Logs List */}
        <div className="pt-4 border-t border-[#26262b] space-y-2">
          <p className="text-xs font-bold text-neutral-400 uppercase">Logged Sessions History</p>
          <div className="space-y-2">
            {chartData.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#08080a] border border-[#26262b] text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neutral-400">{item.date}</span>
                  <span className="font-bold text-white font-mono">{item.setsSummary}</span>
                </div>
                <span className="font-mono font-bold text-[#ee4d00]">
                  e1RM: {item.e1rm} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
