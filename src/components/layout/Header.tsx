"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Flame, ShieldAlert, Sparkles } from "lucide-react";
import { getStoredActiveWorkout, getStoredProfile } from "@/lib/storage";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [activeWorkout, setActiveWorkout] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [greeting, setGreeting] = React.useState("Good day");

  React.useEffect(() => {
    setActiveWorkout(getStoredActiveWorkout());
    setProfile(getStoredProfile());

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [pathname]);

  const userName = profile?.name || "Hussain";

  return (
    <header className="w-full bg-[#080B11]/80 backdrop-blur-md border-b border-[#1B2336] sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base lg:text-lg font-black text-white tracking-tight uppercase">
            {greeting}, <span className="text-brand-emerald">{userName}</span>
          </h2>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
            Week 1 · Day 1
          </span>
        </div>
        <p className="text-xs text-surface-400 font-medium">Target: 70.0 kg · 5-Day Hypertrophy &amp; Cut</p>
      </div>

      <div className="flex items-center gap-3">
        {activeWorkout && !activeWorkout.completed ? (
          <Link
            href="/workout/active"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-emerald text-black font-bold text-xs shadow-glow-emerald hover:bg-[#22f7a6] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Resume Workout</span>
          </Link>
        ) : (
          <Link
            href="/workout/active"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-semibold text-xs border border-surface-700 transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-brand-emerald" />
            <span className="hidden sm:inline">Start Today&apos;s Workout</span>
            <span className="sm:hidden">Start</span>
          </Link>
        )}
      </div>
    </header>
  );
};
