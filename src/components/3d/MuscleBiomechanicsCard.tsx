"use client";

import React from "react";
import { MuscleGroup } from "@/types";
import { ChestSubHead } from "./MuscleMannequinHQ";
import { Compass, Target, Zap, Layers } from "lucide-react";

interface BiomechanicsData {
  latin: string;
  heads: string[];
  primaryFunction: string;
  stimulusAngle: string;
  bestAngle: string;
  hypertrophyCues: string[];
}

const MUSCLE_BIOMECHANICS: Record<MuscleGroup, BiomechanicsData> = {
  chest: {
    latin: "Pectoralis Major & Minor",
    heads: ["Clavicular (Upper)", "Sternal (Middle)", "Costal / Abdominal (Lower)"],
    primaryFunction: "Horizontal adduction, internal rotation & shoulder flexion",
    stimulusAngle: "Upper (30-45° Incline), Mid (Flat), Lower (Decline / Dips)",
    bestAngle: "Full active stretch with humeral cross-body tension",
    hypertrophyCues: [
      "Drive elbows together rather than just pressing hands up",
      "Control 3s eccentric to maximize mechanical tension",
      "Retract and depress scapulae to keep tension off front delts",
    ],
  },
  front_delts: {
    latin: "Deltoideus Anterior",
    heads: ["Anterior Clavicular Head"],
    primaryFunction: "Shoulder forward flexion & internal rotation",
    stimulusAngle: "Vertical & Incline press angles (60-75°)",
    bestAngle: "Overhead scapular plane pressing",
    hypertrophyCues: [
      "Keep core braced and prevent hyperextension of lumbar spine",
      "Stop just above shoulder height on dumbbell raises to keep constant load",
    ],
  },
  side_delts: {
    latin: "Deltoideus Lateralis",
    heads: ["Acromial Lateral Head"],
    primaryFunction: "Shoulder abduction (30° to 90° arc)",
    stimulusAngle: "Scapular plane lateral abduction (15° forward tilt)",
    bestAngle: "Cable lateral raise with cuff at wrist height",
    hypertrophyCues: [
      "Lead with elbows, keep pinkies slightly elevated or neutral",
      "Avoid shrugging with upper traps at the top of the arc",
    ],
  },
  rear_delts: {
    latin: "Deltoideus Posterior",
    heads: ["Spinal Scapular Head"],
    primaryFunction: "Horizontal shoulder abduction & external rotation",
    stimulusAngle: "Rear diagonal outward pull (45° sweep)",
    bestAngle: "Reverse cable flyes or face pulls at eye level",
    hypertrophyCues: [
      "Keep elbows flared out wide and initiate with rear delt contraction",
      "Do not retract shoulder blades fully to isolate posterior deltoid",
    ],
  },
  lats: {
    latin: "Latissimus Dorsi",
    heads: ["Thoracic", "Lumbar", "Iliac fibers"],
    primaryFunction: "Shoulder adduction, extension & internal rotation",
    stimulusAngle: "Coronal pull-down & sagittal low-cable row",
    bestAngle: "Slight torso lean with elbow driving into hip pocket",
    hypertrophyCues: [
      "Drive your elbow down into your hip, not just pulling with hands",
      "Feel the lat stretch under load at full arm extension",
    ],
  },
  traps: {
    latin: "Trapezius (Superior, Medial, Inferior)",
    heads: ["Upper Descending", "Middle Transverse", "Lower Ascending"],
    primaryFunction: "Scapular elevation, retraction & upward rotation",
    stimulusAngle: "Vertical shrug with slight hinge, horizontal Kelso shrug",
    bestAngle: "Dumbbell shrug with 15° forward torso lean",
    hypertrophyCues: [
      "Hold peak contraction at the top for a 2-second isometric pause",
      "Avoid rolling shoulders forward or backwards",
    ],
  },
  upper_back: {
    latin: "Rhomboid Major & Minor, Infraspinatus, Teres",
    heads: ["Rhomboids", "Mid Trapezius", "Rotator Cuff"],
    primaryFunction: "Scapular retraction, stabilization & thoracic extension",
    stimulusAngle: "Wide 45-90° horizontal rows",
    bestAngle: "Chest-supported wide T-bar row with 90° elbow flare",
    hypertrophyCues: [
      "Squeeze shoulder blades together as if holding a pencil",
      "Maintain neutral cervical spine throughout the rep",
    ],
  },
  biceps: {
    latin: "Biceps Brachii & Brachialis",
    heads: ["Long Head (Peak)", "Short Head (Inner)", "Brachialis"],
    primaryFunction: "Elbow flexion & radioulnar supination",
    stimulusAngle: "Behind-torso incline (Long head), Preacher angle (Short head)",
    bestAngle: "Incline dumbbell curl with full wrist supination",
    hypertrophyCues: [
      "Supinate wrist hard at peak contraction (turn pinky upward)",
      "Keep elbows pinned at sides to avoid front delt assistance",
    ],
  },
  triceps: {
    latin: "Triceps Brachii",
    heads: ["Lateral Head (Outer)", "Long Head (Overhead)", "Medial Head"],
    primaryFunction: "Elbow extension & shoulder extension (long head)",
    stimulusAngle: "Overhead angle (Long head), Pushdown angle (Lateral/Medial)",
    bestAngle: "Cross-cable overhead triceps extensions",
    hypertrophyCues: [
      "Lock out fully at the bottom with a 1-second squeeze",
      "For long head, elevate humerus overhead for a deep stretch",
    ],
  },
  forearms: {
    latin: "Brachioradialis, Flexor & Extensor Carpi",
    heads: ["Anterior Flexor compartment", "Posterior Extensor compartment"],
    primaryFunction: "Wrist flexion/extension, pronation & grip crushing",
    stimulusAngle: "Neutral grip hammer curls & wrist curls",
    bestAngle: "Rope hammer curls with thumb-up grip",
    hypertrophyCues: [
      "Maintain a firm, crush-grip on the handles during all pulls",
    ],
  },
  abs: {
    latin: "Rectus Abdominis",
    heads: ["Upper segment", "Mid segment", "Lower segment"],
    primaryFunction: "Spinal flexion & posterior pelvic tilt",
    stimulusAngle: "Crunches (upper) & Hanging leg raises (lower)",
    bestAngle: "Kneeling rope cable crunch with thoracic flexion",
    hypertrophyCues: [
      "Curl your ribcage down toward your pelvis; don't just bend hips",
      "Breathe out all air at peak contraction to maximize activation",
    ],
  },
  obliques: {
    latin: "Obliquus Externus & Internus",
    heads: ["Lateral abdominal wall"],
    primaryFunction: "Lateral trunk flexion & contralateral rotation",
    stimulusAngle: "Diagonal woodchoppers & side planks",
    bestAngle: "Cable Pallof press & high-to-low diagonal chop",
    hypertrophyCues: [
      "Rotate through the thoracic cage while keeping hips stable",
    ],
  },
  lower_back: {
    latin: "Erector Spinae",
    heads: ["Iliocostalis", "Longissimus", "Spinalis"],
    primaryFunction: "Spinal extension & postural stabilization",
    stimulusAngle: "Hinge pattern (45° back extension & RDL)",
    bestAngle: "Romanian deadlift with neutral spine and hip hinging",
    hypertrophyCues: [
      "Initiate from hips gliding backward; keep bar skimming shins",
    ],
  },
  glutes: {
    latin: "Gluteus Maximus, Medius & Minimus",
    heads: ["Upper division", "Lower division"],
    primaryFunction: "Hip extension, external rotation & abduction",
    stimulusAngle: "Horizontal hip thrust & deep squatting",
    bestAngle: "Barbell hip thrust with 90° shin angle at top",
    hypertrophyCues: [
      "Tuck chin and maintain posterior pelvic tilt at peak lockout",
      "Drive through heels without arching lower back",
    ],
  },
  quads: {
    latin: "Quadriceps Femoris",
    heads: ["Rectus Femoris", "Vastus Lateralis", "Vastus Medialis (Teardrop)"],
    primaryFunction: "Knee extension & hip flexion (rectus femoris)",
    stimulusAngle: "Full knee flexion squat & leg extension",
    bestAngle: "Heels-elevated Hack squat or Pendulum squat",
    hypertrophyCues: [
      "Push knees forward over toes for maximal quadriceps stretch",
      "Control the descent for 3 seconds before explosive drive",
    ],
  },
  hamstrings: {
    latin: "Biceps Femoris, Semitendinosus, Semimembranosus",
    heads: ["Long head", "Short head"],
    primaryFunction: "Knee flexion & hip extension",
    stimulusAngle: "Hinge (lengthened hip) & Leg curl (knee flexion)",
    bestAngle: "Seated leg curl (pre-stretches hamstrings at the hip)",
    hypertrophyCues: [
      "Dorsiflex toes (pull toes toward shin) during leg curl",
      "Slow 3-second negative without hips lifting off the seat",
    ],
  },
  calves: {
    latin: "Gastrocnemius & Soleus",
    heads: ["Medial Head (Teardrop)", "Lateral Head", "Deep Soleus"],
    primaryFunction: "Ankle plantarflexion",
    stimulusAngle: "Standing calf raise (Gastrocnemius), Seated (Soleus)",
    bestAngle: "Standing single-leg calf raise on a raised block",
    hypertrophyCues: [
      "Pause for 2 full seconds in the deep bottom stretch to kill stretch reflex",
      "Drive through the ball of the big toe for medial head activation",
    ],
  },
};

