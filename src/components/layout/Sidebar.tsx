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
    <aside className="hidden lg:flex flex-col w-72 bg-[#0B0F19] border-r border-[#1B2336] h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#1B2336]/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-cyan p-[2px] shadow-glow-emerald">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Flame className="w-5 h-5 text-brand-emerald group-hover:text-black transition-colors" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              APEX FITNESS <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-mono">12W</span>
            </h1>
            <p className="text-xs text-surface-400 font-medium">Hussain&apos;s Personal Hub</p>
          </div>
        </Link>
      </div>

      {/* Active Workout Resume Card (if in progress) */}
      {activeWorkout && !activeWorkout.completed && (
        <div className="px-4 pt-4">
          <Link
            href="/workout/active"
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-emerald/15 to-brand-cyan/15 border border-brand-emerald/40 hover:border-brand-emerald transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-ping" />
              <div>
                <p className="text-xs font-bold text-brand-emerald uppercase tracking-wider">Workout In Progress</p>
                <p className="text-xs font-medium text-white truncate max-w-[130px]">{activeWorkout.title || "Active Session"}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-emerald group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-surface-500 uppercase tracking-wider mb-2">Tracking & Tools</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 shadow-sm"
                  : "text-surface-300 hover:text-white hover:bg-surface-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-emerald" : "text-surface-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Mini Card */}
      <div className="p-4 border-t border-[#1B2336]/60">
        <Link
          href="/settings"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#121826] border border-surface-800 hover:border-surface-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-emerald to-brand-cyan flex items-center justify-center font-bold text-black text-sm">
              {profile?.name ? profile.name[0] : "H"}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{profile?.name || "Hussain"}</p>
              <p className="text-[11px] text-brand-emerald font-mono">
                {profile?.currentWeightKg || "79.8"} kg <span className="text-surface-400">/ 70 kg</span>
              </p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-surface-400 hover:text-white" />
        </Link>
      </div>
    </aside>
  );
};
