"use client";

import React, { useState } from "react";
import Link from "next/link";
import { allExercises } from "@/lib/seedData";
import { Search, Filter, Layers, ChevronRight, Sparkles, Dumbbell } from "lucide-react";
import { MuscleGroup } from "@/types";

export default function ExerciseLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];

  const filtered = allExercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Exercise Database
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">{allExercises.length} Movements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Exercise Encyclopedia
          </h1>
          <p className="text-xs text-surface-400">
            Interactive 3D muscle anatomy, execution cues, common pitfalls &amp; progressive overload targets.
          </p>
        </div>

        <Link
          href="/muscle-map"
          className="px-5 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-brand-emerald font-bold text-xs border border-surface-700 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Full 3D Muscle Map</span>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by exercise name, muscle (e.g. chest, lats) or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#121826] border border-surface-800 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-emerald transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-emerald text-black shadow-glow-emerald"
                  : "bg-surface-900 text-surface-400 hover:text-white border border-surface-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <Link
            key={ex.id}
            href={`/exercises/${ex.id}`}
            className="p-5 rounded-3xl bg-[#121826] border border-surface-800 hover:border-brand-emerald/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-glow-emerald/10"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-surface-900 text-surface-300 border border-surface-700">
                  {ex.category}
                </span>
                <span className="text-[10px] font-mono text-brand-cyan font-bold">
                  {ex.equipment}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-brand-emerald transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-surface-400 capitalize mt-0.5">
                  Primary: <strong className="text-brand-emerald">{ex.primaryMuscle.replace("_", " ")}</strong>
                </p>
              </div>

              {ex.secondaryMuscles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {ex.secondaryMuscles.map((m) => (
                    <span
                      key={m}
                      className="px-1.5 py-0.5 rounded bg-surface-900 text-[10px] font-medium text-surface-400 capitalize"
                    >
                      {m.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-surface-800/80 flex items-center justify-between text-xs">
              <span className="text-surface-400 font-mono">
                {ex.defaultSets} sets &times; {ex.repRange}
              </span>
              <span className="font-bold text-brand-emerald flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View 3D Model</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
