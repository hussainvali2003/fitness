"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  Layers,
  Sparkles,
  CalendarDays,
  Scale,
  UtensilsCrossed,
  Footprints,
  Moon,
  History,
  Target,
  Settings,
  Flame,
  ChevronRight,
} from "lucide-react";
import { getStoredActiveWorkout, getStoredProfile } from "@/lib/storage";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Workout", href: "/workout", icon: Dumbbell },
  { label: "Exercises", href: "/exercises", icon: Layers },
  { label: "Muscle Map", href: "/muscle-map", icon: Sparkles },
  { label: "12-Week Journey", href: "/program", icon: CalendarDays },
  { label: "Body & Weight", href: "/body", icon: Scale },
  { label: "Nutrition & Macros", href: "/nutrition", icon: UtensilsCrossed },
  { label: "Steps & Cardio", href: "/steps", icon: Footprints },
  { label: "Sleep & Recovery", href: "/recovery", icon: Moon },
  { label: "Workout History", href: "/history", icon: History },
  { label: "Goals & PRs", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [activeWorkout, setActiveWorkout] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    setActiveWorkout(getStoredActiveWorkout());
    setProfile(getStoredProfile());
  }, [pathname]);

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#08080a] border-r border-[#26262b] h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#26262b]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ee4d00] to-[#ff5500] p-[2px] shadow-md shadow-[#ee4d00]/30">
            <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Flame className="w-5 h-5 text-[#ee4d00] group-hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wider text-[#ffffff] flex items-center gap-1.5 uppercase font-sans">
              GYM<span className="text-[#ee4d00]">X</span> <span className="text-xs px-1.5 py-0.5 rounded bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/40 font-mono font-bold">12W</span>
            </h1>
            <p className="text-[11px] text-[#9ca3af] font-semibold tracking-wider uppercase">Transformation Hub</p>
          </div>
        </Link>
      </div>

      {/* Active Workout Resume Card (if in progress) */}
      {activeWorkout && !activeWorkout.completed && (
        <div className="px-4 pt-4">
          <Link
            href="/workout/active"
            className="flex items-center justify-between p-3 rounded-xl bg-[#ee4d00]/15 border border-[#ee4d00]/40 hover:border-[#ee4d00] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d00] animate-ping" />
              <div>
                <p className="text-xs font-black text-[#ee4d00] uppercase tracking-wider">Workout In Progress</p>
                <p className="text-xs font-bold text-white truncate max-w-[130px]">{activeWorkout.title || "Active Session"}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ee4d00] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Tracking &amp; Tools</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#ee4d00]/20 text-[#ffffff] border border-[#ee4d00]/50 shadow-sm shadow-[#ee4d00]/20 font-bold"
                  : "text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#111114]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#ee4d00]" : "text-[#9ca3af]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Mini Card */}
      <div className="p-4 border-t border-[#26262b]">
        <Link
          href="/settings"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#111114] border border-[#26262b] hover:border-[#ee4d00]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ee4d00] to-[#ff5500] flex items-center justify-center font-black text-white text-sm">
              {profile?.name ? profile.name[0] : "H"}
            </div>
            <div>
              <p className="text-xs font-bold text-[#ffffff]">{profile?.name || "Hussain"}</p>
              <p className="text-[11px] text-[#ee4d00] font-mono font-bold">
                {profile?.currentWeightKg || "79.8"} kg <span className="text-[#9ca3af]">/ 70 kg</span>
              </p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-[#9ca3af] hover:text-white" />
        </Link>
      </div>
    </aside>
  );
};
