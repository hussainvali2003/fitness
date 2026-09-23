"use client";

import React, { useState, useEffect } from "react";
import { getStoredWorkoutHistory } from "@/lib/storage";
import { WorkoutSession } from "@/types";
import {
  History,
  Dumbbell,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Flame,
} from "lucide-react";

export default function WorkoutHistoryPage() {
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getStoredWorkoutHistory());
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Training Logbook
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">{history.length} Sessions Logged</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Workout History &amp; Logs
          </h1>
          <p className="text-xs text-surface-400">
            Inspect every completed session, logged weights, reps, and cumulative tonnage.
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((session) => {
            const isExpanded = expandedId === session.id;
            const totalSets = session.exercises.reduce(
              (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
              0
            );
            const durationMin = Math.round(session.durationSeconds / 60);

            return (
              <div
                key={session.id}
                className="rounded-3xl bg-[#121826] border border-surface-800 overflow-hidden transition-all"
              >
                {/* Session Header Clickable */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-brand-emerald font-bold">{session.date}</span>
                      {session.isDemo && (
                        <span className="px-1.5 py-0.5 rounded bg-surface-800 text-[10px] font-mono text-surface-400">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                      {session.title}
                    </h3>
                    <p className="text-xs text-surface-400">
                      {session.exercises.length} exercises &middot; {totalSets} sets completed
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-900 border border-surface-800 font-bold text-white">
                        <Dumbbell className="w-3.5 h-3.5 text-brand-emerald" />
                        <span>{session.totalVolumeKg.toLocaleString()} kg</span>
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-900 border border-surface-800 font-bold text-surface-300">
                        <Clock className="w-3.5 h-3.5 text-brand-amber" />
                        <span>{durationMin}m</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-2 text-surface-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Exercise Logs Table */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-surface-800/80 space-y-4 bg-surface-900/30 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {session.exercises.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[#121826] border border-surface-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate max-w-[200px]">
                              {ex.exerciseName}
                            </span>
                            <span className="text-[10px] font-mono text-brand-emerald font-bold">
                              {ex.sets.filter((s) => s.completed).length} sets logged
                            </span>
                          </div>

                          <div className="space-y-1">
                            {ex.sets.map((set, sIdx) => (
                              <div
                                key={sIdx}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono ${
                                  set.completed
                                    ? "bg-surface-900 text-surface-200"
                                    : "bg-surface-900/40 text-surface-500 opacity-60"
                                }`}
                              >
                                <span className="font-bold">Set {set.setNumber}</span>
                                <span>
                                  {set.weightKg} kg &times; {set.reps} reps
                                </span>
                                {set.rpe && <span className="text-surface-400">RPE {set.rpe}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#121826] border border-surface-800 text-surface-400">
            No completed workouts found yet. Start today&apos;s workout to log your first session!
          </div>
        )}
      </div>
    </div>
  );
}
