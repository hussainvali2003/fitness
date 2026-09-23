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
          ? "bg-[#ee4d00]/15 border-[#ee4d00] shadow-[0_0_15px_rgba(238,77,0,0.2)]"
          : set.skipped
          ? "bg-[#08080a]/50 border-[#26262b] opacity-60"
          : "bg-[#08080a] border-[#26262b] hover:border-[#ee4d00]/40"
      }`}
    >
      {/* Left: Set number & Previous performance */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#111114] border border-[#26262b] flex items-center justify-center font-mono font-bold text-xs text-[#ee4d00]">
          #{set.setNumber}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Target: {set.targetReps} reps
            </span>
            {set.isPr && (
              <span className="px-1.5 py-0.5 rounded bg-[#ee4d00]/20 text-[#ee4d00] font-bold text-[10px] uppercase">
                PR
              </span>
            )}
          </div>
          {prevSet ? (
            <p className="text-[11px] text-neutral-400 font-mono">
              Prev: <strong className="text-neutral-200">{prevSet.weightKg} kg &times; {prevSet.reps} reps</strong>
            </p>
          ) : (
            <p className="text-[11px] text-neutral-500">First logged session</p>
          )}
        </div>
      </div>

      {/* Middle: Stepper Controls for Weight & Reps */}
      <div className="flex items-center gap-4">
        {/* Weight Stepper */}
        <div className="flex items-center bg-[#111114] rounded-xl border border-[#26262b] p-1">
          <button
            type="button"
            onClick={() => adjustWeight(-2.5)}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-[#26262b] transition-colors"
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
            <span className="text-[10px] text-neutral-400 font-semibold">kg</span>
          </div>
          <button
            type="button"
            onClick={() => adjustWeight(2.5)}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-[#26262b] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reps Stepper */}
        <div className="flex items-center bg-[#111114] rounded-xl border border-[#26262b] p-1">
          <button
            type="button"
            onClick={() => adjustReps(-1)}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-[#26262b] transition-colors"
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
            <span className="text-[10px] text-neutral-400 font-semibold">reps</span>
          </div>
          <button
            type="button"
            onClick={() => adjustReps(1)}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-[#26262b] transition-colors"
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
              ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.3)]"
              : "bg-[#111114] hover:bg-[#26262b] text-neutral-200 border border-[#26262b]"
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{set.completed ? "Done" : "Log"}</span>
        </button>

        <button
          type="button"
          onClick={() => onUpdate({ skipped: !set.skipped, completed: false })}
          title="Skip Set"
          className="p-2 text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-[#26262b] transition-colors"
        >
          <FastForward className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          title="Delete Set"
          className="p-2 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-[#26262b] transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
