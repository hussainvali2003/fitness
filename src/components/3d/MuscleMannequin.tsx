"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MuscleGroup } from "@/types";

interface MuscleMannequinProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
}

export const MuscleMannequin: React.FC<MuscleMannequinProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  onSelectMuscle,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating idle motion
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  const getMuscleMaterial = (muscleName: MuscleGroup) => {
    const isSelected = selectedMuscle === muscleName;
    const isPrimary = primaryMuscle === muscleName;
    const isSecondary = secondaryMuscles.includes(muscleName);

    if (isSelected || isPrimary) {
      return (
        <meshStandardMaterial
          color="#ee4d00"
          emissive="#ee4d00"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.4}
        />
      );
    }
    if (isSecondary) {
      return (
        <meshStandardMaterial
          color="#ee4d00"
          emissive="#ee4d00"
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.3}
        />
      );
    }
    return (
      <meshStandardMaterial
        color="#26262b"
        roughness={0.6}
        metalness={0.2}
        opacity={0.9}
        transparent
      />
    );
  };

  const handlePointerDown = (e: any, muscle: MuscleGroup) => {
    e.stopPropagation();
    if (onSelectMuscle) onSelectMuscle(muscle);
  };

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Head & Neck */}
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.22, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} />
      </mesh>

      {/* Trapezius */}
      <mesh
        position={[0, 1.82, -0.06]}
        onPointerDown={(e) => handlePointerDown(e, "traps")}
      >
        <boxGeometry args={[0.7, 0.16, 0.22]} />
        {getMuscleMaterial("traps")}
      </mesh>

      {/* Chest (Pectorals) */}
      <mesh
        position={[-0.22, 1.62, 0.16]}
        rotation={[0.1, -0.08, 0]}
        onPointerDown={(e) => handlePointerDown(e, "chest")}
      >
        <boxGeometry args={[0.34, 0.32, 0.22]} />
        {getMuscleMaterial("chest")}
      </mesh>
      <mesh
        position={[0.22, 1.62, 0.16]}
        rotation={[0.1, 0.08, 0]}
        onPointerDown={(e) => handlePointerDown(e, "chest")}
      >
        <boxGeometry args={[0.34, 0.32, 0.22]} />
        {getMuscleMaterial("chest")}
      </mesh>

      {/* Lats & Upper Back */}
      <mesh
        position={[-0.34, 1.48, -0.1]}
        rotation={[0, 0.15, -0.1]}
        onPointerDown={(e) => handlePointerDown(e, "lats")}
      >
        <boxGeometry args={[0.26, 0.45, 0.22]} />
        {getMuscleMaterial("lats")}
      </mesh>
      <mesh
        position={[0.34, 1.48, -0.1]}
        rotation={[0, -0.15, 0.1]}
        onPointerDown={(e) => handlePointerDown(e, "lats")}
      >
        <boxGeometry args={[0.26, 0.45, 0.22]} />
        {getMuscleMaterial("lats")}
      </mesh>
      <mesh
        position={[0, 1.55, -0.15]}
        onPointerDown={(e) => handlePointerDown(e, "upper_back")}
      >
        <boxGeometry args={[0.42, 0.35, 0.18]} />
        {getMuscleMaterial("upper_back")}
      </mesh>

      {/* Shoulders / Deltoids */}
      {/* Front Delts */}
      <mesh
        position={[-0.52, 1.74, 0.08]}
        onPointerDown={(e) => handlePointerDown(e, "front_delts")}
      >
        <sphereGeometry args={[0.17, 24, 24]} />
        {getMuscleMaterial("front_delts")}
      </mesh>
      <mesh
        position={[0.52, 1.74, 0.08]}
        onPointerDown={(e) => handlePointerDown(e, "front_delts")}
      >
        <sphereGeometry args={[0.17, 24, 24]} />
        {getMuscleMaterial("front_delts")}
      </mesh>

      {/* Side Delts */}
      <mesh
        position={[-0.58, 1.74, -0.02]}
        onPointerDown={(e) => handlePointerDown(e, "side_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMuscleMaterial("side_delts")}
      </mesh>
      <mesh
        position={[0.58, 1.74, -0.02]}
        onPointerDown={(e) => handlePointerDown(e, "side_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMuscleMaterial("side_delts")}
      </mesh>

      {/* Rear Delts */}
      <mesh
        position={[-0.52, 1.74, -0.12]}
        onPointerDown={(e) => handlePointerDown(e, "rear_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMuscleMaterial("rear_delts")}
      </mesh>
      <mesh
        position={[0.52, 1.74, -0.12]}
        onPointerDown={(e) => handlePointerDown(e, "rear_delts")}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        {getMuscleMaterial("rear_delts")}
      </mesh>

      {/* Biceps */}
      <mesh
        position={[-0.56, 1.34, 0.06]}
        onPointerDown={(e) => handlePointerDown(e, "biceps")}
      >
        <capsuleGeometry args={[0.12, 0.26, 12, 24]} />
        {getMuscleMaterial("biceps")}
      </mesh>
      <mesh
        position={[0.56, 1.34, 0.06]}
        onPointerDown={(e) => handlePointerDown(e, "biceps")}
      >
        <capsuleGeometry args={[0.12, 0.26, 12, 24]} />
        {getMuscleMaterial("biceps")}
      </mesh>

      {/* Triceps */}
      <mesh
        position={[-0.56, 1.34, -0.08]}
        onPointerDown={(e) => handlePointerDown(e, "triceps")}
      >
        <capsuleGeometry args={[0.13, 0.28, 12, 24]} />
        {getMuscleMaterial("triceps")}
      </mesh>
      <mesh
        position={[0.56, 1.34, -0.08]}
        onPointerDown={(e) => handlePointerDown(e, "triceps")}
      >
        <capsuleGeometry args={[0.13, 0.28, 12, 24]} />
        {getMuscleMaterial("triceps")}
      </mesh>

      {/* Forearms */}
      <mesh
        position={[-0.62, 0.88, 0.02]}
        rotation={[0, 0, -0.15]}
        onPointerDown={(e) => handlePointerDown(e, "forearms")}
      >
        <cylinderGeometry args={[0.09, 0.07, 0.44, 24]} />
        {getMuscleMaterial("forearms")}
      </mesh>
      <mesh
        position={[0.62, 0.88, 0.02]}
        rotation={[0, 0, 0.15]}
        onPointerDown={(e) => handlePointerDown(e, "forearms")}
      >
        <cylinderGeometry args={[0.09, 0.07, 0.44, 24]} />
        {getMuscleMaterial("forearms")}
      </mesh>

      {/* Abdominals (Core) */}
      <mesh
        position={[0, 1.18, 0.12]}
        onPointerDown={(e) => handlePointerDown(e, "abs")}
      >
        <boxGeometry args={[0.38, 0.48, 0.18]} />
        {getMuscleMaterial("abs")}
      </mesh>

      {/* Obliques */}
      <mesh
        position={[-0.26, 1.15, 0.08]}
        onPointerDown={(e) => handlePointerDown(e, "obliques")}
      >
        <boxGeometry args={[0.16, 0.42, 0.18]} />
        {getMuscleMaterial("obliques")}
      </mesh>
      <mesh
        position={[0.26, 1.15, 0.08]}
        onPointerDown={(e) => handlePointerDown(e, "obliques")}
      >
        <boxGeometry args={[0.16, 0.42, 0.18]} />
        {getMuscleMaterial("obliques")}
      </mesh>

      {/* Lower Back */}
      <mesh
        position={[0, 1.08, -0.12]}
        onPointerDown={(e) => handlePointerDown(e, "lower_back")}
      >
        <boxGeometry args={[0.38, 0.38, 0.16]} />
        {getMuscleMaterial("lower_back")}
      </mesh>

      {/* Glutes */}
      <mesh
        position={[-0.2, 0.72, -0.14]}
        onPointerDown={(e) => handlePointerDown(e, "glutes")}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        {getMuscleMaterial("glutes")}
      </mesh>
      <mesh
        position={[0.2, 0.72, -0.14]}
        onPointerDown={(e) => handlePointerDown(e, "glutes")}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        {getMuscleMaterial("glutes")}
      </mesh>

      {/* Pelvis & Hips */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.34, 0.32, 0.28, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} />
      </mesh>

      {/* Quadriceps (Front Thighs) */}
      <mesh
        position={[-0.22, 0.24, 0.08]}
        rotation={[0.08, 0, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "quads")}
      >
        <capsuleGeometry args={[0.17, 0.52, 16, 24]} />
        {getMuscleMaterial("quads")}
      </mesh>
      <mesh
        position={[0.22, 0.24, 0.08]}
        rotation={[0.08, 0, 0.04]}
        onPointerDown={(e) => handlePointerDown(e, "quads")}
      >
        <capsuleGeometry args={[0.17, 0.52, 16, 24]} />
        {getMuscleMaterial("quads")}
      </mesh>

      {/* Hamstrings (Rear Thighs) */}
      <mesh
        position={[-0.22, 0.24, -0.1]}
        rotation={[-0.08, 0, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "hamstrings")}
      >
        <capsuleGeometry args={[0.16, 0.48, 16, 24]} />
        {getMuscleMaterial("hamstrings")}
      </mesh>
      <mesh
        position={[0.22, 0.24, -0.1]}
        rotation={[-0.08, 0, 0.04]}
        onPointerDown={(e) => handlePointerDown(e, "hamstrings")}
      >
        <capsuleGeometry args={[0.16, 0.48, 16, 24]} />
        {getMuscleMaterial("hamstrings")}
      </mesh>

      {/* Calves */}
      <mesh
        position={[-0.22, -0.48, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "calves")}
      >
        <capsuleGeometry args={[0.13, 0.52, 16, 24]} />
        {getMuscleMaterial("calves")}
      </mesh>
      <mesh
        position={[0.22, -0.48, -0.04]}
        onPointerDown={(e) => handlePointerDown(e, "calves")}
      >
        <capsuleGeometry args={[0.13, 0.52, 16, 24]} />
        {getMuscleMaterial("calves")}
      </mesh>

      {/* Feet & Platform */}
      <mesh position={[-0.22, -0.84, 0.06]}>
        <boxGeometry args={[0.14, 0.08, 0.28]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.22, -0.84, 0.06]}>
        <boxGeometry args={[0.14, 0.08, 0.28]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
    </group>
  );
};
