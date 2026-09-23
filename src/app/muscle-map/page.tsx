"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MuscleGroup } from "@/types";
import { allExercises } from "@/lib/seedData";
import { HumanBodyCanvasHQ } from "@/components/3d/HumanBodyCanvasHQ";
import { FallbackBody2D } from "@/components/3d/FallbackBody2D";
import { MuscleBiomechanicsCard } from "@/components/3d/MuscleBiomechanicsCard";
import { ChestSubHead } from "@/components/3d/MuscleMannequinHQ";
import {
  Sparkles,
  Box,
  ChevronRight,
  RotateCw,
} from "lucide-react";

export default function MuscleMapPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>("chest");
  const [chestSubHead, setChestSubHead] = useState<ChestSubHead>("all");
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
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_12px_rgba(238,77,0,0.2)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GYM X 3D HUMAN ANATOMY LAB</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              360&deg; Real-Time Orbit
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mt-2">
            Muscle Anatomy &amp; Target Explorer
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Rotate 360&deg;, inspect isolated muscle heads (Upper, Mid &amp; Lower Pectorals), and explore hypertrophy biomechanics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIs3DMode(!is3DMode)}
          className="px-5 py-2.5 rounded-full bg-[#111114] hover:bg-[#1a1a20] text-[#ee4d00] font-bold text-xs border border-[#26262b] hover:border-[#ee4d00]/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <RotateCw className="w-4 h-4" />
          <span>Switch to {is3DMode ? "2D Anatomical Fallback" : "3D Interactive Orbit"}</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D/2D Visualizer Area */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-4 sm:p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ee4d00]" />
                <span>3D Anatomical Human Model (Insan)</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 font-bold uppercase">
                  {selectedMuscle.replace("_", " ")}
                </span>
              </div>
            </div>

            {is3DMode ? (
              <div className="rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
                <HumanBodyCanvasHQ
                  selectedMuscle={selectedMuscle}
                  chestSubHead={chestSubHead}
                  onSelectMuscle={(muscle, subHead) => {
                    setSelectedMuscle(muscle);
                    if (subHead) setChestSubHead(subHead);
                  }}
                  height="h-[500px]"
                  showControls={true}
                  initialPreset={selectedMuscle === "chest" ? "chest" : "front"}
                />
              </div>
            ) : (
              <FallbackBody2D
                selectedMuscle={selectedMuscle}
                onSelectMuscle={setSelectedMuscle}
                weeklySetsMap={weeklySets}
              />
            )}
          </div>

          {/* Biomechanics HUD Diagnostic Card */}
          <MuscleBiomechanicsCard
            selectedMuscle={selectedMuscle}
            chestSubHead={chestSubHead}
            onSelectChestSubHead={setChestSubHead}
          />
        </div>

        {/* Right: Muscle Group Selector & Filtered Exercises */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Muscle Pills Selector */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Select Anatomical Region
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">17 Target Zones</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
              {muscleList.map((m) => {
                const isSelected = selectedMuscle === m.id;
                const count = weeklySets[m.id] || 0;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMuscle(m.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.35)]"
                        : "bg-[#08080a] text-neutral-300 hover:text-white border border-[#26262b]"
                    }`}
                  >
                    <span>{m.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? "bg-black/30 text-white" : "bg-[#111114] text-[#ee4d00]"
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
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#26262b]">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Targeted Movements for{" "}
                  <span className="text-[#ee4d00] capitalize">
                    {selectedMuscle.replace("_", " ")}
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {targetingExercises.length} validated exercises in training database
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30">
                {weeklySets[selectedMuscle] || 0} Sets/wk
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {targetingExercises.map((ex) => {
                const isPrimary = ex.primaryMuscle === selectedMuscle;
                return (
                  <Link
                    key={ex.id}
                    href={`/exercises/${ex.id}`}
                    className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b] hover:border-[#ee4d00]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPrimary
                            ? "bg-[#ee4d00] text-white shadow-[0_0_8px_rgba(238,77,0,0.3)]"
                            : "bg-[#26262b] text-neutral-300"
                        }`}
                      >
                        {isPrimary ? "P" : "S"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#ee4d00] transition-colors">
                          {ex.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {ex.defaultSets} sets &times; {ex.repRange} &bull; {ex.equipment}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#ee4d00] group-hover:translate-x-1 transition-transform" />
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
