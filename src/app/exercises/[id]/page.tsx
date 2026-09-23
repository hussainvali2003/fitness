"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { allExercises } from "@/lib/seedData";
import { getStoredWorkoutHistory } from "@/lib/storage";
import { HumanBodyCanvas } from "@/components/3d/HumanBodyCanvas";
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

  const [view3D, setView3D] = useState(true);

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

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/exercises")}
            className="p-2 text-surface-400 hover:text-white rounded-xl hover:bg-surface-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                {exercise.category} · {exercise.equipment}
              </span>
              <span className="text-xs text-surface-400 font-medium">Difficulty: {exercise.difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mt-1">
              {exercise.name}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setView3D(!view3D)}
          className="px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-brand-emerald font-bold text-xs border border-surface-700 transition-colors flex items-center gap-2"
        >
          <Box className="w-4 h-4" />
          <span>Toggle {view3D ? "2D Map" : "3D Orbit"}</span>
        </button>
      </div>

      {/* Main Grid: 3D Visualization & Prescription Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Interactive Human Anatomy */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-emerald" />
                <span>3D Targeted Muscle Activation</span>
              </h3>
              <span className="text-[11px] text-surface-400">Drag to rotate · Scroll to zoom</span>
            </div>

            {view3D ? (
              <HumanBodyCanvas
                primaryMuscle={exercise.primaryMuscle}
                secondaryMuscles={exercise.secondaryMuscles}
                height="h-[400px]"
              />
            ) : (
              <FallbackBody2D
                primaryMuscle={exercise.primaryMuscle}
                secondaryMuscles={exercise.secondaryMuscles}
              />
            )}
          </div>
        </div>

        {/* Right Column: Prescription Badges & Form Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Training Prescription
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
                <span className="text-[10px] text-surface-400 uppercase font-bold">Target Rep Range</span>
                <p className="text-lg font-black text-white font-mono mt-0.5">{exercise.repRange}</p>
                <p className="text-[10px] text-surface-500">{exercise.defaultSets} working sets</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
                <span className="text-[10px] text-surface-400 uppercase font-bold">Recommended Rest</span>
                <p className="text-lg font-black text-brand-emerald font-mono mt-0.5">
                  {Math.floor(exercise.restSeconds / 60)}:
                  {String(exercise.restSeconds % 60).padStart(2, "0")}
                </p>
                <p className="text-[10px] text-surface-500">Auto rest timer</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
                <span className="text-[10px] text-surface-400 uppercase font-bold">Prescribed Tempo</span>
                <p className="text-lg font-black text-brand-cyan font-mono mt-0.5">{exercise.tempo}</p>
                <p className="text-[10px] text-surface-500">Eccentric / Pause / Push</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
                <span className="text-[10px] text-surface-400 uppercase font-bold">Primary Target</span>
                <p className="text-sm font-black text-brand-emerald capitalize mt-1 truncate">
                  {exercise.primaryMuscle.replace("_", " ")}
                </p>
                <p className="text-[10px] text-surface-500">Major prime mover</p>
              </div>
            </div>

            {/* Form Cues */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Execution Form Cues</span>
              </p>
              <ul className="space-y-1.5 bg-surface-900/60 p-3.5 rounded-2xl border border-surface-800">
                {exercise.formCues.map((cue, i) => (
                  <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                    <span className="text-brand-emerald font-bold">&bull;</span>
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
        <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Step-by-Step Technical Guide</span>
          </h3>
          <ol className="space-y-3">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-surface-300">
                <span className="w-5 h-5 rounded-full bg-surface-800 text-brand-cyan font-mono font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed mt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Common Mistakes & Safety */}
        <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Common Pitfalls &amp; Joint Safety</span>
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <p className="text-xs font-bold text-rose-400 uppercase">Avoid These Mistakes</p>
              <ul className="space-y-1">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">&times;</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <p className="text-xs font-bold text-amber-400 uppercase">Safety Protocol</p>
              <ul className="space-y-1">
                {exercise.safetyNotes.map((s, i) => (
                  <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Strength Progression Graph for this Exercise */}
      <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-emerald" />
              <span>Historical Strength Progression ({exercise.name})</span>
            </h3>
            <p className="text-[11px] text-surface-400">Estimated 1RM (Epley formula) &amp; working load over time</p>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F59B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F59B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
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
                fill="url(#exGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Logs List */}
        <div className="pt-4 border-t border-surface-800 space-y-2">
          <p className="text-xs font-bold text-surface-400 uppercase">Logged Sessions History</p>
          <div className="space-y-2">
            {chartData.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-surface-400">{item.date}</span>
                  <span className="font-bold text-white font-mono">{item.setsSummary}</span>
                </div>
                <span className="font-mono font-bold text-brand-emerald">
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
