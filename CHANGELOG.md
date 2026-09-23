# 📝 GYM X &middot; Changelog & Release History

All notable changes to the **GYM X** personal bodybuilding and transformation platform are documented in this file. The project adheres to [Semantic Versioning](https://semver.org/).

---

## [2.0.0] &ndash; 2026-09-23

### 🚀 Major Breakthrough: 23-Exercise HQ Animated Loop Overhaul & 3D Stage Expansion
- **Zero Broken Image Architecture**:
  - Engineered and executed `scripts/generate_all_23_exercise_gifs.py` rendering 29 high-definition looping exercise GIF tutorials (~110–168 KB each).
  - Generated dedicated animations for all 15 previously missing Pull, Leg, and Core movements (Lat Pulldown, T-Bar Row, Seated Cable Row, Straight Arm Pulldown, Reverse Pec Deck, Bicep Curl, Hammer Curl, Cable Crunch, Knee Raise, 45° Leg Press, RDL, Leg Extension, Hamstring Curl, Calf Raise, Plank).
  - Resolved all naming mismatches between `seedData.ts` IDs and filenames (`cable_fly`, `lateral_raise`, `shoulder_press`, `triceps_pushdown`, `overhead_triceps_ext`, `rdl`).
  - Added dynamic `onError` fallback handling in `src/app/workout/page.tsx` with animated biomechanical badges.
- **Slow, Educational Movement Cadence ("thora slowly slowly dikhna chahia")**:
  - Calibrated rep tempo to 115ms/frame (28 frames = ~3.22 seconds per rep cycle).
  - Integrated real-time Angle Guides (`45° Tuck`, `90° Parallel`, `Hip Hinge`, `Pelvic Tilt`, `90° Sled Depth`).
  - Top Active Tension HUD with real-time progress bar.
  - Bottom HUD showing Target Muscle Agonist, exact Biomechanical Form Cue, and current Rep Phase (`ECCENTRIC 3s STRETCH`, `ISOMETRIC PAUSE`, `CONCENTRIC DRIVE`, `PEAK CONTRACTION`).
- **3D Live Biomechanics Stage Upgrade**:
  - Expanded `RealisticHumanModel.tsx` with lower body leg joint articulation (`leftLegRef`, `rightLegRef`) for dynamic squats, leg presses, deadlifts, and calf raises.
  - Added dedicated glowing muscle geometries for Biceps Brachii, Latissimus Dorsi V-Taper wings, Quadriceps, Hamstrings, and Calves.
  - Added 3D equipment models: Olympic Barbell with orange plates, Hex Dumbbells, Cable Pulleys, Lat Pulldown Bar, 45° Incline Leg Press Sled with dual 20kg plates, Flat Bench, and Pull-up Rig.
- **Automated Test Suite Expansion**:
  - Created `scripts/verify_exercise_assets.py` to programmatically verify that all 23 exercise IDs in `seedData.ts` possess verified, non-empty GIF files.

---

## [1.2.0] &ndash; 2026-09-23

### 🎨 GYM X Dribbble Obsidian Redesign & Transformation Hero
- **Color System Overhaul**:
  - Replaced generic emerald and cyan tones with exact GYM X Dribbble sampled palette:
    - Obsidian Background (`#08080a`)
    - Dark Matte Charcoal (`#111114`)
    - Border Gray (`#26262b`)
    - Fiery Neon Orange (`#ee4d00`)
- **Realistic Human Anatomy Viewer (`RealisticHumanModel.tsx`)**:
  - Replaced low-poly mesh with realistic muscular human silhouette featuring 3-tier pectorals, 3-headed deltoid caps, serratus anterior, 6-pack abs, and teardrop vastus medialis.
- **Sadique Amin Transformation Hero**:
  - Added toggleable dashboard hero showcasing Sadique Amin's physique transformation with side-by-side GYM X comparison.

---

## [1.0.0] &ndash; 2026-09-22

### 🎉 Initial Release
- **Next.js 14 App Router Architecture**:
  - Fast, modular React server and client components with Tailwind CSS and TypeScript strict mode.
- **Deterministic Progressive Overload Engine**:
  - Double progression logic enforcing scientific +2.5kg compound and +2.0kg isolation load increments.
- **5-Day Hypertrophy Program**:
  - Monday Push, Tuesday Pull, Wednesday Legs + Core, Thursday Upper Body, Friday Lower + Conditioning, and Weekend Recovery.
- **Live Workout Logger & Gym Rest Timer**:
  - Large numeric steppers, previous workout comparisons, LocalStorage sync, and auto-countdown rest chime.
- **Comprehensive Body Tracking**:
  - Body weight, 7-day rolling moving averages, body girth circumferences, nutrition & macro rings, water intake, sleep quality, and 10k step counter.
