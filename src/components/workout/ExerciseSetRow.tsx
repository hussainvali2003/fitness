"use client";

import React from "react";
import { LoggedSet } from "@/types";
import { Check, Plus, Minus, Trash2, FastForward } from "lucide-react";

interface ExerciseSetRowProps {
  set: LoggedSet;
  prevSet?: { weightKg: number; reps: number };
  onUpdate: (updated: Partial<LoggedSet>) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export const ExerciseSetRow: React.FC<ExerciseSetRowProps> = ({
  set,
  prevSet,
  onUpdate,
  onToggleComplete,
  onDelete,
}) => {
  const adjustWeight = (delta: number) => {
    const next = Math.max(0, Math.round((set.weightKg + delta) * 10) / 10);
    onUpdate({ weightKg: next });
  };

  const adjustReps = (delta: number) => {
    const next = Math.max(0, set.reps + delta);
    onUpdate({ reps: next });
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        set.completed
          ? "bg-brand-emerald/10 border-brand-emerald/40 shadow-[0_0_15px_rgba(0,245,155,0.08)]"
          : set.skipped
          ? "bg-surface-900/50 border-surface-800 opacity-60"
          : "bg-[#131929] border-surface-800 hover:border-surface-700"
      }`}
    >
      {/* Left: Set number & Previous performance */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-surface-800 flex items-center justify-center font-mono font-bold text-xs text-white">
          #{set.setNumber}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Target: {set.targetReps} reps
            </span>
            {set.isPr && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase">
                PR
              </span>
            )}
          </div>
          {prevSet ? (
            <p className="text-[11px] text-surface-400 font-mono">
              Prev: <strong className="text-surface-200">{prevSet.weightKg} kg × {prevSet.reps} reps</strong>
            </p>
          ) : (
            <p className="text-[11px] text-surface-500">First logged session</p>
          )}
        </div>
      </div>

      {/* Middle: Stepper Controls for Weight & Reps */}
      <div className="flex items-center gap-4">
        {/* Weight Stepper */}
        <div className="flex items-center bg-surface-900 rounded-xl border border-surface-700 p-1">
          <button
            type="button"
            onClick={() => adjustWeight(-2.5)}
            className="w-7 h-7 flex items-center justify-center text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center px-2">
            <input
              type="number"
              step="0.5"
              min="0"
              value={set.weightKg || ""}
              onChange={(e) => onUpdate({ weightKg: parseFloat(e.target.value) || 0 })}
              className="w-12 bg-transparent text-center font-mono font-bold text-sm text-white focus:outline-none"
            />
            <span className="text-[10px] text-surface-400 font-semibold">kg</span>
          </div>
          <button
            type="button"
            onClick={() => adjustWeight(2.5)}
            className="w-7 h-7 flex items-center justify-center text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reps Stepper */}
        <div className="flex items-center bg-surface-900 rounded-xl border border-surface-700 p-1">
          <button
            type="button"
            onClick={() => adjustReps(-1)}
            className="w-7 h-7 flex items-center justify-center text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center px-2">
            <input
              type="number"
              min="0"
              value={set.reps || ""}
              onChange={(e) => onUpdate({ reps: parseInt(e.target.value, 10) || 0 })}
              className="w-10 bg-transparent text-center font-mono font-bold text-sm text-white focus:outline-none"
            />
            <span className="text-[10px] text-surface-400 font-semibold">reps</span>
          </div>
          <button
            type="button"
            onClick={() => adjustReps(1)}
            className="w-7 h-7 flex items-center justify-center text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Actions (Complete, Skip, Delete) */}
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onToggleComplete}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
            set.completed
              ? "bg-brand-emerald text-black shadow-glow-emerald"
              : "bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700"
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{set.completed ? "Done" : "Log"}</span>
        </button>

        <button
          type="button"
          onClick={() => onUpdate({ skipped: !set.skipped, completed: false })}
          title="Skip Set"
          className="p-2 text-surface-500 hover:text-surface-300 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <FastForward className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          title="Delete Set"
          className="p-2 text-surface-500 hover:text-rose-400 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
