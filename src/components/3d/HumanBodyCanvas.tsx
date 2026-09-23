"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { MuscleGroup } from "@/types";
import { MuscleMannequin } from "./MuscleMannequin";
import { RotateCw, Eye, Sparkles, RefreshCw } from "lucide-react";

interface HumanBodyCanvasProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
  height?: string;
  showControls?: boolean;
}

export const HumanBodyCanvas: React.FC<HumanBodyCanvasProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  onSelectMuscle,
  height = "h-[420px]",
  showControls = true,
}) => {
  const controlsRef = useRef<any>(null);
  const [cameraView, setCameraView] = useState<"front" | "back">("front");

  const setView = (view: "front" | "back") => {
    setCameraView(view);
    if (controlsRef.current) {
      if (view === "front") {
        controlsRef.current.object.position.set(0, 0.8, 4.2);
        controlsRef.current.target.set(0, 0.8, 0);
      } else {
        controlsRef.current.object.position.set(0, 0.8, -4.2);
        controlsRef.current.target.set(0, 0.8, 0);
      }
      controlsRef.current.update();
    }
  };

  const resetCamera = () => {
    setView("front");
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#070A0F] border border-[#1E293B]`}>
      {/* 3D Canvas */}
      <Canvas className="w-full h-full cursor-grab active:cursor-grabbing">
        <PerspectiveCamera makeDefault position={[0, 0.8, 4.2]} fov={45} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 4, -5]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[0, 2, 2]} intensity={0.9} color="#00F59B" />
        <pointLight position={[0, 1, -2]} intensity={0.7} color="#38BDF8" />

        <Suspense fallback={null}>
          <MuscleMannequin
            primaryMuscle={primaryMuscle}
            secondaryMuscles={secondaryMuscles}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={onSelectMuscle}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#121826]/80 backdrop-blur-md p-1 rounded-xl border border-white/10 z-10">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              cameraView === "front"
                ? "bg-brand-emerald text-black shadow-glow-emerald"
                : "text-surface-400 hover:text-white"
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setView("back")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              cameraView === "back"
                ? "bg-brand-emerald text-black shadow-glow-emerald"
                : "text-surface-400 hover:text-white"
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={resetCamera}
            title="Reset Camera"
            className="p-1.5 text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 bg-[#121826]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
        {primaryMuscle && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-[0_0_8px_#00F59B]" />
            <span className="text-surface-200 font-medium capitalize">
              Primary: <strong className="text-brand-emerald">{primaryMuscle.replace("_", " ")}</strong>
            </span>
          </div>
        )}
        {secondaryMuscles.length > 0 && (
          <div className="flex items-center gap-1.5 pl-1 border-l border-surface-700">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
            <span className="text-surface-300 font-medium">
              Secondary: {secondaryMuscles.map((m) => m.replace("_", " ")).join(", ")}
            </span>
          </div>
        )}
        {!primaryMuscle && (
          <div className="flex items-center gap-1.5 text-surface-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Interactive 3D · Drag to Rotate & Zoom</span>
          </div>
        )}
      </div>
    </div>
  );
};
