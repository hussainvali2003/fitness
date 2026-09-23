"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, CheckCircle2, Flame, Clock, Dumbbell, ArrowRight } from "lucide-react";
import { WorkoutSession } from "@/types";

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  session: WorkoutSession;
  onClose: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  session,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F59B", "#38BDF8", "#F59E0B", "#FFFFFF"],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const durationMin = Math.round(session.durationSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#121826] border border-brand-emerald/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-brand-emerald/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-cyan p-0.5 shadow-glow-emerald mb-4">
          <div className="w-full h-full bg-[#121826] rounded-[14px] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-brand-emerald" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">WORKOUT CRUSHED!</h2>
        <p className="text-xs text-brand-emerald font-semibold uppercase tracking-wider mt-1">
          {session.title} · COMPLETED
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 w-full my-6">
          <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
            <div className="flex items-center justify-center text-brand-emerald mb-1">
              <Dumbbell className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{session.totalVolumeKg.toLocaleString()}</p>
            <p className="text-[10px] text-surface-400 font-medium">Volume (kg)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
            <div className="flex items-center justify-center text-brand-cyan mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{totalSets}</p>
            <p className="text-[10px] text-surface-400 font-medium">Sets Completed</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800">
            <div className="flex items-center justify-center text-brand-amber mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{durationMin}m</p>
            <p className="text-[10px] text-surface-400 font-medium">Duration</p>
          </div>
        </div>

        {/* Progression message */}
        <div className="w-full p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-left mb-6">
          <div className="flex items-center gap-2 mb-1 text-brand-emerald font-bold text-xs">
            <Flame className="w-4 h-4" />
            <span>PROGRESSIVE OVERLOAD UPDATED</span>
          </div>
          <p className="text-xs text-surface-300 leading-relaxed">
            All exercise sets and volume have been saved. Your next workout targets have been automatically adjusted based on today&apos;s logged reps.
          </p>
        </div>

        {/* Save & Return Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-extrabold text-sm shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2 transition-all"
        >
          <span>Save &amp; View Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
