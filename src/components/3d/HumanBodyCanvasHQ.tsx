"use client";

import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { MuscleGroup } from "@/types";
import { StudioStage } from "./StudioStage";
import { RealisticHumanModel } from "./RealisticHumanModel";
import { ExerciseBiomechanicsAnimator } from "./ExerciseBiomechanicsAnimator";
import {
  RotateCw,
  RefreshCw,
  Zap,
  Play,
  Pause,
  Gauge,
} from "lucide-react";

export type CameraPreset = "front" | "back" | "side" | "chest" | "core" | "legs";

interface CameraControllerProps {
  preset: CameraPreset;
  autoRotate: boolean;
  controlsRef: React.RefObject<any>;
}

// Camera Lerp and Target Animator
const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  autoRotate,
  controlsRef,
}) => {
  const { camera } = useThree();

  const targetCoords = useMemo(() => {
    switch (preset) {
      case "back":
        return { pos: new THREE.Vector3(0, 0.85, -4.1), look: new THREE.Vector3(0, 0.85, 0) };
      case "side":
        return { pos: new THREE.Vector3(4.1, 0.85, 0.1), look: new THREE.Vector3(0, 0.85, 0) };
      case "chest":
        return { pos: new THREE.Vector3(0, 1.45, 2.15), look: new THREE.Vector3(0, 1.35, 0) };
      case "core":
        return { pos: new THREE.Vector3(0, 1.05, 1.95), look: new THREE.Vector3(0, 1.0, 0) };
      case "legs":
        return { pos: new THREE.Vector3(0, 0.05, 2.5), look: new THREE.Vector3(0, -0.05, 0) };
      case "front":
      default:
        return { pos: new THREE.Vector3(0, 0.85, 4.1), look: new THREE.Vector3(0, 0.85, 0) };
    }
  }, [preset]);

  useFrame((_, delta) => {
    if (!autoRotate && controlsRef.current) {
      camera.position.lerp(targetCoords.pos, delta * 3.5);
      controlsRef.current.target.lerp(targetCoords.look, delta * 3.5);
      controlsRef.current.update();
    }
  });

  return null;
};

export interface HumanBodyCanvasHQProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  chestSubHead?: string;
  onSelectMuscle?: (muscle: MuscleGroup, subHead?: any) => void;
  exerciseId?: string; // If provided, runs live biomechanical exercise animation
  height?: string;
  showControls?: boolean;
  enableAutoRotate?: boolean;
  initialPreset?: CameraPreset;
}

