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
      // Fire celebratory confetti with GYM X orange and white
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ee4d00", "#ff7700", "#ffffff"],
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
      <div className="w-full max-w-lg bg-[#111114] border border-[#26262b] rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#ee4d00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#ee4d00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#ee4d00] p-0.5 shadow-[0_0_20px_rgba(238,77,0,0.4)] mb-4">
          <div className="w-full h-full bg-[#111114] rounded-[14px] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#ee4d00]" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight uppercase">WORKOUT CRUSHED!</h2>
        <p className="text-xs text-[#ee4d00] font-bold uppercase tracking-wider mt-1">
          {session.title} &bull; COMPLETED
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 w-full my-6">
          <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
            <div className="flex items-center justify-center text-[#ee4d00] mb-1">
              <Dumbbell className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{session.totalVolumeKg.toLocaleString()}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Volume (kg)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
            <div className="flex items-center justify-center text-[#ee4d00] mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{totalSets}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Sets Completed</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
            <div className="flex items-center justify-center text-[#ee4d00] mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-white font-mono">{durationMin}m</p>
            <p className="text-[10px] text-neutral-400 font-medium">Duration</p>
          </div>
        </div>

        {/* Progression message */}
        <div className="w-full p-4 rounded-2xl bg-[#ee4d00]/10 border border-[#ee4d00]/30 text-left mb-6">
          <div className="flex items-center gap-2 mb-1 text-[#ee4d00] font-bold text-xs">
            <Flame className="w-4 h-4" />
            <span>PROGRESSIVE OVERLOAD UPDATED</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            All exercise sets and volume have been saved. Your next workout targets have been automatically adjusted based on today&apos;s logged reps.
          </p>
        </div>

        {/* Save & Return Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-full bg-[#ee4d00] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(238,77,0,0.35)] hover:bg-[#ff5500] flex items-center justify-center gap-2 transition-all"
        >
          <span>Save &amp; View Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
