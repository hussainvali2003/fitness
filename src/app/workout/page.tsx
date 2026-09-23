"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function WorkoutOverviewPage() {
  const [selectedDayId, setSelectedDayId] = useState("mon_push");

  const selectedDay = weeklyWorkoutPlan.find((d) => d.id === selectedDayId) || weeklyWorkoutPlan[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              5-Day Hypertrophy Split
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">12-Week Program</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Workout Routine &amp; Schedule
          </h1>
          <p className="text-xs text-surface-400">
            Scientifically structured double-progression routine for maximum fat loss &amp; muscle retention.
          </p>
        </div>

        <Link
          href={`/workout/active?day=${selectedDay.id}`}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-black" />
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
              onClick={() => setSelectedDayId(day.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-brand-emerald/15 border-brand-emerald text-white shadow-glow-emerald"
                  : day.isRestDay
                  ? "bg-surface-900/50 border-surface-800/80 text-surface-400 hover:border-surface-700"
                  : "bg-[#121826] border-surface-800 text-surface-200 hover:border-surface-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase">{day.dayOfWeek.slice(0, 3)}</span>
                {day.isRestDay ? (
                  <span className="text-[10px] font-bold text-surface-500">Rest</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-brand-emerald" />
                )}
              </div>
              <p className="text-sm font-black text-white mt-2 truncate">{day.name}</p>
              <p className="text-[10px] text-surface-400 truncate mt-0.5">{day.focus}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Day Workout Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {selectedDay.dayOfWeek}: {selectedDay.name}
              </h2>
              {selectedDay.isRestDay && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-800 text-surface-400">
                  Scheduled Rest
                </span>
              )}
            </div>
            <p className="text-xs text-brand-emerald font-semibold mt-1">{selectedDay.focus}</p>
          </div>

          <div className="flex items-center gap-3">
            {!selectedDay.isRestDay && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-900 border border-surface-800 text-xs font-mono font-bold text-white">
                <Clock className="w-4 h-4 text-brand-emerald" />
                <span>~{selectedDay.estimatedMinutes} min</span>
              </span>
            )}
            <Link
              href={`/workout/active?day=${selectedDay.id}`}
              className="px-5 py-2.5 rounded-xl bg-brand-emerald text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Start Session</span>
            </Link>
          </div>
        </div>

        {/* Exercises List */}
        {!selectedDay.isRestDay ? (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-surface-400 uppercase tracking-wider">
              Prescribed Exercise Sequence ({selectedDay.exercises.length} Exercises)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedDay.exercises.map((target, idx) => {
                const ex = allExercises.find((e) => e.id === target.exerciseId);
                return (
                  <Link
                    key={target.exerciseId}
                    href={`/exercises/${target.exerciseId}`}
                    className="p-4 rounded-2xl bg-surface-900/70 border border-surface-800 hover:border-surface-700 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-surface-800 flex items-center justify-center font-mono font-bold text-xs text-brand-emerald">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-brand-emerald transition-colors">
                          {ex?.name || target.exerciseId}
                        </p>
                        <p className="text-xs text-surface-400 font-mono mt-0.5">
                          {target.sets} sets &times; {target.repRange} reps &middot; Rest {Math.round(target.restSeconds / 60)}m
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>

            {/* Finisher */}
            {selectedDay.finisher && (
              <div className="p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 mt-4 flex items-center gap-3">
                <Flame className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-cyan uppercase tracking-wider">Session Finisher</p>
                  <p className="text-xs text-surface-200 mt-0.5">{selectedDay.finisher}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto text-surface-400">
              <Sparkles className="w-6 h-6 text-brand-emerald" />
            </div>
            <h3 className="text-base font-bold text-white">Active Recovery Day</h3>
            <p className="text-xs text-surface-400 max-w-md mx-auto leading-relaxed">
              Prioritize reaching your 10,000 step target, hydrating with 3.0 liters of water, hitting 135g of protein, and getting 7.5 hours of restorative sleep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