interface MuscleBiomechanicsCardProps {
  selectedMuscle: MuscleGroup;
  chestSubHead?: ChestSubHead;
  onSelectChestSubHead?: (subHead: ChestSubHead) => void;
  accentColor?: string;
}

export const MuscleBiomechanicsCard: React.FC<MuscleBiomechanicsCardProps> = ({
  selectedMuscle,
  chestSubHead = "all",
  onSelectChestSubHead,
  accentColor = "#ee4d00", // GYM X Fiery Orange
}) => {
  const data = MUSCLE_BIOMECHANICS[selectedMuscle] || MUSCLE_BIOMECHANICS.chest;

  return (
    <div className="rounded-2xl bg-[#111114] border border-[#26262b] p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4 hover:border-[#ee4d00]/40 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#26262b] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-ping bg-[#ee4d00]"
            />
            <span
              className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#ee4d00]"
            >
              GYM X &middot; Biomechanics
            </span>
          </div>
          <h3 className="text-lg font-black text-[#ffffff] uppercase tracking-tight mt-0.5 capitalize">
            {selectedMuscle.replace("_", " ")}
          </h3>
          <p className="text-xs text-[#9ca3af] italic font-serif">
            {data.latin}
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-[#18181d] border border-[#26262b] text-right">
          <span className="text-[10px] text-[#9ca3af] font-mono block">Status</span>
          <span className="text-xs font-bold font-mono text-[#ee4d00]">
            OPTIMIZED
          </span>
        </div>
      </div>

      {/* Sub-head Selector (Special attention to Chest as in the video) */}
      {selectedMuscle === "chest" && onSelectChestSubHead && (
        <div className="space-y-2 p-3 rounded-xl bg-[#18181d] border border-[#26262b]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9ca3af] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#ee4d00]" />
              <span>Target Head Isolation</span>
            </span>
            <span className="text-[10px] font-mono text-[#ee4d00] font-bold">
              {chestSubHead === "all" ? "Whole Pectoral" : `${chestSubHead.toUpperCase()} HEAD`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(["all", "upper", "mid", "lower"] as ChestSubHead[]).map((head) => (
              <button
                key={head}
                type="button"
                onClick={() => onSelectChestSubHead(head)}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  chestSubHead === head
                    ? "bg-[#ee4d00] text-white shadow-md shadow-[#ee4d00]/30"
                    : "bg-[#111114] text-[#9ca3af] hover:text-white border border-[#26262b]"
                }`}
              >
                {head}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Muscle Heads Pill Tags */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider block">
          Anatomical Subdivisions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {data.heads.map((h, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#18181d] border border-[#26262b] text-[#ffffff]"
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Biomechanical Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-[#18181d] border border-[#26262b] space-y-1">
          <span className="text-[10px] font-bold text-[#9ca3af] uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#ee4d00]" />
            <span>Primary Function</span>
          </span>
          <p className="text-xs text-[#ffffff] font-medium leading-relaxed">
            {data.primaryFunction}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#18181d] border border-[#26262b] space-y-1">
          <span className="text-[10px] font-bold text-[#9ca3af] uppercase flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#ee4d00]" />
            <span>Stimulus Vector</span>
          </span>
          <p className="text-xs text-[#ffffff] font-medium leading-relaxed">
            {data.stimulusAngle}
          </p>
        </div>
      </div>

      {/* Hypertrophy Execution Cues */}
      <div className="p-3.5 rounded-xl bg-[#ee4d00]/10 border border-[#ee4d00]/30 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ee4d00] flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Hypertrophy Execution Cues</span>
        </span>
        <ul className="space-y-1.5 text-xs text-[#d1d5db]">
          {data.hypertrophyCues.map((cue, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee4d00] mt-1.5 shrink-0" />
              <span>{cue}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
