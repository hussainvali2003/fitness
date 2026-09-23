"use client";

import React, { useState, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RealisticHumanModel, ExerciseKinematics } from "./RealisticHumanModel";

export type ExerciseKey =
  | "bench_press"
  | "incline_db_press"
  | "machine_chest_press"
  | "cable_chest_fly"
  | "db_lateral_raise"
  | "seated_db_shoulder_press"
  | "cable_triceps_pushdown"
  | "overhead_cable_triceps_ext"
  | "lat_pulldown"
  | "chest_supported_row"
  | "seated_cable_row"
  | "straight_arm_pulldown"
  | "reverse_pec_deck"
  | "db_curl"
  | "hammer_curl"
  | "cable_crunch"
  | "hanging_knee_raise"
  | "leg_press"
  | "romanian_deadlift"
  | "leg_extension"
  | "leg_curl"
  | "calf_raise"
  | "plank";

interface ExerciseBiomechanicsAnimatorProps {
  exerciseId?: string;
  playbackSpeed?: number;
  isPlaying?: boolean;
}

export const ExerciseBiomechanicsAnimator: React.FC<ExerciseBiomechanicsAnimatorProps> = ({
  exerciseId = "bench_press",
  playbackSpeed = 1.0,
  isPlaying = true,
}) => {
  const [kinematics, setKinematics] = useState<ExerciseKinematics>({
    torsoPitch: 0,
    torsoRoll: 0,
    torsoHeight: 0,
    leftArmPitch: 0,
    leftArmRoll: 0,
    leftArmYaw: 0,
    leftElbowFlex: 0,
    rightArmPitch: 0,
    rightArmRoll: 0,
    rightArmYaw: 0,
    rightElbowFlex: 0,
    leftLegPitch: 0,
    rightLegPitch: 0,
    equipmentType: "barbell",
    activeMuscleHead: "chest",
    contractionIntensity: 1.0,
  });

  // Dynamic Equipment Group Refs
  const barbellRef = useRef<THREE.Group>(null);
  const leftDumbbellRef = useRef<THREE.Group>(null);
  const rightDumbbellRef = useRef<THREE.Group>(null);
  const benchRef = useRef<THREE.Group>(null);
  const cablePulleysRef = useRef<THREE.Group>(null);
  const legPressSledRef = useRef<THREE.Group>(null);
  const latBarRef = useRef<THREE.Group>(null);
  const pullUpBarRef = useRef<THREE.Group>(null);

  // Exact Dribbble GYM X sampled colors
  const GYMX_ORANGE = useMemo(() => new THREE.Color("#ee4d00"), []);
  const STEEL_DARK = useMemo(() => new THREE.Color("#2a2a32"), []);
  const PADDED_LEATHER = useMemo(() => new THREE.Color("#111114"), []);

  // Map any exerciseId string to a canonical ExerciseKey
  const currentExercise: ExerciseKey = useMemo(() => {
    const id = exerciseId.toLowerCase();
    if (id.includes("incline") && (id.includes("db") || id.includes("dumbbell") || id.includes("press"))) return "incline_db_press";
    if (id.includes("machine_chest") || (id.includes("chest") && id.includes("press") && id.includes("machine"))) return "machine_chest_press";
    if (id.includes("cable_fly") || id.includes("cable_chest_fly") || id.includes("fly")) return "cable_chest_fly";
    if (id.includes("lateral")) return "db_lateral_raise";
    if (id.includes("shoulder") || id.includes("overhead_press")) return "seated_db_shoulder_press";
    if (id.includes("overhead_triceps") || id.includes("overhead_cable")) return "overhead_cable_triceps_ext";
    if (id.includes("pushdown") || (id.includes("triceps") && !id.includes("overhead"))) return "cable_triceps_pushdown";

    // Pull
    if (id.includes("lat_pulldown") || id.includes("pulldown") && id.includes("lat")) return "lat_pulldown";
    if (id.includes("chest_supported") || id.includes("tbar") || id.includes("t_bar")) return "chest_supported_row";
    if (id.includes("seated_cable_row") || id.includes("cable_row") || id.includes("seated_row")) return "seated_cable_row";
    if (id.includes("straight_arm")) return "straight_arm_pulldown";
    if (id.includes("reverse_pec") || id.includes("rear_delt")) return "reverse_pec_deck";
    if (id.includes("hammer")) return "hammer_curl";
    if (id.includes("curl") && (id.includes("db") || id.includes("bicep") || id.includes("arm"))) return "db_curl";
    if (id.includes("cable_crunch") || id.includes("crunch")) return "cable_crunch";
    if (id.includes("knee_raise") || id.includes("hanging")) return "hanging_knee_raise";

    // Legs & Core
    if (id.includes("leg_press")) return "leg_press";
    if (id.includes("romanian") || id.includes("rdl") || id.includes("deadlift")) return "romanian_deadlift";
    if (id.includes("extension")) return "leg_extension";
    if (id.includes("leg_curl") || id.includes("hamstring")) return "leg_curl";
    if (id.includes("calf")) return "calf_raise";
    if (id.includes("plank")) return "plank";

    return "bench_press";
  }, [exerciseId]);

  // Real-time kinematic physics loop (Slow, smooth, educational tempo)
  useFrame((state) => {
    if (!isPlaying) return;
    // Slow down tempo to ~1.4 for clear joint visibility ("thora slowly slowly dikhna chahia")
    const t = state.clock.getElapsedTime() * 1.4 * playbackSpeed;
    const repPhase = (Math.sin(t) + 1) / 2; // 0 = eccentric / stretch, 1 = concentric / peak squeeze

    switch (currentExercise) {
      // 1. BARBELL BENCH PRESS
      case "bench_press": {
        const elbowFlex = THREE.MathUtils.lerp(1.35, 0.1, repPhase);
        const armPitch = THREE.MathUtils.lerp(-1.1, -1.57, repPhase);
        const barY = THREE.MathUtils.lerp(0.85, 1.45, repPhase);

        setKinematics({
          torsoPitch: -Math.PI / 2,
          torsoRoll: 0,
          torsoHeight: 0.15,
          leftArmPitch: armPitch,
          leftArmRoll: -0.35,
          leftArmYaw: 0.2,
          leftElbowFlex: elbowFlex,
          rightArmPitch: armPitch,
          rightArmRoll: 0.35,
          rightArmYaw: -0.2,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.6,
          rightLegPitch: 0.6,
          equipmentType: "barbell",
          activeMuscleHead: "chest_sternal",
          contractionIntensity: 0.3 + repPhase * 1.8,
        });

        if (barbellRef.current) {
          barbellRef.current.position.set(0, barY, 0.25);
          barbellRef.current.rotation.set(0, 0, 0);
          barbellRef.current.scale.set(1, 1, 1);
        }
        break;
      }

      // 2. INCLINE DUMBBELL PRESS
      case "incline_db_press": {
        const elbowFlex = THREE.MathUtils.lerp(1.3, 0.15, repPhase);
        const dbHeight = THREE.MathUtils.lerp(0.9, 1.5, repPhase);
        const dbSpread = THREE.MathUtils.lerp(0.48, 0.24, repPhase);

        setKinematics({
          torsoPitch: -Math.PI / 3.2,
          torsoRoll: 0,
          torsoHeight: 0.25,
          leftArmPitch: THREE.MathUtils.lerp(-0.8, -1.4, repPhase),
          leftArmRoll: -0.4,
          leftArmYaw: 0.15,
          leftElbowFlex: elbowFlex,
          rightArmPitch: THREE.MathUtils.lerp(-0.8, -1.4, repPhase),
          rightArmRoll: 0.4,
          rightArmYaw: -0.15,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.5,
          rightLegPitch: 0.5,
          equipmentType: "dumbbells",
          activeMuscleHead: "chest_clavicular",
          contractionIntensity: 0.4 + repPhase * 1.9,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-dbSpread, dbHeight, 0.4);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(dbSpread, dbHeight, 0.4);
        break;
      }

      // 3. MACHINE CHEST PRESS
      case "machine_chest_press": {
        const pushDistance = THREE.MathUtils.lerp(0.25, 0.7, repPhase);
        const elbowFlex = THREE.MathUtils.lerp(1.4, 0.12, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.35,
          leftArmPitch: -1.35,
          leftArmRoll: -0.25,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: -1.35,
          rightArmRoll: 0.25,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 1.2,
          rightLegPitch: 1.2,
          equipmentType: "machine",
          activeMuscleHead: "chest",
          contractionIntensity: 0.3 + repPhase * 1.7,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.42, 1.15, pushDistance);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.42, 1.15, pushDistance);
        break;
      }

      // 4. CABLE CHEST FLY
      case "cable_chest_fly": {
        const armRoll = THREE.MathUtils.lerp(-1.15, -0.15, repPhase);
        const rightArmRoll = THREE.MathUtils.lerp(1.15, 0.15, repPhase);

        setKinematics({
          torsoPitch: 0.12,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -1.0,
          leftArmRoll: armRoll,
          leftArmYaw: 0.3,
          leftElbowFlex: 0.35,
          rightArmPitch: -1.0,
          rightArmRoll: rightArmRoll,
          rightArmYaw: -0.3,
          rightElbowFlex: 0.35,
          leftLegPitch: 0.25,
          rightLegPitch: -0.2,
          equipmentType: "cables",
          activeMuscleHead: "chest_costal",
          contractionIntensity: 0.2 + repPhase * 2.2,
        });

        const flyRadius = THREE.MathUtils.lerp(0.85, 0.25, repPhase);
        const flyZ = THREE.MathUtils.lerp(-0.05, 0.55, repPhase);
        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-flyRadius, 1.15, flyZ);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(flyRadius, 1.15, flyZ);
        break;
      }

      // 5. DUMBBELL LATERAL RAISE
      case "db_lateral_raise": {
        const leftRoll = THREE.MathUtils.lerp(-0.18, -1.55, repPhase);
        const rightRoll = THREE.MathUtils.lerp(0.18, 1.55, repPhase);

        setKinematics({
          torsoPitch: 0.05,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: 0.1,
          leftArmRoll: leftRoll,
          leftArmYaw: 0.15,
          leftElbowFlex: 0.2,
          rightArmPitch: 0.1,
          rightArmRoll: rightRoll,
          rightArmYaw: -0.15,
          rightElbowFlex: 0.2,
          leftLegPitch: 0,
          rightLegPitch: 0,
          equipmentType: "dumbbells",
          activeMuscleHead: "deltoids_lateral",
          contractionIntensity: 0.3 + repPhase * 2.0,
        });

        const lateralSpread = THREE.MathUtils.lerp(0.38, 0.95, repPhase);
        const lateralHeight = THREE.MathUtils.lerp(0.65, 1.25, repPhase);
        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-lateralSpread, lateralHeight, 0.08);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(lateralSpread, lateralHeight, 0.08);
        break;
      }

      // 6. SEATED DUMBBELL SHOULDER PRESS
      case "seated_db_shoulder_press": {
        const pressHeight = THREE.MathUtils.lerp(1.2, 1.9, repPhase);
        const elbowFlex = THREE.MathUtils.lerp(1.5, 0.12, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.35,
          leftArmPitch: 0,
          leftArmRoll: -1.35,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: 0,
          rightArmRoll: 1.35,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 1.2,
          rightLegPitch: 1.2,
          equipmentType: "dumbbells",
          activeMuscleHead: "deltoids",
          contractionIntensity: 0.3 + repPhase * 1.9,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.44, pressHeight, 0.05);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.44, pressHeight, 0.05);
        break;
      }

      // 7. CABLE TRICEPS PUSHDOWN
      case "cable_triceps_pushdown": {
        const elbowFlex = THREE.MathUtils.lerp(1.5, 0.08, repPhase);
        const barY = THREE.MathUtils.lerp(1.15, 0.65, repPhase);

        setKinematics({
          torsoPitch: 0.15,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -0.15,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: -0.15,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.05,
          rightLegPitch: 0.05,
          equipmentType: "cables",
          activeMuscleHead: "triceps",
          contractionIntensity: 0.3 + repPhase * 2.1,
        });

        if (barbellRef.current) {
          barbellRef.current.position.set(0, barY, 0.32);
          barbellRef.current.scale.set(0.45, 0.45, 0.45);
        }
        break;
      }

      // 8. OVERHEAD CABLE TRICEPS EXTENSION
      case "overhead_cable_triceps_ext": {
        const elbowFlex = THREE.MathUtils.lerp(1.6, 0.15, repPhase);
        const handY = THREE.MathUtils.lerp(1.4, 1.85, repPhase);
        const handZ = THREE.MathUtils.lerp(-0.25, 0.35, repPhase);

        setKinematics({
          torsoPitch: 0.25,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -2.3,
          leftArmRoll: -0.25,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: -2.3,
          rightArmRoll: 0.25,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.3,
          rightLegPitch: -0.25,
          equipmentType: "cables",
          activeMuscleHead: "triceps",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.16, handY, handZ);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.16, handY, handZ);
        break;
      }

      // 9. WIDE GRIP LAT PULLDOWN
      case "lat_pulldown": {
        const pullArmY = THREE.MathUtils.lerp(2.2, 1.45, repPhase);
        const armPitch = THREE.MathUtils.lerp(-2.8, -1.25, repPhase);
        const elbowFlex = THREE.MathUtils.lerp(0.15, 1.6, repPhase);

        setKinematics({
          torsoPitch: -0.22, // 15° slight lean back
          torsoRoll: 0,
          torsoHeight: 0.35,
          leftArmPitch: armPitch,
          leftArmRoll: -0.5,
          leftArmYaw: 0.2,
          leftElbowFlex: elbowFlex,
          rightArmPitch: armPitch,
          rightArmRoll: 0.5,
          rightArmYaw: -0.2,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 1.25, // Seated with knees under thigh pads
          rightLegPitch: 1.25,
          equipmentType: "cables",
          activeMuscleHead: "lats",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (latBarRef.current) {
          latBarRef.current.position.set(0, pullArmY, 0.15);
        }
        break;
      }

      // 10. CHEST SUPPORTED T-BAR / DB ROW
      case "chest_supported_row": {
        const armPitch = THREE.MathUtils.lerp(-0.25, 0.45, repPhase);
        const elbowFlex = THREE.MathUtils.lerp(0.2, 1.65, repPhase);
        const dbY = THREE.MathUtils.lerp(0.65, 1.15, repPhase);

        setKinematics({
          torsoPitch: 0.55, // Incline chest support
          torsoRoll: 0,
          torsoHeight: 0.3,
          leftArmPitch: armPitch,
          leftArmRoll: -0.3,
          leftArmYaw: 0.1,
          leftElbowFlex: elbowFlex,
          rightArmPitch: armPitch,
          rightArmRoll: 0.3,
          rightArmYaw: -0.1,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.35,
          rightLegPitch: 0.35,
          equipmentType: "dumbbells",
          activeMuscleHead: "upper_back",
          contractionIntensity: 0.3 + repPhase * 2.0,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.35, dbY, 0.2);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.35, dbY, 0.2);
        break;
      }

      // 11. SEATED CABLE ROW
      case "seated_cable_row": {
        const armPitch = THREE.MathUtils.lerp(-1.45, -0.3, repPhase);
        const elbowFlex = THREE.MathUtils.lerp(0.18, 1.6, repPhase);
        const handleZ = THREE.MathUtils.lerp(0.65, 0.2, repPhase);

        setKinematics({
          torsoPitch: 0.08,
          torsoRoll: 0,
          torsoHeight: 0.3,
          leftArmPitch: armPitch,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: armPitch,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0.9,
          rightLegPitch: 0.9,
          equipmentType: "cables",
          activeMuscleHead: "lats",
          contractionIntensity: 0.3 + repPhase * 2.0,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.15, 0.95, handleZ);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.15, 0.95, handleZ);
        break;
      }

      // 12. STRAIGHT ARM LAT PULLDOWN
      case "straight_arm_pulldown": {
        const armPitch = THREE.MathUtils.lerp(-2.4, -0.25, repPhase);
        const barY = THREE.MathUtils.lerp(1.7, 0.8, repPhase);
        const barZ = THREE.MathUtils.lerp(0.35, 0.2, repPhase);

        setKinematics({
          torsoPitch: 0.25,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: armPitch,
          leftArmRoll: -0.25,
          leftArmYaw: 0,
          leftElbowFlex: 0.15,
          rightArmPitch: armPitch,
          rightArmRoll: 0.25,
          rightArmYaw: 0,
          rightElbowFlex: 0.15,
          leftLegPitch: 0.15,
          rightLegPitch: 0.15,
          equipmentType: "cables",
          activeMuscleHead: "lats",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (barbellRef.current) {
          barbellRef.current.position.set(0, barY, barZ);
          barbellRef.current.scale.set(0.65, 0.65, 0.65);
        }
        break;
      }

      // 13. REVERSE PEC DECK
      case "reverse_pec_deck": {
        const armRoll = THREE.MathUtils.lerp(-0.2, -1.35, repPhase);
        const rightArmRoll = THREE.MathUtils.lerp(0.2, 1.35, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.35,
          leftArmPitch: -1.35,
          leftArmRoll: armRoll,
          leftArmYaw: 0.1,
          leftElbowFlex: 0.22,
          rightArmPitch: -1.35,
          rightArmRoll: rightArmRoll,
          rightArmYaw: -0.1,
          rightElbowFlex: 0.22,
          leftLegPitch: 1.2,
          rightLegPitch: 1.2,
          equipmentType: "machine",
          activeMuscleHead: "deltoids",
          contractionIntensity: 0.3 + repPhase * 2.1,
        });

        const flyRadius = THREE.MathUtils.lerp(0.25, 0.8, repPhase);
        const flyZ = THREE.MathUtils.lerp(0.55, 0.05, repPhase);
        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-flyRadius, 1.15, flyZ);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(flyRadius, 1.15, flyZ);
        break;
      }

      // 14. DUMBBELL BICEP CURL
      case "db_curl": {
        const elbowFlex = THREE.MathUtils.lerp(0.15, 2.2, repPhase);
        const dbY = THREE.MathUtils.lerp(0.65, 1.18, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -0.1,
          leftArmRoll: -0.22,
          leftArmYaw: 0.15,
          leftElbowFlex: elbowFlex,
          rightArmPitch: -0.1,
          rightArmRoll: 0.22,
          rightArmYaw: -0.15,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0,
          rightLegPitch: 0,
          equipmentType: "dumbbells",
          activeMuscleHead: "biceps",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.38, dbY, 0.22);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.38, dbY, 0.22);
        break;
      }

      // 15. NEUTRAL GRIP HAMMER CURL
      case "hammer_curl": {
        const elbowFlex = THREE.MathUtils.lerp(0.15, 2.15, repPhase);
        const dbY = THREE.MathUtils.lerp(0.65, 1.15, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -0.08,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: elbowFlex,
          rightArmPitch: -0.08,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: elbowFlex,
          leftLegPitch: 0,
          rightLegPitch: 0,
          equipmentType: "dumbbells",
          activeMuscleHead: "biceps",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (leftDumbbellRef.current) leftDumbbellRef.current.position.set(-0.36, dbY, 0.2);
        if (rightDumbbellRef.current) rightDumbbellRef.current.position.set(0.36, dbY, 0.2);
        break;
      }

      // 16. KNEELING CABLE CRUNCH
      case "cable_crunch": {
        const torsoCurl = THREE.MathUtils.lerp(0.1, 0.75, repPhase);

        setKinematics({
          torsoPitch: torsoCurl,
          torsoRoll: 0,
          torsoHeight: 0.25,
          leftArmPitch: -2.0,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: 1.8,
          rightArmPitch: -2.0,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: 1.8,
          leftLegPitch: 1.4,
          rightLegPitch: 1.4,
          equipmentType: "cables",
          activeMuscleHead: "abs",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });
        break;
      }

      // 17. HANGING KNEE RAISE
      case "hanging_knee_raise": {
        const legCurl = THREE.MathUtils.lerp(0.1, 1.65, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.45,
          leftArmPitch: -3.0,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: 0.1,
          rightArmPitch: -3.0,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: 0.1,
          leftLegPitch: legCurl,
          rightLegPitch: legCurl,
          equipmentType: "pullup_bar",
          activeMuscleHead: "abs",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (pullUpBarRef.current) {
          pullUpBarRef.current.position.set(0, 2.3, 0);
        }
        break;
      }

      // 18. 45-DEGREE INCLINE LEG PRESS
      case "leg_press": {
        // repPhase = 0: deep 90° stretch (knees flexed, sled down); repPhase = 1: press lockout (legs extended)
        const legPitch = THREE.MathUtils.lerp(1.55, 0.45, repPhase);
        const sledDistance = THREE.MathUtils.lerp(0.85, 1.45, repPhase);

        setKinematics({
          torsoPitch: -Math.PI / 4, // 45° incline seat
          torsoRoll: 0,
          torsoHeight: 0.2,
          leftArmPitch: -0.1,
          leftArmRoll: -0.35,
          leftArmYaw: 0,
          leftElbowFlex: 0.2,
          rightArmPitch: -0.1,
          rightArmRoll: 0.35,
          rightArmYaw: 0,
          rightElbowFlex: 0.2,
          leftLegPitch: legPitch,
          rightLegPitch: legPitch,
          equipmentType: "sled",
          activeMuscleHead: "quads",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });

        if (legPressSledRef.current) {
          legPressSledRef.current.position.set(0, sledDistance, sledDistance * 0.7);
        }
        break;
      }

      // 19. ROMANIAN DEADLIFT (RDL)
      case "romanian_deadlift": {
        // repPhase = 0: deep hamstring stretch (torso hinged forward 50°); repPhase = 1: standing lockout
        const hinge = THREE.MathUtils.lerp(0.85, 0.05, repPhase);
        const barY = THREE.MathUtils.lerp(0.45, 1.05, repPhase);

        setKinematics({
          torsoPitch: hinge,
          torsoRoll: 0,
          torsoHeight: 0.4,
          leftArmPitch: -hinge * 0.9,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: 0.1,
          rightArmPitch: -hinge * 0.9,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: 0.1,
          leftLegPitch: -0.2,
          rightLegPitch: -0.2,
          equipmentType: "barbell",
          activeMuscleHead: "hamstrings",
          contractionIntensity: 0.3 + (1.0 - repPhase) * 2.2,
        });

        if (barbellRef.current) {
          barbellRef.current.position.set(0, barY, 0.25);
          barbellRef.current.rotation.set(0, 0, 0);
          barbellRef.current.scale.set(1, 1, 1);
        }
        break;
      }

      // 20. SEATED LEG EXTENSION
      case "leg_extension": {
        const legPitch = THREE.MathUtils.lerp(1.4, 0.25, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: 0.35,
          leftArmPitch: -0.1,
          leftArmRoll: -0.3,
          leftArmYaw: 0,
          leftElbowFlex: 0.2,
          rightArmPitch: -0.1,
          rightArmRoll: 0.3,
          rightArmYaw: 0,
          rightElbowFlex: 0.2,
          leftLegPitch: legPitch,
          rightLegPitch: legPitch,
          equipmentType: "machine",
          activeMuscleHead: "quads",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });
        break;
      }

      // 21. HAMSTRING LEG CURL
      case "leg_curl": {
        const legPitch = THREE.MathUtils.lerp(0.1, 1.5, repPhase);

        setKinematics({
          torsoPitch: -Math.PI / 2,
          torsoRoll: 0,
          torsoHeight: 0.15,
          leftArmPitch: -1.0,
          leftArmRoll: -0.3,
          leftArmYaw: 0,
          leftElbowFlex: 0.5,
          rightArmPitch: -1.0,
          rightArmRoll: 0.3,
          rightArmYaw: 0,
          rightElbowFlex: 0.5,
          leftLegPitch: legPitch,
          rightLegPitch: legPitch,
          equipmentType: "machine",
          activeMuscleHead: "hamstrings",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });
        break;
      }

      // 22. STANDING CALF RAISE
      case "calf_raise": {
        const calfRise = THREE.MathUtils.lerp(0.25, 0.48, repPhase);

        setKinematics({
          torsoPitch: 0,
          torsoRoll: 0,
          torsoHeight: calfRise,
          leftArmPitch: 0,
          leftArmRoll: -0.2,
          leftArmYaw: 0,
          leftElbowFlex: 0.1,
          rightArmPitch: 0,
          rightArmRoll: 0.2,
          rightArmYaw: 0,
          rightElbowFlex: 0.1,
          leftLegPitch: 0,
          rightLegPitch: 0,
          equipmentType: "none",
          activeMuscleHead: "calves",
          contractionIntensity: 0.3 + repPhase * 2.2,
        });
        break;
      }

      // 23. CORE ISOMETRIC PLANK
      case "plank": {
        const isometricPulse = Math.sin(t * 3.0) * 0.3 + 1.2;

        setKinematics({
          torsoPitch: -Math.PI / 2 + 0.15,
          torsoRoll: 0,
          torsoHeight: -0.05,
          leftArmPitch: -1.5,
          leftArmRoll: -0.15,
          leftArmYaw: 0,
          leftElbowFlex: 1.55,
          rightArmPitch: -1.5,
          rightArmRoll: 0.15,
          rightArmYaw: 0,
          rightElbowFlex: 1.55,
          leftLegPitch: 0,
          rightLegPitch: 0,
          equipmentType: "none",
          activeMuscleHead: "abs",
          contractionIntensity: isometricPulse,
        });
        break;
      }
    }
  });

  return (
    <group>
      {/* Real Muscular Anatomical Human Athlete */}
      <RealisticHumanModel kinematics={kinematics} isContractionActive={isPlaying} />

      {/* ========================================================
          3D EQUIPMENT (BARBELL, DUMBBELLS, BENCHES, CABLES, SLED)
      ======================================================== */}
      {/* 1. Olympic Barbell (Bench Press, RDL, Straight Arm Pulldown) */}
      {(currentExercise === "bench_press" ||
        currentExercise === "cable_triceps_pushdown" ||
        currentExercise === "romanian_deadlift" ||
        currentExercise === "straight_arm_pulldown") && (
        <group ref={barbellRef} position={[0, 1.0, 0.3]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 1.8, 24]} />
            <meshStandardMaterial color="#888890" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Left Olympic 20kg Plates with GYM X Orange Accents */}
          <group position={[-0.82, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.21, 0.015, 16, 32]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Right Olympic 20kg Plates */}
          <group position={[0.82, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.21, 0.015, 16, 32]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* 2. Hex Dumbbells */}
      {(currentExercise === "incline_db_press" ||
        currentExercise === "db_lateral_raise" ||
        currentExercise === "seated_db_shoulder_press" ||
        currentExercise === "cable_chest_fly" ||
        currentExercise === "machine_chest_press" ||
        currentExercise === "overhead_cable_triceps_ext" ||
        currentExercise === "chest_supported_row" ||
        currentExercise === "seated_cable_row" ||
        currentExercise === "reverse_pec_deck" ||
        currentExercise === "db_curl" ||
        currentExercise === "hammer_curl") && (
        <>
          <group ref={leftDumbbellRef} position={[-0.45, 1.1, 0.2]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
              <meshStandardMaterial color="#aaaaaf" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[0.05, 0.075, 16]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={1.2} />
            </mesh>
          </group>

          <group ref={rightDumbbellRef} position={[0.45, 1.1, 0.2]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
              <meshStandardMaterial color="#aaaaaf" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial color={STEEL_DARK} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[0.05, 0.075, 16]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={1.2} />
            </mesh>
          </group>
        </>
      )}

      {/* 3. Flat Bench (Bench Press, Leg Curl) */}
      {(currentExercise === "bench_press" || currentExercise === "leg_curl") && (
        <group ref={benchRef} position={[0, -0.15, -0.1]}>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.38, 0.12, 1.4]} />
            <meshStandardMaterial color={PADDED_LEATHER} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.1, 0.45, 1.2]} />
            <meshStandardMaterial color="#1a1a20" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.55, 0.06, 1.35]} />
            <meshStandardMaterial color="#1a1a20" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 4. Cable Crossover Pulleys */}
      {(currentExercise === "cable_chest_fly" ||
        currentExercise === "cable_triceps_pushdown" ||
        currentExercise === "overhead_cable_triceps_ext" ||
        currentExercise === "lat_pulldown" ||
        currentExercise === "seated_cable_row" ||
        currentExercise === "straight_arm_pulldown" ||
        currentExercise === "cable_crunch") && (
        <group ref={cablePulleysRef} position={[0, 0.8, -0.6]}>
          <mesh position={[-1.3, 0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
            <meshStandardMaterial color="#1f1f26" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[1.3, 0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
            <meshStandardMaterial color="#1f1f26" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 2.18, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 2.65, 16]} />
            <meshStandardMaterial color="#1f1f26" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-1.3, 1.9, 0]}>
            <torusGeometry args={[0.08, 0.02, 16, 24]} />
            <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[1.3, 1.9, 0]}>
            <torusGeometry args={[0.08, 0.02, 16, 24]} />
            <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* 5. Lat Pulldown Bar */}
      {currentExercise === "lat_pulldown" && (
        <group ref={latBarRef} position={[0, 1.9, 0.15]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 1.6, 16]} />
            <meshStandardMaterial color="#aaaaaf" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[-0.8, -0.05, 0]} rotation={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 16]} />
            <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.8, -0.05, 0]} rotation={[0, 0, -0.35]}>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 16]} />
            <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* 6. 45-Degree Incline Leg Press Sled */}
      {currentExercise === "leg_press" && (
        <group ref={legPressSledRef} position={[0, 1.1, 0.8]}>
          {/* Sled Platform */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.9, 0.06, 0.65]} />
            <meshStandardMaterial color="#1a1a20" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Dual 20kg Plates on Sled */}
          <group position={[-0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.08, 24]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.4} />
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.23, 0.018, 16, 24]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={1.0} />
            </mesh>
          </group>
          <group position={[0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.08, 24]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.4} />
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.23, 0.018, 16, 24]} />
              <meshStandardMaterial color={GYMX_ORANGE} emissive={GYMX_ORANGE} emissiveIntensity={1.0} />
            </mesh>
          </group>
        </group>
      )}

      {/* 7. Pull-Up Bar for Hanging Knee Raise */}
      {currentExercise === "hanging_knee_raise" && (
        <group ref={pullUpBarRef} position={[0, 2.3, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 1.8, 16]} />
            <meshStandardMaterial color="#909098" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
};
