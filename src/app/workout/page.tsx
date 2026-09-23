"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  weeklyWorkoutPlan,
  allExercises,
} from "@/lib/seedData";
import {
  Dumbbell,
  Play,
  Clock,
  Layers,
  ChevronRight,
  Flame,
  Calendar,
  Sparkles,
  Info,
  RotateCw,
  Eye,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { HumanBodyCanvasHQ } from "@/components/3d/HumanBodyCanvasHQ";

export default function WorkoutOverviewPage() {
  const [selectedDayId, setSelectedDayId] = useState("mon_push");
  const selectedDay = weeklyWorkoutPlan.find((d) => d.id === selectedDayId) || weeklyWorkoutPlan[0];

  // Active exercise selected for the 3D Biomechanics Stage
  const defaultExId = selectedDay.exercises?.[0]?.exerciseId || "bench_press";
  const [active3DExerciseId, setActive3DExerciseId] = useState<string>(defaultExId);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeExerciseObj = allExercises.find((e) => e.id === active3DExerciseId) || allExercises[0];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_12px_rgba(238,77,0,0.2)]">
              ⚡ GYM X 5-Day Hypertrophy
            </span>
            <span className="text-xs text-neutral-400 font-semibold font-mono">12-Week Program</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mt-2">
            Workout Routine &amp; Execution
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Biomechanical exercise execution engine with real-time 3D human anatomy &amp; HQ animation loops.
          </p>
        </div>

        <Link
          href={`/workout/active?day=${selectedDay.id}`}
          className="px-6 py-3.5 rounded-full bg-[#ee4d00] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(238,77,0,0.4)] hover:bg-[#ff5500] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch {selectedDay.name}</span>
        </Link>
      </div>

      {/* 7-Day Split Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weeklyWorkoutPlan.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => {
                setSelectedDayId(day.id);
                if (day.exercises?.[0]) {
                  setActive3DExerciseId(day.exercises[0].exerciseId);
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-[#ee4d00]/15 border-[#ee4d00] text-white shadow-[0_0_20px_rgba(238,77,0,0.25)]"
                  : day.isRestDay
                  ? "bg-[#111114] border-[#26262b] text-neutral-500 hover:border-neutral-700"
                  : "bg-[#111114] border-[#26262b] text-neutral-300 hover:border-[#ee4d00]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase">{day.dayOfWeek.slice(0, 3)}</span>
                {day.isRestDay ? (
                  <span className="text-[10px] font-bold text-neutral-500">Rest</span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d00] shadow-[0_0_8px_#ee4d00]" />
                )}
              </div>
              <p className="text-sm font-black text-white mt-2 truncate">{day.name}</p>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">{day.focus}</p>
            </button>
          );
        })}
      </div>

      {/* 3D BIOMECHANICS STAGE (REAL-TIME 3D HUMAN ATHLETE) */}
      {!selectedDay.isRestDay && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#26262b]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ee4d00] text-white">
                  3D LIVE STAGE
                </span>
                <span className="text-xs font-mono text-[#ee4d00] font-bold">
                  {activeExerciseObj?.category?.toUpperCase()} BIOMECHANICS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span>{activeExerciseObj?.name}</span>
                <span className="text-xs font-mono font-normal text-neutral-400 border border-[#26262b] px-2.5 py-1 rounded-lg">
                  Tempo: {activeExerciseObj?.tempo || "3-0-1-0"}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Primary Target: <span className="text-[#ee4d00] font-bold capitalize">{String(activeExerciseObj?.primaryMuscle).replace("_", " ")}</span>
                {activeExerciseObj?.secondaryMuscles && (
                  <span> &bull; Synergists: {activeExerciseObj.secondaryMuscles.map(m => String(m).replace("_", " ")).join(", ")}</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08080a] border border-[#26262b] text-xs font-mono text-neutral-300">
                <RotateCw className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>360&deg; Orbit Active</span>
              </div>
              <Link
                href={`/exercises/${active3DExerciseId}`}
                className="px-4 py-1.5 rounded-xl bg-[#26262b] hover:bg-[#32323a] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#ee4d00]" />
                <span>Exercise Guide</span>
              </Link>
            </div>
          </div>

          {/* Canvas Component Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
            <HumanBodyCanvasHQ
              exerciseId={active3DExerciseId}
              primaryMuscle={activeExerciseObj?.primaryMuscle}
              secondaryMuscles={activeExerciseObj?.secondaryMuscles}
              height="h-[460px]"
              showControls={true}
              enableAutoRotate={false}
              initialPreset="front"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Target Muscle Activation</span>
              <span className="text-sm font-bold text-white mt-1 block capitalize">
                {String(activeExerciseObj?.primaryMuscle).replace("_", " ")}
              </span>
              <div className="w-full bg-[#1b1b22] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#ee4d00] h-full w-[95%] rounded-full shadow-[0_0_8px_#ee4d00]" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Equipment &amp; Setup</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {activeExerciseObj?.equipment || "Free Weights / Cables"}
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 block truncate">
                Difficulty: {activeExerciseObj?.difficulty || "Intermediate"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Prescription Volume</span>
              <span className="text-sm font-bold text-[#ee4d00] mt-1 block">
                {activeExerciseObj?.defaultSets || 3} Sets &times; {activeExerciseObj?.repRange || "8-12"} Reps
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Rest: {Math.round((activeExerciseObj?.restSeconds || 90) / 60)} min between sets
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Day Workout Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#26262b] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26262b]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {selectedDay.dayOfWeek}: {selectedDay.name}
              </h2>
              {selectedDay.isRestDay && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#26262b] text-neutral-400">
                  Scheduled Rest
                </span>
              )}
            </div>
            <p className="text-xs text-[#ee4d00] font-semibold mt-1">{selectedDay.focus}</p>
          </div>

          <div className="flex items-center gap-3">
            {!selectedDay.isRestDay && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08080a] border border-[#26262b] text-xs font-mono font-bold text-white">
                <Clock className="w-4 h-4 text-[#ee4d00]" />
                <span>~{selectedDay.estimatedMinutes} min</span>
              </span>
            )}
            <Link
              href={`/workout/active?day=${selectedDay.id}`}
              className="px-6 py-2.5 rounded-full bg-[#ee4d00] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(238,77,0,0.3)] hover:bg-[#ff5500] flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Session</span>
            </Link>
          </div>
        </div>

        {/* Exercises List with HQ Looping Animated GIFs */}
        {!selectedDay.isRestDay ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <span>Prescribed Exercise Sequence</span>
                <span className="px-2 py-0.5 rounded bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 font-mono text-[10px]">
                  {selectedDay.exercises.length} Exercises (HQ Animation Loops)
                </span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">Tap &ldquo;3D Stage&rdquo; to load real-time biomechanics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDay.exercises.map((target, idx) => {
                const ex = allExercises.find((e) => e.id === target.exerciseId);
                const isCurrent3D = active3DExerciseId === target.exerciseId;
                const gifPath = `/exercises/${target.exerciseId}.gif`;

                return (
                  <div
                    key={target.exerciseId}
                    className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                      isCurrent3D
                        ? "bg-[#18181d] border-[#ee4d00] shadow-[0_0_20px_rgba(238,77,0,0.25)]"
                        : "bg-[#08080a] border-[#26262b] hover:border-[#ee4d00]/50"
                    }`}
                  >
                    {/* HQ Looping Animated GIF Display */}
                    <div className="relative w-full h-48 bg-[#08080a] overflow-hidden group">
                      {!failedImages[target.exerciseId] ? (
                        <Image
                          src={gifPath}
                          alt={ex?.name || target.exerciseId}
                          fill
                          unoptimized
                          onError={() => {
                            setFailedImages((prev) => ({ ...prev, [target.exerciseId]: true }));
                          }}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111114] to-[#08080a] p-4 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#ee4d00]/15 border border-[#ee4d00]/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(238,77,0,0.3)]">
                            <Dumbbell className="w-6 h-6 text-[#ee4d00] animate-pulse" />
                          </div>
                          <span className="text-xs font-black text-white uppercase">{ex?.name || target.exerciseId}</span>
                          <span className="text-[10px] text-[#ee4d00] font-mono mt-0.5">3D Biomechanics Engine Active</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-black/30 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span className="w-7 h-7 rounded-lg bg-[#ee4d00] text-white flex items-center justify-center font-mono font-black text-xs shadow-md">
                          #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/70 text-white backdrop-blur border border-white/10">
                          {ex?.category || "Chest"}
                        </span>
                      </div>

                      {/* Contraction Indicator */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ee4d00]/80 text-white backdrop-blur flex items-center gap-1 shadow-sm">
                          <Zap className="w-3 h-3 fill-current" />
                          <span>HQ GIF LOOP</span>
                        </span>
                      </div>

                      {/* Bottom Info inside GIF Overlay */}
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between z-10">
                        <div>
                          <p className="text-sm font-black text-white drop-shadow-md">
                            {ex?.name || target.exerciseId}
                          </p>
                          <p className="text-[11px] text-neutral-300 font-mono drop-shadow">
                            {target.sets} sets &times; {target.repRange} reps &bull; Rest {Math.round(target.restSeconds / 60)}m
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions & Metadata */}
                    <div className="p-4 bg-[#111114] flex items-center justify-between gap-3 border-t border-[#26262b]">
                      <button
                        type="button"
                        onClick={() => {
                          setActive3DExerciseId(target.exerciseId);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isCurrent3D
                            ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.3)]"
                            : "bg-[#26262b] text-neutral-300 hover:bg-[#32323a] hover:text-white"
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5 text-white" />
                        <span>{isCurrent3D ? "Active in 3D" : "View in 3D Stage"}</span>
                      </button>

                      <Link
                        href={`/exercises/${target.exerciseId}`}
                        className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-[#26262b] text-neutral-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#ee4d00]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finisher */}
            {selectedDay.finisher && (
              <div className="p-5 rounded-2xl bg-[#ee4d00]/10 border border-[#ee4d00]/30 mt-4 flex items-center gap-3">
                <Flame className="w-6 h-6 text-[#ee4d00] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#ee4d00] uppercase tracking-wider">Session Finisher</p>
                  <p className="text-xs text-neutral-200 mt-0.5">{selectedDay.finisher}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#08080a] border border-[#26262b] flex items-center justify-center mx-auto text-neutral-400">
              <Sparkles className="w-6 h-6 text-[#ee4d00]" />
            </div>
            <h3 className="text-base font-bold text-white">Active Recovery Day</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Prioritize reaching your 10,000 step target, hydrating with 3.0 liters of water, hitting 135g of protein, and getting 7.5 hours of restorative sleep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
