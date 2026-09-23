"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { allExercises } from "@/lib/seedData";
import { Search, Filter, Layers, ChevronRight, Sparkles, Dumbbell, Zap } from "lucide-react";
import { MuscleGroup } from "@/types";

export default function ExerciseLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];

  const HQ_GIF_EXERCISES = [
    "bench_press",
    "incline_db_press",
    "machine_chest_press",
    "cable_chest_fly",
    "db_lateral_raise",
    "seated_db_shoulder_press",
    "cable_triceps_pushdown",
    "overhead_cable_triceps_ext",
  ];

  const filtered = allExercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_12px_rgba(238,77,0,0.2)] flex items-center gap-1.5">
              ⚡ GYM X ENCYCLOPEDIA
            </span>
            <span className="text-xs text-neutral-400 font-semibold font-mono">{allExercises.length} Movements</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mt-2">
            Exercise Encyclopedia
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Interactive 3D muscle anatomy, HQ biomechanics execution loops, form cues &amp; progressive overload targets.
          </p>
        </div>

        <Link
          href="/muscle-map"
          className="px-6 py-3 rounded-full bg-[#111114] hover:bg-[#1a1a20] text-[#ee4d00] font-bold text-xs border border-[#26262b] hover:border-[#ee4d00]/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#ee4d00]" />
          <span>Open 3D Muscle Map</span>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by exercise name, muscle (e.g. chest, lats) or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#111114] border border-[#26262b] rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ee4d00] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.35)]"
                  : "bg-[#111114] text-neutral-400 hover:text-white border border-[#26262b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ex) => {
          const hasGif = HQ_GIF_EXERCISES.includes(ex.id);
          const gifPath = `/exercises/${ex.id}.gif`;

          return (
            <Link
              key={ex.id}
              href={`/exercises/${ex.id}`}
              className="rounded-3xl bg-[#111114] border border-[#26262b] hover:border-[#ee4d00]/60 transition-all flex flex-col justify-between group overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(238,77,0,0.2)]"
            >
              {/* HQ GIF Header (if available) */}
              {hasGif ? (
                <div className="relative w-full h-44 bg-[#08080a] overflow-hidden">
                  <Image
                    src={gifPath}
                    alt={ex.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-black/20" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ee4d00]/90 text-white flex items-center gap-1 shadow-sm">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                      <span>HQ LOOP</span>
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#08080a] text-neutral-300 border border-[#26262b]">
                    {ex.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#ee4d00] font-bold">
                    {ex.equipment}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white group-hover:text-[#ee4d00] transition-colors">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-neutral-400 capitalize mt-0.5">
                    Primary: <strong className="text-[#ee4d00]">{ex.primaryMuscle.replace("_", " ")}</strong>
                  </p>
                </div>

                {ex.secondaryMuscles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ex.secondaryMuscles.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md bg-[#08080a] text-[10px] font-medium text-neutral-400 capitalize border border-[#26262b]"
                      >
                        {m.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-5 py-3.5 bg-[#08080a] border-t border-[#26262b] flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">
                  {ex.defaultSets} sets &times; {ex.repRange}
                </span>
                <span className="font-bold text-[#ee4d00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View 3D Execution</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
