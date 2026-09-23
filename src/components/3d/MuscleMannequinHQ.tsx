"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MuscleGroup } from "@/types";

export type ChestSubHead = "all" | "upper" | "mid" | "lower";

export interface MuscleMannequinHQProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  chestSubHead?: ChestSubHead;
  onSelectMuscle?: (muscle: MuscleGroup, subHead?: ChestSubHead) => void;
  visualMode?: "solid" | "hologram" | "striation" | "pump";
  accentColor?: string;
  isPumping?: boolean;
}

export const MuscleMannequinHQ: React.FC<MuscleMannequinHQProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  chestSubHead = "all",
  onSelectMuscle,
  visualMode = "solid",
  accentColor = "#ee4d00", // Google Stitch Electric Cyan
  isPumping = true,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const activeMeshesRef = useRef<THREE.Mesh[]>([]);

  // Smooth floating and contraction pump animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      // Gentle breathing idle
      rootRef.current.position.y = Math.sin(t * 1.6) * 0.025;
    }

    // Dynamic emissive pulsing on highlighted muscles
    const pulseFactor = isPumping ? (Math.sin(t * 3.8) * 0.35 + 0.65) : 0.85;

    activeMeshesRef.current.forEach((mesh) => {
      if (mesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = pulseFactor * (visualMode === "hologram" ? 1.4 : 0.9);
        }
      }
    });
  });

  const getStatus = (muscleName: MuscleGroup, subHeadName?: ChestSubHead) => {
    const isSelected = selectedMuscle === muscleName;
    const isPrimary = primaryMuscle === muscleName;
    const isSecondary = secondaryMuscles.includes(muscleName);

    if (muscleName === "chest" && subHeadName && chestSubHead !== "all") {
      const isSubHeadActive = chestSubHead === subHeadName;
      if (isSelected || isPrimary) {
        return isSubHeadActive ? "primary" : "secondary";
      }
    }

    if (isSelected || isPrimary) return "primary";
    if (isSecondary) return "secondary";
    return "inactive";
  };

  const registerActiveMesh = (el: THREE.Mesh | null, isActive: boolean) => {
    if (!el) return;
    if (isActive) {
      if (!activeMeshesRef.current.includes(el)) {
        activeMeshesRef.current.push(el);
      }
    } else {
      activeMeshesRef.current = activeMeshesRef.current.filter((m) => m !== el);
    }
  };

  // Materials based on Google Stitch visual mode and activation
  const getMaterial = (status: "primary" | "secondary" | "inactive") => {
    const isWireframe = visualMode === "striation";
    const isHolo = visualMode === "hologram";

    if (status === "primary") {
      return (
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isHolo ? 1.25 : 0.9}
          roughness={0.15}
          metalness={0.4}
          wireframe={isWireframe}
          transparent={isHolo}
          opacity={isHolo ? 0.9 : 1.0}
        />
      );
    }

    if (status === "secondary") {
      return (
        <meshStandardMaterial
          color="#ee4d00"
          emissive="#ee4d00"
          emissiveIntensity={0.65}
          roughness={0.25}
          metalness={0.4}
          wireframe={isWireframe}
          transparent={isHolo}
          opacity={isHolo ? 0.8 : 0.95}
        />
      );
    }

    // Inactive chassis - Google Stitch Midnight Slate / Cosmic Navy
    return (
      <meshStandardMaterial
        color={isHolo ? "#08080a" : "#111114"}
        roughness={0.3}
        metalness={0.85}
        wireframe={isWireframe}
        transparent={isHolo}
        opacity={isHolo ? 0.45 : 0.95}
      />
    );
  };

  const handlePointerDown = (e: any, muscle: MuscleGroup, subHead?: ChestSubHead) => {
    e.stopPropagation();
    if (onSelectMuscle) onSelectMuscle(muscle, subHead);
  };

  return (
    <group ref={rootRef} position={[0, -0.22, 0]}>
      {/* ========================================================================= */}
      {/* HEAD, JAW & STERNOCLEIDOMASTOID NECK */}
      {/* ========================================================================= */}
      {/* Cranium / Head */}
      <mesh position={[0, 2.36, 0]}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Sleek Athletic Jawline */}
      <mesh position={[0, 2.22, 0.08]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.21, 0.16, 0.19]} />
        <meshStandardMaterial color="#141D2D" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Neck Core */}
      <mesh position={[0, 2.02, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.22, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Left Sternocleidomastoid */}
      <mesh position={[-0.08, 2.03, 0.06]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.035, 0.16, 12, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Right Sternocleidomastoid */}
      <mesh position={[0.08, 2.03, 0.06]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.035, 0.16, 12, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ========================================================================= */}
      {/* TRAPEZIUS (COWL & UPPER SPINE) */}
      {/* ========================================================================= */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("traps") !== "inactive")}
        position={[0, 1.9, -0.05]}
        onPointerDown={(e) => handlePointerDown(e, "traps")}
      >
        <cylinderGeometry args={[0.25, 0.48, 0.24, 6]} />
        {getMaterial(getStatus("traps"))}
      </mesh>

      {/* ========================================================================= */}
      {/* CHEST (PECTORALIS MAJOR) - UPPER / MID / LOWER SEGMENTS */}
      {/* ========================================================================= */}
      {/* Left Upper Chest (Clavicular Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "upper") !== "inactive")}
        position={[-0.21, 1.76, 0.16]}
        rotation={[0.18, -0.12, -0.06]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "upper")}
      >
        <boxGeometry args={[0.34, 0.13, 0.18]} />
        {getMaterial(getStatus("chest", "upper"))}
      </mesh>
      {/* Right Upper Chest (Clavicular Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "upper") !== "inactive")}
        position={[0.21, 1.76, 0.16]}
        rotation={[0.18, 0.12, 0.06]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "upper")}
      >
        <boxGeometry args={[0.34, 0.13, 0.18]} />
        {getMaterial(getStatus("chest", "upper"))}
      </mesh>

      {/* Left Mid Chest (Sternal Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "mid") !== "inactive")}
        position={[-0.23, 1.62, 0.18]}
        rotation={[0.08, -0.1, 0]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "mid")}
      >
        <boxGeometry args={[0.35, 0.14, 0.19]} />
        {getMaterial(getStatus("chest", "mid"))}
      </mesh>
      {/* Right Mid Chest (Sternal Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "mid") !== "inactive")}
        position={[0.23, 1.62, 0.18]}
        rotation={[0.08, 0.1, 0]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "mid")}
      >
        <boxGeometry args={[0.35, 0.14, 0.19]} />
        {getMaterial(getStatus("chest", "mid"))}
      </mesh>

      {/* Left Lower Chest (Costal / Abdominal Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "lower") !== "inactive")}
        position={[-0.22, 1.48, 0.16]}
        rotation={[-0.04, -0.08, 0.05]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "lower")}
      >
        <boxGeometry args={[0.33, 0.12, 0.17]} />
        {getMaterial(getStatus("chest", "lower"))}
      </mesh>
      {/* Right Lower Chest (Costal / Abdominal Head) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("chest", "lower") !== "inactive")}
        position={[0.22, 1.48, 0.16]}
        rotation={[-0.04, 0.08, -0.05]}
        onPointerDown={(e) => handlePointerDown(e, "chest", "lower")}
      >
        <boxGeometry args={[0.33, 0.12, 0.17]} />
        {getMaterial(getStatus("chest", "lower"))}
      </mesh>

      {/* Sternal Center Groove (Divider) */}
      <mesh position={[0, 1.62, 0.18]}>
        <boxGeometry args={[0.045, 0.38, 0.16]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.6} metalness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* SHOULDERS (DELTOIDS: ANTERIOR, LATERAL, POSTERIOR) */}
      {/* ========================================================================= */}
      {/* Left Front Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("front_delts") !== "inactive")}
        position={[-0.51, 1.76, 0.09]}
        onPointerDown={(e) => handlePointerDown(e, "front_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMaterial(getStatus("front_delts"))}
      </mesh>
      {/* Right Front Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("front_delts") !== "inactive")}
        position={[0.51, 1.76, 0.09]}
        onPointerDown={(e) => handlePointerDown(e, "front_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMaterial(getStatus("front_delts"))}
      </mesh>

      {/* Left Lateral / Side Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("side_delts") !== "inactive")}
        position={[-0.58, 1.76, -0.02]}
        onPointerDown={(e) => handlePointerDown(e, "side_delts")}
      >
        <sphereGeometry args={[0.165, 24, 24]} />
        {getMaterial(getStatus("side_delts"))}
      </mesh>
      {/* Right Lateral / Side Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("side_delts") !== "inactive")}
        position={[0.58, 1.76, -0.02]}
        onPointerDown={(e) => handlePointerDown(e, "side_delts")}
      >
        <sphereGeometry args={[0.165, 24, 24]} />
        {getMaterial(getStatus("side_delts"))}
      </mesh>

      {/* Left Rear Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("rear_delts") !== "inactive")}
        position={[-0.5, 1.76, -0.13]}
        onPointerDown={(e) => handlePointerDown(e, "rear_delts")}
      >
        <sphereGeometry args={[0.155, 24, 24]} />
        {getMaterial(getStatus("rear_delts"))}
      </mesh>
      {/* Right Rear Delt */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("rear_delts") !== "inactive")}
        position={[0.5, 1.76, -0.13]}
        onPointerDown={(e) => handlePointerDown(e, "rear_delts")}
      >
        <sphereGeometry args={[0.155, 24, 24]} />
        {getMaterial(getStatus("rear_delts"))}
      </mesh>

      {/* ========================================================================= */}
      {/* ARMS: BICEPS & TRICEPS HORSESHOE */}
      {/* ========================================================================= */}
      {/* Left Biceps Peak */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("biceps") !== "inactive")}
        position={[-0.56, 1.34, 0.07]}
        rotation={[0.08, 0, -0.06]}
        onPointerDown={(e) => handlePointerDown(e, "biceps")}
      >
        <capsuleGeometry args={[0.125, 0.28, 16, 24]} />
        {getMaterial(getStatus("biceps"))}
      </mesh>
      {/* Right Biceps Peak */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("biceps") !== "inactive")}
        position={[0.56, 1.34, 0.07]}
        rotation={[0.08, 0, 0.06]}
        onPointerDown={(e) => handlePointerDown(e, "biceps")}
      >
        <capsuleGeometry args={[0.125, 0.28, 16, 24]} />
        {getMaterial(getStatus("biceps"))}
      </mesh>

      {/* Left Triceps Horseshoe */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("triceps") !== "inactive")}
        position={[-0.56, 1.34, -0.09]}
        rotation={[-0.06, 0, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "triceps")}
      >
        <capsuleGeometry args={[0.135, 0.3, 16, 24]} />
        {getMaterial(getStatus("triceps"))}
      </mesh>
      {/* Right Triceps Horseshoe */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("triceps") !== "inactive")}
        position={[0.56, 1.34, -0.09]}
        rotation={[-0.06, 0, 0.04]}
        onPointerDown={(e) => handlePointerDown(e, "triceps")}
      >
        <capsuleGeometry args={[0.135, 0.3, 16, 24]} />
        {getMaterial(getStatus("triceps"))}
      </mesh>

      {/* Left Forearms (Brachioradialis / Flexors) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("forearms") !== "inactive")}
        position={[-0.62, 0.86, 0.02]}
        rotation={[0, 0, -0.16]}
        onPointerDown={(e) => handlePointerDown(e, "forearms")}
      >
        <cylinderGeometry args={[0.095, 0.068, 0.46, 24]} />
        {getMaterial(getStatus("forearms"))}
      </mesh>
      {/* Right Forearms */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("forearms") !== "inactive")}
        position={[0.62, 0.86, 0.02]}
        rotation={[0, 0, 0.16]}
        onPointerDown={(e) => handlePointerDown(e, "forearms")}
      >
        <cylinderGeometry args={[0.095, 0.068, 0.46, 24]} />
        {getMaterial(getStatus("forearms"))}
      </mesh>

      {/* ========================================================================= */}
      {/* BACK: LATS, UPPER BACK & LOWER BACK (SPINAL ERECTORS) */}
      {/* ========================================================================= */}
      {/* Left Latissimus Dorsi V-Taper Wing */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("lats") !== "inactive")}
        position={[-0.34, 1.46, -0.11]}
        rotation={[0, 0.18, -0.12]}
        onPointerDown={(e) => handlePointerDown(e, "lats")}
      >
        <boxGeometry args={[0.26, 0.52, 0.22]} />
        {getMaterial(getStatus("lats"))}
      </mesh>
      {/* Right Latissimus Dorsi V-Taper Wing */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("lats") !== "inactive")}
        position={[0.34, 1.46, -0.11]}
        rotation={[0, -0.18, 0.12]}
        onPointerDown={(e) => handlePointerDown(e, "lats")}
      >
        <boxGeometry args={[0.26, 0.52, 0.22]} />
        {getMaterial(getStatus("lats"))}
      </mesh>

      {/* Upper Back / Rhomboids Plate */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("upper_back") !== "inactive")}
        position={[0, 1.56, -0.16]}
        onPointerDown={(e) => handlePointerDown(e, "upper_back")}
      >
        <boxGeometry args={[0.42, 0.38, 0.16]} />
        {getMaterial(getStatus("upper_back"))}
      </mesh>

      {/* Lower Back / Spinal Erectors */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("lower_back") !== "inactive")}
        position={[0, 1.08, -0.13]}
        onPointerDown={(e) => handlePointerDown(e, "lower_back")}
      >
        <boxGeometry args={[0.38, 0.38, 0.16]} />
        {getMaterial(getStatus("lower_back"))}
      </mesh>

      {/* ========================================================================= */}
      {/* CORE: 6-PACK RECTUS ABDOMINIS, OBLIQUES & SERRATUS */}
      {/* ========================================================================= */}
      {/* Upper 2-Pack Abs */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("abs") !== "inactive")}
        position={[0, 1.34, 0.13]}
        onPointerDown={(e) => handlePointerDown(e, "abs")}
      >
        <boxGeometry args={[0.34, 0.13, 0.16]} />
        {getMaterial(getStatus("abs"))}
      </mesh>
      {/* Middle 2-Pack Abs */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("abs") !== "inactive")}
        position={[0, 1.19, 0.13]}
        onPointerDown={(e) => handlePointerDown(e, "abs")}
      >
        <boxGeometry args={[0.33, 0.13, 0.16]} />
        {getMaterial(getStatus("abs"))}
      </mesh>
      {/* Lower 2-Pack Abs */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("abs") !== "inactive")}
        position={[0, 1.04, 0.12]}
        onPointerDown={(e) => handlePointerDown(e, "abs")}
      >
        <boxGeometry args={[0.32, 0.13, 0.15]} />
        {getMaterial(getStatus("abs"))}
      </mesh>

      {/* Left External Oblique & Serratus */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("obliques") !== "inactive")}
        position={[-0.26, 1.15, 0.08]}
        rotation={[0, 0, -0.06]}
        onPointerDown={(e) => handlePointerDown(e, "obliques")}
      >
        <boxGeometry args={[0.18, 0.44, 0.2]} />
        {getMaterial(getStatus("obliques"))}
      </mesh>
      {/* Right External Oblique & Serratus */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("obliques") !== "inactive")}
        position={[0.26, 1.15, 0.08]}
        rotation={[0, 0, 0.06]}
        onPointerDown={(e) => handlePointerDown(e, "obliques")}
      >
        <boxGeometry args={[0.18, 0.44, 0.2]} />
        {getMaterial(getStatus("obliques"))}
      </mesh>

      {/* Pelvis Core Chassis */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.34, 0.31, 0.26, 24]} />
        <meshStandardMaterial color="#111927" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* ========================================================================= */}
      {/* LOWER BODY: GLUTES, QUADS TEARDROPS, HAMS & CALVES */}
      {/* ========================================================================= */}
      {/* Left Gluteus */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("glutes") !== "inactive")}
        position={[-0.2, 0.72, -0.15]}
        onPointerDown={(e) => handlePointerDown(e, "glutes")}
      >
        <sphereGeometry args={[0.23, 24, 24]} />
        {getMaterial(getStatus("glutes"))}
      </mesh>
      {/* Right Gluteus */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("glutes") !== "inactive")}
        position={[0.2, 0.72, -0.15]}
        onPointerDown={(e) => handlePointerDown(e, "glutes")}
      >
        <sphereGeometry args={[0.23, 24, 24]} />
        {getMaterial(getStatus("glutes"))}
      </mesh>

      {/* Left Quadriceps (Rectus Femoris + Vastus Lateralis + Teardrop) */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("quads") !== "inactive")}
        position={[-0.22, 0.22, 0.08]}
        rotation={[0.07, 0, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "quads")}
      >
        <capsuleGeometry args={[0.18, 0.54, 16, 24]} />
        {getMaterial(getStatus("quads"))}
      </mesh>
      {/* Right Quadriceps */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("quads") !== "inactive")}
        position={[0.22, 0.22, 0.08]}
        rotation={[0.07, 0, 0.04]}
        onPointerDown={(e) => handlePointerDown(e, "quads")}
      >
        <capsuleGeometry args={[0.18, 0.54, 16, 24]} />
        {getMaterial(getStatus("quads"))}
      </mesh>

      {/* Left Hamstrings */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("hamstrings") !== "inactive")}
        position={[-0.22, 0.22, -0.11]}
        rotation={[-0.07, 0, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "hamstrings")}
      >
        <capsuleGeometry args={[0.17, 0.5, 16, 24]} />
        {getMaterial(getStatus("hamstrings"))}
      </mesh>
      {/* Right Hamstrings */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("hamstrings") !== "inactive")}
        position={[0.22, 0.22, -0.11]}
        rotation={[-0.07, 0, 0.04]}
        onPointerDown={(e) => handlePointerDown(e, "hamstrings")}
      >
        <capsuleGeometry args={[0.17, 0.5, 16, 24]} />
        {getMaterial(getStatus("hamstrings"))}
      </mesh>

      {/* Knees Joint Chassis */}
      <mesh position={[-0.22, -0.16, 0.04]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.22, -0.16, 0.04]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Left Gastrocnemius Calves */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("calves") !== "inactive")}
        position={[-0.22, -0.48, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "calves")}
      >
        <capsuleGeometry args={[0.14, 0.52, 16, 24]} />
        {getMaterial(getStatus("calves"))}
      </mesh>
      {/* Right Gastrocnemius Calves */}
      <mesh
        ref={(el) => registerActiveMesh(el, getStatus("calves") !== "inactive")}
        position={[0.22, -0.48, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "calves")}
      >
        <capsuleGeometry args={[0.14, 0.52, 16, 24]} />
        {getMaterial(getStatus("calves"))}
      </mesh>

      {/* Feet & Ankles */}
      <mesh position={[-0.22, -0.85, 0.06]}>
        <boxGeometry args={[0.14, 0.08, 0.28]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.22, -0.85, 0.06]}>
        <boxGeometry args={[0.14, 0.08, 0.28]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
};
