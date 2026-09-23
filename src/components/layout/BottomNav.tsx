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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F19]/90 backdrop-blur-lg border-t border-[#1B2336] px-3 py-2 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? "text-brand-emerald" : "text-surface-400 hover:text-surface-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-brand-emerald scale-110" : ""}`} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
