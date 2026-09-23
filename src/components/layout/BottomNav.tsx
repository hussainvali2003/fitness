"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Scale, Sparkles } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Workout", href: "/workout", icon: Dumbbell },
    { label: "Nutrition", href: "/nutrition", icon: UtensilsCrossed },
    { label: "Body", href: "/body", icon: Scale },
    { label: "Muscle Map", href: "/muscle-map", icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08080a]/95 backdrop-blur-xl border-t border-[#26262b] px-3 py-2 flex items-center justify-around select-none shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? "text-[#ee4d00]" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-[#ee4d00] scale-110 drop-shadow-[0_0_8px_rgba(238,77,0,0.6)]" : ""}`} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
