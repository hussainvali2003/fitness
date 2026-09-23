"use client";

import React, { useEffect, useState } from "react";
import { Timer, Plus, Minus, SkipForward, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

interface RestTimerModalProps {
  initialSeconds: number;
  isOpen: boolean;
  onFinish: () => void;
  onSkip: () => void;
  exerciseName?: string;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds,
  isOpen,
  onFinish,
  onSkip,
  exerciseName,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setTotalTime(initialSeconds);
  }, [initialSeconds, isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playCompletionChime();
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft, onFinish]);

  const playCompletionChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      // AudioContext unavailable or blocked
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;

  const addTime = (secs: number) => {
    setTimeLeft((prev) => prev + secs);
    setTotalTime((prev) => Math.max(prev, timeLeft + secs));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm bg-[#121826] border border-surface-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-4 right-4 p-2 text-surface-400 hover:text-white rounded-xl hover:bg-surface-800 transition-colors"
          title={soundEnabled ? "Mute chime" : "Unmute chime"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-emerald" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 text-brand-emerald">
          <Timer className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">Rest Interval</span>
        </div>
        {exerciseName && <p className="text-xs text-surface-400 mb-6 truncate max-w-[240px]">{exerciseName}</p>}

        {/* Circular Progress Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-surface-800 stroke-[7] fill-transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-brand-emerald stroke-[7] fill-transparent transition-all duration-1000 ease-linear"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progressPct) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-white font-mono tracking-tight">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-surface-400 font-semibold mt-0.5">RECOVER &amp; BREATHE</span>
          </div>
        </div>

        {/* Quick Increment Controls */}
        <div className="flex items-center justify-center gap-2 mb-6 w-full">
          <button
            type="button"
            onClick={() => addTime(-15)}
            disabled={timeLeft <= 15}
            className="flex-1 py-2 px-3 bg-surface-800 hover:bg-surface-700 disabled:opacity-30 rounded-xl text-xs font-bold text-surface-200 transition-colors"
          >
            -15s
          </button>
          <button
            type="button"
            onClick={() => addTime(30)}
            className="flex-1 py-2 px-3 bg-surface-800 hover:bg-surface-700 rounded-xl text-xs font-bold text-brand-emerald border border-brand-emerald/30 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 30s
          </button>
          <button
            type="button"
            onClick={() => addTime(60)}
            className="flex-1 py-2 px-3 bg-surface-800 hover:bg-surface-700 rounded-xl text-xs font-bold text-surface-200 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 60s
          </button>
        </div>

        {/* Skip Rest Button */}
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-extrabold text-sm shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2 transition-all"
        >
          <SkipForward className="w-4 h-4 fill-black" />
          <span>Skip Rest · Ready Next Set</span>
        </button>
      </div>
    </div>
  );
};
