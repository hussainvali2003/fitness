"use client";

import React, { useState } from "react";
import { MuscleGroup } from "@/types";

interface FallbackBody2DProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
  weeklySetsMap?: Record<MuscleGroup, number>;
}

export const FallbackBody2D: React.FC<FallbackBody2DProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  onSelectMuscle,
  weeklySetsMap = {},
}) => {
  const [activeView, setActiveView] = useState<"front" | "back">("front");

  const getMuscleColor = (muscle: MuscleGroup) => {
    if (selectedMuscle === muscle || primaryMuscle === muscle) {
      return "fill-brand-emerald stroke-brand-emerald filter drop-shadow-[0_0_8px_#00F59B]";
    }
    if (secondaryMuscles.includes(muscle)) {
      return "fill-brand-cyan stroke-brand-cyan filter drop-shadow-[0_0_6px_#38BDF8]";
    }
    return "fill-surface-800 stroke-surface-700 hover:fill-surface-700 transition-colors";
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    if (onSelectMuscle) onSelectMuscle(muscle);
  };

  return (
    <div className="flex flex-col items-center bg-[#121826]/70 backdrop-blur-md rounded-2xl p-4 border border-surface-800 w-full max-w-md mx-auto">
      {/* Front / Back Toggle */}
      <div className="flex items-center gap-2 mb-4 bg-surface-900 p-1 rounded-xl border border-surface-800">
        <button
          type="button"
          onClick={() => setActiveView("front")}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeView === "front"
              ? "bg-brand-emerald text-black shadow-glow-emerald"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Anterior (Front)
        </button>
        <button
          type="button"
          onClick={() => setActiveView("back")}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeView === "back"
              ? "bg-brand-emerald text-black shadow-glow-emerald"
              : "text-surface-400 hover:text-white"
          }`}
        >
          Posterior (Back)
        </button>
      </div>

      {/* 2D Anatomical Map SVG */}
      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg viewBox="0 0 200 320" className="w-full h-full cursor-pointer select-none">
          {/* Head & Neck */}
          <circle cx="100" cy="24" r="18" className="fill-surface-800 stroke-surface-700 stroke-1" />
          <path d="M 94 42 L 106 42 L 108 52 L 92 52 Z" className="fill-surface-800 stroke-surface-700 stroke-1" />

          {activeView === "front" ? (
            // FRONT VIEW
            <g className="transition-all duration-200">
              {/* Chest / Pectorals */}
              <path
                d="M 68 62 C 80 58, 96 58, 98 78 C 98 90, 85 92, 68 86 C 64 76, 64 68, 68 62 Z"
                className={`${getMuscleColor("chest")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("chest")}
              />
              <path
                d="M 132 62 C 120 58, 104 58, 102 78 C 102 90, 115 92, 132 86 C 136 76, 136 68, 132 62 Z"
                className={`${getMuscleColor("chest")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("chest")}
              />

              {/* Front Delts */}
              <circle
                cx="54"
                cy="64"
                r="12"
                className={`${getMuscleColor("front_delts")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("front_delts")}
              />
              <circle
                cx="146"
                cy="64"
                r="12"
                className={`${getMuscleColor("front_delts")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("front_delts")}
              />

              {/* Biceps */}
              <rect
                x="44"
                y="84"
                width="14"
                height="28"
                rx="6"
                className={`${getMuscleColor("biceps")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("biceps")}
              />
              <rect
                x="142"
                y="84"
                width="14"
                height="28"
                rx="6"
                className={`${getMuscleColor("biceps")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("biceps")}
              />

              {/* Forearms */}
              <path
                d="M 40 118 L 52 118 L 48 152 L 40 152 Z"
                className={`${getMuscleColor("forearms")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("forearms")}
              />
              <path
                d="M 148 118 L 160 118 L 160 152 L 152 152 Z"
                className={`${getMuscleColor("forearms")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("forearms")}
              />

              {/* Abdominals */}
              <rect
                x="84"
                y="94"
                width="32"
                height="46"
                rx="4"
                className={`${getMuscleColor("abs")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("abs")}
              />

              {/* Obliques */}
              <path
                d="M 70 94 L 82 94 L 80 136 L 72 132 Z"
                className={`${getMuscleColor("obliques")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("obliques")}
              />
              <path
                d="M 130 94 L 118 94 L 120 136 L 128 132 Z"
                className={`${getMuscleColor("obliques")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("obliques")}
              />

              {/* Quads (Front Thighs) */}
              <path
                d="M 72 150 L 96 150 L 94 216 L 76 216 Z"
                className={`${getMuscleColor("quads")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("quads")}
              />
              <path
                d="M 128 150 L 104 150 L 106 216 L 124 216 Z"
                className={`${getMuscleColor("quads")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("quads")}
              />

              {/* Calves (Front Shins) */}
              <path
                d="M 76 230 L 92 230 L 90 286 L 80 286 Z"
                className={`${getMuscleColor("calves")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("calves")}
              />
              <path
                d="M 124 230 L 108 230 L 110 286 L 120 286 Z"
                className={`${getMuscleColor("calves")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("calves")}
              />
            </g>
          ) : (
            // BACK VIEW
            <g className="transition-all duration-200">
              {/* Traps */}
              <polygon
                points="100,48 124,62 100,88 76,62"
                className={`${getMuscleColor("traps")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("traps")}
              />

              {/* Upper Back / Rhomboids */}
              <rect
                x="82"
                y="86"
                width="36"
                height="24"
                rx="4"
                className={`${getMuscleColor("upper_back")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("upper_back")}
              />

              {/* Latissimus Dorsi */}
              <path
                d="M 72 74 C 76 96, 78 120, 84 130 L 74 130 C 66 112, 64 88, 72 74 Z"
                className={`${getMuscleColor("lats")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("lats")}
              />
              <path
                d="M 128 74 C 124 96, 122 120, 116 130 L 126 130 C 134 112, 136 88, 128 74 Z"
                className={`${getMuscleColor("lats")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("lats")}
              />

              {/* Rear Delts */}
              <circle
                cx="54"
                cy="64"
                r="11"
                className={`${getMuscleColor("rear_delts")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("rear_delts")}
              />
              <circle
                cx="146"
                cy="64"
                r="11"
                className={`${getMuscleColor("rear_delts")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("rear_delts")}
              />

              {/* Triceps */}
              <rect
                x="44"
                y="84"
                width="14"
                height="28"
                rx="6"
                className={`${getMuscleColor("triceps")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("triceps")}
              />
              <rect
                x="142"
                y="84"
                width="14"
                height="28"
                rx="6"
                className={`${getMuscleColor("triceps")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("triceps")}
              />

              {/* Lower Back */}
              <rect
                x="86"
                y="114"
                width="28"
                height="22"
                rx="3"
                className={`${getMuscleColor("lower_back")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("lower_back")}
              />

              {/* Glutes */}
              <path
                d="M 72 142 C 76 138, 96 138, 98 160 C 98 174, 76 174, 72 142 Z"
                className={`${getMuscleColor("glutes")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("glutes")}
              />
              <path
                d="M 128 142 C 124 138, 104 138, 102 160 C 102 174, 124 174, 128 142 Z"
                className={`${getMuscleColor("glutes")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("glutes")}
              />

              {/* Hamstrings */}
              <path
                d="M 72 178 L 96 178 L 94 224 L 76 224 Z"
                className={`${getMuscleColor("hamstrings")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("hamstrings")}
              />
              <path
                d="M 128 178 L 104 178 L 106 224 L 124 224 Z"
                className={`${getMuscleColor("hamstrings")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("hamstrings")}
              />

              {/* Calves (Gastrocnemius) */}
              <path
                d="M 74 234 L 94 234 L 90 286 L 78 286 Z"
                className={`${getMuscleColor("calves")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("calves")}
              />
              <path
                d="M 126 234 L 106 234 L 110 286 L 122 286 Z"
                className={`${getMuscleColor("calves")} stroke-1 cursor-pointer`}
                onClick={() => handleMuscleClick("calves")}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Selected Muscle / Sets Info */}
      <div className="mt-3 text-center">
        {selectedMuscle ? (
          <p className="text-xs text-surface-200">
            Selected: <strong className="text-brand-emerald capitalize">{selectedMuscle.replace("_", " ")}</strong>
            {weeklySetsMap[selectedMuscle] !== undefined && (
              <span className="text-surface-400 ml-1.5">({weeklySetsMap[selectedMuscle]} weekly sets)</span>
            )}
          </p>
        ) : (
          <p className="text-xs text-surface-400">Tap any muscle group to inspect exercises and volume</p>
        )}
      </div>
    </div>
  );
};