export const HumanBodyCanvasHQ: React.FC<HumanBodyCanvasHQProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  chestSubHead = "all",
  onSelectMuscle,
  exerciseId,
  height = "h-[480px]",
  showControls = true,
  enableAutoRotate = false,
  initialPreset = "front",
}) => {
  const controlsRef = useRef<any>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>(initialPreset);
  const [isAutoRotating, setIsAutoRotating] = useState(enableAutoRotate);
  // Exact GYM X Sampled Color: #ee4d00 (Fiery Orange)
  const accentColor = "#ee4d00";
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleSetPreset = (p: CameraPreset) => {
    setIsAutoRotating(false);
    setCameraPreset(p);
  };

  const handleResetCamera = () => {
    setIsAutoRotating(false);
    setCameraPreset("front");
  };

  const cycleSpeed = () => {
    if (playbackSpeed === 1.0) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(0.6);
    else setPlaybackSpeed(1.0);
  };

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden bg-gradient-to-b from-[#08080a] via-[#0d0d11] to-[#040406] border border-[#26262b] shadow-2xl select-none group`}
    >
      {/* Background Radial Fiery GYM X Aura */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, #ee4d00 0%, transparent 65%)`,
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.85, 4.1]} fov={42} />

        {/* Studio Cinematic Dramatic Lighting Rig with Volcanic Embers */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#ee4d00" />
        <directionalLight position={[0, 4, -4.5]} intensity={1.6} color="#ff5500" />
        <pointLight position={[0, -0.6, 0]} intensity={1.5} color="#ee4d00" distance={3.8} />
        <pointLight position={[0, 1.6, 2.5]} intensity={0.9} color="#ffffff" distance={4} />

        <Suspense fallback={null}>
          {/* Cyber Stage Pedestal & Particles */}
          <StudioStage color="#ee4d00" enableParticles={true} />

          {/* If exerciseId provided, render realistic exercise execution animation; else realistic anatomical human model */}
          {exerciseId ? (
            <ExerciseBiomechanicsAnimator
              exerciseId={exerciseId}
              playbackSpeed={playbackSpeed}
              isPlaying={isPlaying}
            />
          ) : (
            <RealisticHumanModel
              activeMuscle={selectedMuscle || primaryMuscle || "chest"}
              isContractionActive={isPlaying}
            />
          )}
        </Suspense>

        {/* Orbit Controls with Damped 360 Navigation */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          panSpeed={0.6}
          minDistance={1.6}
          maxDistance={6.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.7}
          dampingFactor={0.06}
          autoRotate={isAutoRotating}
          autoRotateSpeed={1.8}
        />

        {/* Smooth Camera Animator */}
        <CameraController
          preset={cameraPreset}
          autoRotate={isAutoRotating}
          controlsRef={controlsRef}
        />
      </Canvas>

      {/* ========================================================================= */}
      {/* TOP BAR CONTROLS (Camera Angles & 360 Auto-Turntable) */}
      {/* ========================================================================= */}
      {showControls && (
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10 gap-2">
          {/* 360° Turntable Button */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`pointer-events-auto px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md ${
              isAutoRotating
                ? "bg-[#ee4d00] text-white border-[#ee4d00] shadow-[0_0_15px_rgba(238,77,0,0.4)]"
                : "bg-[#111114]/90 text-[#9ca3af] border-[#26262b] hover:text-white hover:bg-[#18181d]"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? "animate-spin" : ""}`} />
            <span>360° {isAutoRotating ? "Spinning" : "Orbit"}</span>
          </button>

          {/* Camera Angles Segmented Control */}
          <div className="pointer-events-auto flex items-center gap-1 bg-[#111114]/95 backdrop-blur-xl p-1 rounded-xl border border-[#26262b] shadow-lg">
            {(
              [
                { id: "front", label: "Front" },
                { id: "back", label: "Back" },
                { id: "side", label: "Side" },
                { id: "chest", label: "Chest Zoom" },
                { id: "core", label: "Core" },
                { id: "legs", label: "Legs" },
              ] as { id: CameraPreset; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSetPreset(item.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  cameraPreset === item.id && !isAutoRotating
                    ? "bg-[#ee4d00] text-white shadow-[0_0_12px_rgba(238,77,0,0.35)]"
                    : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset View"
              className="p-1.5 text-[#9ca3af] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM LEFT: ACTIVE MUSCLE / EXERCISE STATUS */}
      {/* ========================================================================= */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2.5 bg-[#111114]/95 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-[#26262b] text-xs shadow-xl">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: accentColor }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider">
              {exerciseId ? "3D Execution Biomechanics" : primaryMuscle ? "Primary Target" : "Interactive Anatomy"}
            </span>
            <span className="text-[#ffffff] font-extrabold capitalize leading-none">
              {(exerciseId || selectedMuscle || primaryMuscle || "Drag to Rotate 360°").replace(/_/g, " ")}
              {selectedMuscle === "chest" && chestSubHead !== "all" && (
                <span className="text-[#ee4d00] text-[10px] font-mono ml-1.5 uppercase">
                  ({chestSubHead} head)
                </span>
              )}
            </span>
          </div>

          {/* Animation Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title="Toggle Exercise Animation Loop"
            className={`ml-2 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all flex items-center gap-1 border ${
              isPlaying
                ? "bg-[#ee4d00]/20 text-[#ee4d00] border-[#ee4d00]/40 shadow-[0_0_12px_rgba(238,77,0,0.3)]"
                : "bg-[#18181d] text-[#9ca3af] border-white/5"
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-[#ee4d00]" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? "ACTIVE" : "PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM RIGHT: SPEED & REPETITION RATE */}
      {/* ========================================================================= */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#111114]/95 backdrop-blur-xl p-1.5 rounded-xl border border-[#26262b] z-10 shadow-xl">
        <button
          type="button"
          onClick={cycleSpeed}
          title="Change Rep Tempo Speed"
          className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg transition-all bg-[#18181d] text-[#ffffff] hover:text-[#ee4d00] flex items-center gap-1 border border-[#26262b]"
        >
          <Gauge className="w-3.5 h-3.5 text-[#ee4d00]" />
          <span>{playbackSpeed}x SPEED</span>
        </button>

        <div className="px-2.5 py-1 rounded-lg bg-[#ee4d00]/15 border border-[#ee4d00]/30 text-[10px] font-extrabold text-[#ee4d00] tracking-wider uppercase">
          FIBER GLOW: #EE4D00
        </div>
      </div>
    </div>
  );
};
