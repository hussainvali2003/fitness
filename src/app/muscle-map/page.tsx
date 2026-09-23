"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MuscleGroup } from "@/types";
import { allExercises } from "@/lib/seedData";
import { HumanBodyCanvas } from "@/components/3d/HumanBodyCanvas";
import { FallbackBody2D } from "@/components/3d/FallbackBody2D";
import {
  Sparkles,
  Box,
  Layers,
  ChevronRight,
  Flame,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function MuscleMapPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>("chest");
  const [is3DMode, setIs3DMode] = useState(true);

  // Weekly sets volume map per muscle
  const weeklySets: Record<MuscleGroup, number> = {
    chest: 10,
    front_delts: 8,
    side_delts: 8,
    rear_delts: 5,
    biceps: 7,
    triceps: 7,
    forearms: 4,
    lats: 12,
    traps: 6,
    upper_back: 8,
    lower_back: 4,
    abs: 9,
    obliques: 6,
    glutes: 6,
    quads: 8,
    hamstrings: 5,
    calves: 6,
  };

  const muscleList: { id: MuscleGroup; label: string; area: "Upper" | "Lower" | "Core" }[] = [
    { id: "chest", label: "Chest (Pectorals)", area: "Upper" },
    { id: "front_delts", label: "Front Deltoids", area: "Upper" },
    { id: "side_delts", label: "Lateral Deltoids", area: "Upper" },
    { id: "rear_delts", label: "Rear Deltoids", area: "Upper" },
    { id: "lats", label: "Latissimus Dorsi", area: "Upper" },
    { id: "traps", label: "Trapezius", area: "Upper" },
    { id: "upper_back", label: "Upper Back / Rhomboids", area: "Upper" },
    { id: "biceps", label: "Biceps", area: "Upper" },
    { id: "triceps", label: "Triceps", area: "Upper" },
    { id: "forearms", label: "Forearms", area: "Upper" },
    { id: "abs", label: "Abdominals", area: "Core" },
    { id: "obliques", label: "Obliques", area: "Core" },
    { id: "lower_back", label: "Lower Back (Spinal Erectors)", area: "Core" },
    { id: "quads", label: "Quadriceps", area: "Lower" },
    { id: "hamstrings", label: "Hamstrings", area: "Lower" },
    { id: "glutes", label: "Glutes", area: "Lower" },
    { id: "calves", label: "Calves", area: "Lower" },
  ];

  // Filter exercises targeting the selected muscle
  const targetingExercises = allExercises.filter(
    (ex) => ex.primaryMuscle === selectedMuscle || ex.secondaryMuscles.includes(selectedMuscle)
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Interactive Anatomy
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">17 Muscle Zones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Muscle Map &amp; Target Explorer
          </h1>
          <p className="text-xs text-surface-400">
            Rotate the 3D model or tap any muscle group to inspect targeted movements and weekly hypertrophy volume.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIs3DMode(!is3DMode)}
          className="px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-brand-emerald font-bold text-xs border border-surface-700 transition-colors flex items-center gap-2"
        >
          <Box className="w-4 h-4" />
          <span>Switch to {is3DMode ? "2D Anatomical Map" : "3D Interactive Orbit"}</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D/2D Visualizer Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-emerald" />
                <span>Active Muscle Highlight</span>
              </h3>
              <span className="text-xs font-mono font-bold text-brand-emerald capitalize">
                {selectedMuscle.replace("_", " ")}
              </span>
            </div>

            {is3DMode ? (
              <HumanBodyCanvas
                selectedMuscle={selectedMuscle}
                onSelectMuscle={setSelectedMuscle}
                height="h-[460px]"
              />
            ) : (
              <FallbackBody2D
                selectedMuscle={selectedMuscle}
                onSelectMuscle={setSelectedMuscle}
                weeklySetsMap={weeklySets}
              />
            )}
          </div>
        </div>

        {/* Right: Muscle Group Selector & Filtered Exercises */}
        <div className="lg:col-span-6 space-y-5">
          {/* Quick Muscle Pills Selector */}
          <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Select Muscle Group
            </h3>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {muscleList.map((m) => {
                const isSelected = selectedMuscle === m.id;
                const count = weeklySets[m.id] || 0;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMuscle(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-brand-emerald text-black shadow-glow-emerald"
                        : "bg-surface-900 text-surface-300 hover:text-white border border-surface-800"
                    }`}
                  >
                    <span>{m.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? "bg-black/20 text-black" : "bg-surface-800 text-brand-cyan"
                      }`}
                    >
                      {count}s
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Targeted Exercises List */}
          <div className="p-6 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-800">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Exercises Targeting <span className="text-brand-emerald capitalize">{selectedMuscle.replace("_", " ")}</span>
                </h3>
                <p className="text-[11px] text-surface-400">
                  {targetingExercises.length} movements found in your program
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                {weeklySets[selectedMuscle] || 0} Weekly Sets
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {targetingExercises.map((ex) => {
                const isPrimary = ex.primaryMuscle === selectedMuscle;
                return (
                  <Link
                    key={ex.id}
                    href={`/exercises/${ex.id}`}
                    className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPrimary ? "bg-brand-emerald/20 text-brand-emerald" : "bg-brand-cyan/20 text-brand-cyan"
                        }`}
                      >
                        {isPrimary ? "P" : "S"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-brand-emerald transition-colors">
                          {ex.name}
                        </p>
                        <p className="text-[10px] text-surface-400 font-mono">
                          {ex.defaultSets} sets &times; {ex.repRange} &middot; {ex.equipment}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
