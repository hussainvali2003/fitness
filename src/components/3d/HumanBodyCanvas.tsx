"use client";

import React from "react";
import { MuscleGroup } from "@/types";
import { HumanBodyCanvasHQ, CameraPreset } from "./HumanBodyCanvasHQ";
import { ChestSubHead } from "./MuscleMannequinHQ";

export interface HumanBodyCanvasProps {
  primaryMuscle?: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup;
  chestSubHead?: ChestSubHead;
  onSelectMuscle?: (muscle: MuscleGroup, subHead?: ChestSubHead) => void;
  height?: string;
  showControls?: boolean;
  enableAutoRotate?: boolean;
  initialPreset?: CameraPreset;
}

export const HumanBodyCanvas: React.FC<HumanBodyCanvasProps> = ({
  primaryMuscle,
  secondaryMuscles = [],
  selectedMuscle,
  chestSubHead = "all",
  onSelectMuscle,
  height = "h-[440px]",
  showControls = true,
  enableAutoRotate = false,
  initialPreset = "front",
}) => {
  return (
    <HumanBodyCanvasHQ
      primaryMuscle={primaryMuscle}
      secondaryMuscles={secondaryMuscles}
      selectedMuscle={selectedMuscle}
      chestSubHead={chestSubHead}
      onSelectMuscle={onSelectMuscle}
      height={height}
      showControls={showControls}
      enableAutoRotate={enableAutoRotate}
      initialPreset={initialPreset}
    />
  );
};
