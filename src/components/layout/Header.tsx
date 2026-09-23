"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Flame } from "lucide-react";
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
    <div className="sticky top-0 z-30 w-full flex flex-col">
      {/* GYM X Athletic Slanted Ticker Ribbon */}
      <div className="w-full bg-[#ee4d00] text-black overflow-hidden py-1 px-4 shadow-[0_2px_15px_rgba(238,77,0,0.35)] select-none">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest font-mono">
          <span className="flex items-center gap-2">
            <span>⚡ APEX HYPERTROPHY</span>
            <span>•</span>
            <span>5-DAY SPLIT</span>
            <span>•</span>
            <span className="hidden sm:inline">PROGRESSIVE OVERLOAD</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden md:inline">1RM EPLEY FORMULA</span>
          </span>
          <span className="font-extrabold text-[10px] bg-black text-[#ee4d00] px-2 py-0.5 rounded">
            GYM X ENGINE
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="w-full bg-[#08080a]/90 backdrop-blur-xl border-b border-[#26262b] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base lg:text-lg font-black text-[#ffffff] tracking-tight uppercase">
              {greeting}, <span className="text-[#ee4d00]">{userName}</span>
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-[#ee4d00]/20 text-[#ee4d00] border border-[#ee4d00]/40 font-mono uppercase tracking-wider">
              GYM X &middot; Week 1
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] font-medium">Target: 70.0 kg &middot; 5-Day Hypertrophy &amp; Cut</p>
        </div>

        <div className="flex items-center gap-3">
          {activeWorkout && !activeWorkout.completed ? (
            <Link
              href="/workout/active"
              className="flex items-center gap-2 px-4 py-2 bg-[#ee4d00] hover:bg-[#ff5500] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#ee4d00]/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Workout</span>
            </Link>
          ) : (
            <Link
              href="/workout/active"
              className="flex items-center gap-2 px-4 py-2 bg-[#ee4d00] hover:bg-[#ff5500] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#ee4d00]/30 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-white fill-white" />
              <span className="hidden sm:inline">Start Today&apos;s Workout</span>
              <span className="sm:hidden">Start</span>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};
