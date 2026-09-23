"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface ExerciseKinematics {
  torsoPitch: number; // Incline, supine, or bent-over angle
  torsoRoll: number;
  torsoHeight: number;
  leftArmPitch: number; // Shoulder flexion/extension
  leftArmRoll: number; // Shoulder abduction/adduction
  leftArmYaw: number;
  leftElbowFlex: number; // Elbow flexion
  rightArmPitch: number;
  rightArmRoll: number;
  rightArmYaw: number;
  rightElbowFlex: number;
  leftLegPitch: number; // Hip flexion for squat/leg press/deadlift
  rightLegPitch: number;
  leftKneeFlex?: number; // Knee flexion
  rightKneeFlex?: number;
  equipmentType?: string;
  equipmentOffset?: [number, number, number];
  activeMuscleHead?: string;
  contractionIntensity?: number;
}

interface RealisticHumanModelProps {
  kinematics?: ExerciseKinematics;
  activeMuscle?: string;
  isContractionActive?: boolean;
}

export const RealisticHumanModel: React.FC<RealisticHumanModelProps> = ({
  kinematics,
  activeMuscle = "chest",
  isContractionActive = true,
}) => {
  // References for kinematic joints
  const torsoRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Shader/glow uniform
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Exact Dribbble GYM X Fiery Orange Color
  const GYMX_ORANGE = useMemo(() => new THREE.Color("#ee4d00"), []);
  const OBSIDIAN_SKIN = useMemo(() => new THREE.Color("#16161b"), []);
  const OBSIDIAN_DEEP = useMemo(() => new THREE.Color("#0c0c0f"), []);

  // Update dynamic kinematics and muscle glow frame-by-frame
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulse = isContractionActive ? Math.sin(t * 3.5) * 0.5 + 0.5 : 0.2;
    const intensity = kinematics?.contractionIntensity !== undefined ? kinematics.contractionIntensity : pulse;

    if (glowMaterialRef.current) {
      glowMaterialRef.current.emissive.copy(GYMX_ORANGE);
      glowMaterialRef.current.emissiveIntensity = 0.8 + intensity * 2.2;
    }

    // Apply joint rotations smoothly
    if (torsoRef.current && kinematics) {
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, kinematics.torsoPitch, 0.15);
      torsoRef.current.position.y = THREE.MathUtils.lerp(torsoRef.current.position.y, kinematics.torsoHeight, 0.15);
    }

    if (leftShoulderRef.current && kinematics) {
      leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, kinematics.leftArmPitch, 0.18);
      leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, kinematics.leftArmRoll, 0.18);
      leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.y, kinematics.leftArmYaw, 0.18);
    }
    if (leftElbowRef.current && kinematics) {
      leftElbowRef.current.rotation.x = THREE.MathUtils.lerp(leftElbowRef.current.rotation.x, kinematics.leftElbowFlex, 0.18);
    }

    if (rightShoulderRef.current && kinematics) {
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, kinematics.rightArmPitch, 0.18);
      rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, kinematics.rightArmRoll, 0.18);
      rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.y, kinematics.rightArmYaw, 0.18);
    }
    if (rightElbowRef.current && kinematics) {
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, kinematics.rightElbowFlex, 0.18);
    }

    // Articulate lower body legs for squats, leg press, lunges, deadlifts
    if (leftLegRef.current && kinematics) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, kinematics.leftLegPitch, 0.18);
    }
    if (rightLegRef.current && kinematics) {
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, kinematics.rightLegPitch, 0.18);
    }
  });

  // Check which muscle heads should glow
  const isChestActive = activeMuscle.includes("chest") || kinematics?.activeMuscleHead?.includes("chest");
  const isUpperChest = activeMuscle === "chest_clavicular" || kinematics?.activeMuscleHead === "chest_clavicular";
  const isMidChest = activeMuscle === "chest_sternal" || activeMuscle === "chest" || kinematics?.activeMuscleHead === "chest_sternal" || kinematics?.activeMuscleHead === "chest";
  const isLowerChest = activeMuscle === "chest_costal" || kinematics?.activeMuscleHead === "chest_costal";
  const isDeltoidActive = activeMuscle.includes("deltoid") || activeMuscle.includes("shoulder") || kinematics?.activeMuscleHead?.includes("deltoid");
  const isTricepsActive = activeMuscle.includes("tricep") || kinematics?.activeMuscleHead?.includes("tricep");
  const isBicepsActive = activeMuscle.includes("bicep") || kinematics?.activeMuscleHead?.includes("bicep");
  const isBackActive = activeMuscle.includes("lat") || activeMuscle.includes("back") || kinematics?.activeMuscleHead?.includes("lat") || kinematics?.activeMuscleHead?.includes("back");
  const isCoreActive = activeMuscle.includes("core") || activeMuscle.includes("abs") || kinematics?.activeMuscleHead?.includes("core") || kinematics?.activeMuscleHead?.includes("abs");
  const isQuadsActive = activeMuscle.includes("quad") || kinematics?.activeMuscleHead?.includes("quad");
  const isHamstringsActive = activeMuscle.includes("hamstring") || kinematics?.activeMuscleHead?.includes("hamstring");
  const isCalvesActive = activeMuscle.includes("calve") || activeMuscle.includes("calf") || kinematics?.activeMuscleHead?.includes("calf");
  const isLegsActive = activeMuscle.includes("leg") || kinematics?.activeMuscleHead?.includes("leg") || isQuadsActive || isHamstringsActive || isCalvesActive;

  // Reusable PBR Materials
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: OBSIDIAN_SKIN,
        roughness: 0.38,
        metalness: 0.15,
        envMapIntensity: 1.0,
      }),
    [OBSIDIAN_SKIN]
  );

  const deepShadowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: OBSIDIAN_DEEP,
        roughness: 0.6,
        metalness: 0.1,
      }),
    [OBSIDIAN_DEEP]
  );

  const activeOrangeGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2a0e04"),
        emissive: GYMX_ORANGE,
        emissiveIntensity: 1.8,
        roughness: 0.25,
        metalness: 0.2,
      }),
    [GYMX_ORANGE]
  );

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dynamic Torso Root with Kinematic Incline/Supine articulation */}
      <group ref={torsoRef} position={[0, 0.4, 0]}>
        {/* =========================================
            REALISTIC HUMAN HEAD & JAWLINE & NECK
        ========================================= */}
        <group position={[0, 1.45, 0]}>
          {/* Cranium - Athletic Human Head */}
          <mesh castShadow position={[0, 0.22, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.22, 32, 24]} />
          </mesh>

          {/* Athletic Jawline & Chin */}
          <mesh position={[0, 0.08, 0.08]} rotation={[0.2, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.16, 0.24, 16]} />
          </mesh>

          {/* Neck with Trapezius & Sternocleidomastoid Bands */}
          <mesh position={[0, -0.08, 0]} material={skinMaterial}>
            <cylinderGeometry args={[0.13, 0.17, 0.24, 24]} />
          </mesh>
          <mesh position={[-0.1, -0.15, -0.06]} rotation={[0, 0, 0.45]} material={skinMaterial}>
            <capsuleGeometry args={[0.07, 0.2, 12, 16]} />
          </mesh>
          <mesh position={[0.1, -0.15, -0.06]} rotation={[0, 0, -0.45]} material={skinMaterial}>
            <capsuleGeometry args={[0.07, 0.2, 12, 16]} />
          </mesh>
        </group>

        {/* =========================================
            ORGANIC ANATOMICAL CHEST (3 HEADS)
        ========================================= */}
        <group position={[0, 1.05, 0.08]}>
          {/* Sternal Midline (Linea Sterni) */}
          <mesh position={[0, 0, 0.06]} material={deepShadowMaterial}>
            <boxGeometry args={[0.025, 0.42, 0.05]} />
          </mesh>

          {/* Left Upper Clavicular Head */}
          <mesh
            position={[-0.22, 0.14, 0.04]}
            rotation={[0.12, -0.15, 0.22]}
            material={isUpperChest || (isChestActive && !isMidChest && !isLowerChest) ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.2, 24, 16]} />
          </mesh>

          {/* Right Upper Clavicular Head */}
          <mesh
            position={[0.22, 0.14, 0.04]}
            rotation={[0.12, 0.15, -0.22]}
            material={isUpperChest || (isChestActive && !isMidChest && !isLowerChest) ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.2, 24, 16]} />
          </mesh>

          {/* Left Mid Sternal Head (Major Pectoral Muscle Belly) */}
          <mesh
            position={[-0.24, -0.02, 0.06]}
            rotation={[0.05, -0.12, 0.08]}
            material={isMidChest || isChestActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.23, 28, 20]} />
          </mesh>

          {/* Right Mid Sternal Head */}
          <mesh
            position={[0.24, -0.02, 0.06]}
            rotation={[0.05, 0.12, -0.08]}
            material={isMidChest || isChestActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.23, 28, 20]} />
          </mesh>

          {/* Left Lower Costal Head (Under-chest sweep) */}
          <mesh
            position={[-0.22, -0.18, 0.04]}
            rotation={[-0.08, -0.12, -0.15]}
            material={isLowerChest || (isChestActive && !isUpperChest) ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.18, 24, 16]} />
          </mesh>

          {/* Right Lower Costal Head */}
          <mesh
            position={[0.22, -0.18, 0.04]}
            rotation={[-0.08, 0.12, 0.15]}
            material={isLowerChest || (isChestActive && !isUpperChest) ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.18, 24, 16]} />
          </mesh>
        </group>

        {/* =========================================
            ATHLETIC RIB CAGE & SERRATUS ANTERIOR & LATS
        ========================================= */}
        <group position={[0, 0.8, 0]}>
          {/* Main Thorax Shell */}
          <mesh position={[0, 0.15, -0.04]} material={skinMaterial}>
            <capsuleGeometry args={[0.34, 0.38, 20, 24]} />
          </mesh>

          {/* Sculpted Latissimus Dorsi V-Taper Wings */}
          <mesh
            position={[-0.34, 0.05, -0.08]}
            rotation={[0.1, 0, 0.32]}
            material={isBackActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.11, 0.38, 16, 16]} />
          </mesh>
          <mesh
            position={[0.34, 0.05, -0.08]}
            rotation={[0.1, 0, -0.32]}
            material={isBackActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.11, 0.38, 16, 16]} />
          </mesh>

          {/* Serratus Anterior "Fingers" along lateral ribs */}
          {[-0.1, 0, 0.1].map((yOffset, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.34, yOffset, 0]} rotation={[0, 0, 0.4]} material={skinMaterial}>
                <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
              </mesh>
              <mesh position={[0.34, yOffset, 0]} rotation={[0, 0, -0.4]} material={skinMaterial}>
                <capsuleGeometry args={[0.035, 0.12, 8, 12]} />
              </mesh>
            </React.Fragment>
          ))}
        </group>

        {/* =========================================
            6-PACK RECTUS ABDOMINIS & OBLIQUES
        ========================================= */}
        <group position={[0, 0.52, 0.08]}>
          {/* Linea Alba Center Trench */}
          <mesh position={[0, 0, 0.05]} material={deepShadowMaterial}>
            <boxGeometry args={[0.02, 0.52, 0.03]} />
          </mesh>

          {/* 3 Tiers of Sculpted Abdominal Packs */}
          {[
            { y: 0.18, scale: 0.95 },
            { y: 0.04, scale: 0.92 },
            { y: -0.11, scale: 0.88 },
          ].map((tier, idx) => (
            <React.Fragment key={idx}>
              {/* Left Pack */}
              <mesh
                position={[-0.1, tier.y, 0.03]}
                material={isCoreActive ? activeOrangeGlowMaterial : skinMaterial}
              >
                <capsuleGeometry args={[0.07 * tier.scale, 0.08 * tier.scale, 12, 16]} />
              </mesh>
              {/* Right Pack */}
              <mesh
                position={[0.1, tier.y, 0.03]}
                material={isCoreActive ? activeOrangeGlowMaterial : skinMaterial}
              >
                <capsuleGeometry args={[0.07 * tier.scale, 0.08 * tier.scale, 12, 16]} />
              </mesh>
              {/* Horizontal Tendinous Inscription */}
              <mesh position={[0, tier.y - 0.06, 0.04]} material={deepShadowMaterial}>
                <boxGeometry args={[0.28, 0.015, 0.03]} />
              </mesh>
            </React.Fragment>
          ))}

          {/* External Obliques / Athletic V-Taper */}
          <mesh position={[-0.28, 0, -0.02]} rotation={[0, 0, -0.25]} material={isCoreActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.08, 0.38, 12, 16]} />
          </mesh>
          <mesh position={[0.28, 0, -0.02]} rotation={[0, 0, 0.25]} material={isCoreActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.08, 0.38, 12, 16]} />
          </mesh>
        </group>

        {/* Pelvis & Athletic Waist */}
        <mesh position={[0, 0.16, -0.02]} material={skinMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.24, 24]} />
        </mesh>

        {/* =========================================
            LEFT ARM WITH HIERARCHICAL KINEMATICS
        ========================================= */}
        <group ref={leftShoulderRef} position={[-0.48, 1.15, 0]}>
          {/* Sculpted Deltoid (3-head shoulder cap) */}
          <mesh
            position={[0, -0.06, 0]}
            rotation={[0, 0, 0.2]}
            material={isDeltoidActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.18, 24, 20]} />
          </mesh>

          {/* Biceps Brachii (Anterior Peak) */}
          <mesh
            position={[-0.04, -0.28, 0.04]}
            material={isBicepsActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.09, 0.2, 16, 16]} />
          </mesh>

          {/* Triceps Brachii (Horseshoe Contour) */}
          <mesh
            position={[0.02, -0.28, -0.04]}
            material={isTricepsActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.095, 0.22, 16, 16]} />
          </mesh>

          {/* Elbow Joint & Forearm */}
          <group ref={leftElbowRef} position={[0, -0.46, 0]}>
            {/* Forearm with Brachioradialis Taper */}
            <mesh position={[0, -0.22, 0]} material={skinMaterial}>
              <cylinderGeometry args={[0.08, 0.055, 0.36, 16]} />
            </mesh>

            {/* Hand & Athletic Grip */}
            <mesh position={[0, -0.44, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.065, 16, 16]} />
            </mesh>
          </group>
        </group>

        {/* =========================================
            RIGHT ARM WITH HIERARCHICAL KINEMATICS
        ========================================= */}
        <group ref={rightShoulderRef} position={[0.48, 1.15, 0]}>
          {/* Sculpted Deltoid (3-head shoulder cap) */}
          <mesh
            position={[0, -0.06, 0]}
            rotation={[0, 0, -0.2]}
            material={isDeltoidActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <sphereGeometry args={[0.18, 24, 20]} />
          </mesh>

          {/* Biceps Brachii (Anterior Peak) */}
          <mesh
            position={[0.04, -0.28, 0.04]}
            material={isBicepsActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.09, 0.2, 16, 16]} />
          </mesh>

          {/* Triceps Brachii (Horseshoe Contour) */}
          <mesh
            position={[-0.02, -0.28, -0.04]}
            material={isTricepsActive ? activeOrangeGlowMaterial : skinMaterial}
          >
            <capsuleGeometry args={[0.095, 0.22, 16, 16]} />
          </mesh>

          {/* Elbow Joint & Forearm */}
          <group ref={rightElbowRef} position={[0, -0.46, 0]}>
            {/* Forearm with Brachioradialis Taper */}
            <mesh position={[0, -0.22, 0]} material={skinMaterial}>
              <cylinderGeometry args={[0.08, 0.055, 0.36, 16]} />
            </mesh>

            {/* Hand & Athletic Grip */}
            <mesh position={[0, -0.44, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.065, 16, 16]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* =========================================
          LOWER BODY (QUADS, HAMSTRINGS, CALVES)
      ========================================= */}
      <group position={[0, 0.35, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.18, 0, 0]}>
          {/* Muscular Quad & Teardrop Vastus Medialis */}
          <mesh position={[0, -0.38, 0.03]} material={isQuadsActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.14, 0.44, 16, 20]} />
          </mesh>
          {/* Teardrop Vastus Medialis Inner Quad */}
          <mesh position={[0.06, -0.52, 0.06]} material={isQuadsActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          {/* Hamstrings (Posterior Thigh) */}
          <mesh position={[0, -0.38, -0.06]} material={isHamstringsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.13, 0.42, 16, 16]} />
          </mesh>
          {/* Knee Joint */}
          <mesh position={[0, -0.66, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
          {/* Calves (Gastrocnemius Bellies) */}
          <mesh position={[0, -0.98, -0.02]} material={isCalvesActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.11, 0.42, 16, 16]} />
          </mesh>
          {/* Athletic Foot */}
          <mesh position={[0, -1.25, 0.08]} material={skinMaterial}>
            <boxGeometry args={[0.12, 0.09, 0.26]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.18, 0, 0]}>
          {/* Muscular Quad & Teardrop Vastus Medialis */}
          <mesh position={[0, -0.38, 0.03]} material={isQuadsActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.14, 0.44, 16, 20]} />
          </mesh>
          {/* Teardrop Vastus Medialis Inner Quad */}
          <mesh position={[-0.06, -0.52, 0.06]} material={isQuadsActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          {/* Hamstrings (Posterior Thigh) */}
          <mesh position={[0, -0.38, -0.06]} material={isHamstringsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.13, 0.42, 16, 16]} />
          </mesh>
          {/* Knee Joint */}
          <mesh position={[0, -0.66, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
          {/* Calves (Gastrocnemius Bellies) */}
          <mesh position={[0, -0.98, -0.02]} material={isCalvesActive || isLegsActive ? activeOrangeGlowMaterial : skinMaterial}>
            <capsuleGeometry args={[0.11, 0.42, 16, 16]} />
          </mesh>
          {/* Athletic Foot */}
          <mesh position={[0, -1.25, 0.08]} material={skinMaterial}>
            <boxGeometry args={[0.12, 0.09, 0.26]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
