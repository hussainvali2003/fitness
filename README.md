# ⚡ GYM X &middot; Hussain's 12-Week Biomechanical Transformation Hub

<div align="center">

![GYM X Banner](public/gymx_hero.jpg)

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R128_WebGL-049EF4?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.16-black?style=for-the-badge&logo=react&logoColor=white)](https://docs.pmnd.rs/react-three-fiber/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4_Obsidian_Dark-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-100%25_Passing-brightgreen?style=for-the-badge&logo=jest&logoColor=white)](scripts/test-logic.js)

**A state-of-the-art, hyper-realistic personal bodybuilding & fitness web application engineered for daily gym execution, 3D anatomical biomechanics, slow-motion form guidance, deterministic progressive overload, and 12-week body recomposition tracking.**

[Live Demo](http://localhost:3000) &bull; [Architecture & System Flows](ARCHITECTURE_AND_FLOWS.md) &bull; [Exercise Encyclopedia](EXERCISES.md) &bull; [Changelog](CHANGELOG.md)

</div>

---

## 📋 Executive Overview

**GYM X** transforms conventional fitness logging into an interactive, high-tech athletic command center. Designed with an **ultra-premium Obsidian Dark aesthetic** (`#08080a` obsidian, `#111114` dark matte charcoal, `#26262b` border, and `#ee4d00` fiery orange neon), the platform integrates a real-time **3D Human Anatomy Engine**, **29 high-definition looping exercise GIF tutorials**, and automated biomechanical form cues for all 23 exercises across a rigorous 5-day hypertrophy program.

### Key Metrics & Targets for Hussain
- **Starting Weight**: 82.0 kg &rarr; **Current Weight**: 79.8 kg &rarr; **Target Weight**: 70.0 kg
- **Calorie Budget**: 1,850 kcal/day (40% Protein, 35% Carb, 25% Fat)
- **Protein Target**: 125g &ndash; 140g/day
- **Hydration**: 3.0 Liters/day
- **Daily Activity**: 10,000 Steps/day
- **Sleep Target**: 7.5 Hours/night

---

## 🌟 Core System Modules

### 1. 🦾 3D Live Biomechanics Stage (`HumanBodyCanvasHQ`)
- **Real-Time 3D Musculoskeletal Model**: Built with `@react-three/fiber` and Three.js, rendering realistic human anatomical proportions with distinct, organic muscle groups:
  - **Chest**: Clavicular (Upper), Sternal (Mid-Pec), and Costal (Lower) heads.
  - **Deltoids**: Anterior, Lateral, and Posterior heads with 3-dimensional caps.
  - **Arms**: Biceps Brachii (Anterior Peak) and Triceps Brachii (Lateral, Medial, and Long Head horseshoes).
  - **Back**: Flaring Latissimus Dorsi V-taper wings, Rhomboids, and Middle Trapezius.
  - **Core**: 6-Pack Rectus Abdominis with Linea Alba trench and External Obliques.
  - **Legs**: Fully articulated Quadriceps with Vastus Medialis teardrops, Hamstrings, and Gastrocnemius Calves.
- **Dynamic 3D Equipment Models**:
  - Olympic Barbell with knurled bar and 20kg GYM X fiery orange rimmed plates.
  - Hex Dumbbells with chrome knurled handles and weighted rubber heads.
  - Dual Cable Crossover Pulleys with overhead crossbars and tension wires.
  - Wide Grip Lat Pulldown Bar and angled grips.
  - 45-Degree Incline Leg Press Sled with dual sliding plate horns.
  - Flat Gym Bench with leather padding and steel subframes.
  - Overhead Pull-up Rig for hanging core exercises.
- **Interactive Stage Controls**: 360° touch/mouse orbit controls, camera presets (`Front`, `Back`, `Side`, `Chest Zoom`, `Core`, `Legs`), play/pause state toggle, and variable playback speeds (0.5x, 1x, 2x).

### 2. 🎬 29 HQ Biomechanical Looping Animations
- **Zero Broken Image Architecture**: Every single exercise card across all 5 workout days is backed by a custom-rendered, high-fidelity GIF loop with bulletproof SVG fallback error handling.
- **Slow, Form-Focused Cadence ("thora slowly slowly")**: Each animation runs at **~115ms per frame (~3.22 seconds per rep cycle)**, providing crystal-clear visualization of:
  - **Eccentric Stretch (3s)**: Controlled lowering with angle guides (`45° Tuck`, `90° Knee Angle`, `Hip Hinge`).
  - **Isometric Bottom Pause (1s)**: Peak stretch with deep tendon safety alignment.
  - **Concentric Explosion (1s)**: High-force acceleration through target levers.
  - **Peak Contraction Squeeze (1s)**: Agonist muscle bellies ignite with multi-layered `#ee4d00` neon bloom.
- **Instructional HUD Overlays**:
  - **Top Bar**: GYM X 3D HD Badge, Exercise Title, and real-time **Active Tension** progress meter.
  - **Bottom Bar**: Target Muscle Agonist, exact Biomechanical Form Cue, and real-time Rep Phase.

### 3. ⚡ 5-Day Hypertrophy Program
| Day | Split | Primary Focus Muscles | Total Exercises | Estimated Time | Finisher |
|:---|:---|:---|:---:|:---:|:---|
| **Monday** | **PUSH** | Chest, Front Delts, Side Delts, Triceps | 8 Exercises | 60 min | 10 min 12% Incline Treadmill (4.5 km/h) |
| **Tuesday** | **PULL** | Lats, Mid-Back, Rear Delts, Biceps, Core | 9 Exercises | 60 min | 10–15 min Brisk Recovery Walk |
| **Wednesday** | **LEGS + CORE** | Quads, Hamstrings, Calves, Abdominals | 7 Exercises | 55 min | Gentle Recovery Stroll (No HIIT) |
| **Thursday** | **UPPER BODY** | Clavicular Chest, Lats, Deltoids, Arms | 8 Exercises | 60 min | 10–15 min Incline Walking |
| **Friday** | **LOWER + COND** | Quad Hypertrophy, Calves, 3-Round HIIT | 4 Exercises | 55 min | 3 Rounds: Jumping Jacks, High Knees, Mountain Climbers |
| **Saturday** | **ACTIVE RECOVERY** | Full Body Mobility, Hydration | &mdash; | &mdash; | 10k Steps Walk + Water Goal |
| **Sunday** | **REST & REVIEW** | CNS Deload, Weekly Check-in | &mdash; | &mdash; | 7-Day Average Weight Analysis |

### 4. 📈 Deterministic Progressive Overload Engine
- Eliminates guesswork by enforcing scientific double progression:
  - If target rep range is achieved across all sets &rarr; **Increase load (+2.5 kg for compounds, +2.0 kg for isolations)**.
  - If top sets fall below ceiling &rarr; **Maintain load and add repetitions until ceiling is hit**.
  - If reps regress significantly &rarr; **Flag fatigue warning, recommend CNS recovery or form reset**.

### 5. 🏋️‍♂️ Live Gym Session Logger
- Large numeric touch steppers optimized for sweaty gym fingers (`[-] 30kg [+]`, `[-] 10 reps [+]`).
- Auto-countdown rest timers with visual progress bars and audio chimes (60s, 90s, 120s, 150s).
- Previous set comparison indicators (`vs last: 28kg x 10 (+2kg PR!)`).
- Full offline persistence via LocalStorage: sessions persist across page refreshes, tab switches, and mobile network dropouts.

### 6. 📊 360° Health & Body Recomposition Suite
- **Body Weight & Circumferences**: 7-day rolling moving averages, weekly weight trend deltas, and multi-point tape measurements (Waist, Chest, Arms, Thighs, Hips, Neck).
- **Nutrition & Macros**: Daily target progress (1,850 kcal & 135g protein), dynamic meal bucket logging, and interactive food library.
- **Hydration Tracker**: Real-time fluid progress bar with quick-add buttons (+250ml, +500ml, +1000ml).
- **Sleep & Recovery**: Sleep duration, sleep quality index, and subjective CNS readiness scores (Energy, Soreness, Stress).
- **Step Cadence**: Daily 10,000 step counter with 7-day consistency bar charts.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Next.js 14 Client App / App Router]
    
    subgraph UI_Layer [Obsidian Dark UI Layer]
        Dashboard[Gym X Dashboard]
        WorkoutEngine[Workout Routine & 3D Stage]
        ActiveSession[Live Workout Logger & Rest Timer]
        NutritionTracker[Macro & Water Rings]
        RecoveryHub[Sleep & Readiness Metrics]
    end

    subgraph 3D_Biomechanics [3D Biomechanics Engine]
        R3FCanvas[HumanBodyCanvasHQ / Three.js Canvas]
        Kinematics[ExerciseBiomechanicsAnimator Engine]
        HumanModel[RealisticHumanModel & Dynamic Shaders]
        Equipment3D[Barbells / Dumbbells / Sled / Cables]
    end

    subgraph Media_Engine [Visual Media Engine]
        GIFEngine[29 HQ Looping Animated GIFs]
        StudioHUD[Active Tension & Angle Cues]
        ErrorFallback[SVG Biomechanical Fallback Guard]
    end

    subgraph Data_Layer [Data & Persistence Layer]
        SeedData[Deterministic Exercise & Program Seed Data]
        LocalStorageSync[Client LocalStorage Engine]
        PrismaORM[Prisma Client ORM]
        SupabaseDB[(Supabase PostgreSQL Free Tier)]
    end

    Client --> UI_Layer
    WorkoutEngine --> 3D_Biomechanics
    WorkoutEngine --> Media_Engine
    3D_Biomechanics --> Kinematics
    Kinematics --> HumanModel
    Kinematics --> Equipment3D
    UI_Layer --> Data_Layer
    Data_Layer --> PrismaORM
    PrismaORM --> SupabaseDB
```

---

## 📁 Repository Directory Structure

```
fitness/
├── public/                                  # Static media & exercise animations
│   ├── exercises/                           # 29 HQ Looping Exercise GIFs (All 23 exercises + aliases)
│   │   ├── bench_press.gif
│   │   ├── incline_db_press.gif
│   │   ├── machine_chest_press.gif
│   │   ├── cable_fly.gif
│   │   ├── lat_pulldown.gif
│   │   ├── leg_press.gif
│   │   ├── romanian_deadlift.gif
│   │   └── ... (29 total verified GIF files)
│   ├── gymx_hero.jpg                        # GYM X Hero Banner asset
│   ├── sadique_hero.gif                     # Sadique Amin transformation GIF
│   └── gymx_sadique_duo.gif                 # Side-by-side athlete comparison
├── prisma/
│   └── schema.prisma                        # Database schema (Workouts, Sets, Profiles, Macros)
├── scripts/
│   ├── generate_all_23_exercise_gifs.py     # Python PIL animation engine (Slow & educational)
│   ├── verify_exercise_assets.py            # Automated asset completeness verifier
│   └── test-logic.js                        # Double-progression & 1RM automated test suite
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # Dark obsidian layout shell & navigation
│   │   ├── page.tsx                         # Dashboard with hero toggle & quick metrics
│   │   ├── globals.css                      # GYM X design system tokens & animations
│   │   ├── workout/
│   │   │   ├── page.tsx                     # Workout overview with 3D Live Stage & Cards
│   │   │   └── active/page.tsx              # Live Session execution with rest timers
│   │   ├── exercises/                       # Searchable exercise database & guides
│   │   ├── muscle-map/                      # Interactive full-body 3D muscle heatmap
│   │   ├── program/                         # 12-Week progression roadmap
│   │   ├── body/                            # Weight, circumferences & 7-day rolling avg
│   │   ├── nutrition/                       # Macros, meal buckets & hydration
│   │   ├── steps/                           # 10k step tracker & activity charts
│   │   ├── recovery/                        # Sleep logs & CNS readiness ratings
│   │   ├── history/                         # Past sessions & volume progression
│   │   ├── goals/                           # Milestones & PR badges
│   │   └── settings/                        # Profile configuration & data export/import
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── RealisticHumanModel.tsx      # Multi-muscle human anatomy with glowing shaders
│   │   │   ├── ExerciseBiomechanicsAnimator.tsx # Kinematic joint physics & 3D equipment
│   │   │   ├── HumanBodyCanvasHQ.tsx        # Camera controls, preset angles & R3F canvas
│   │   │   └── FallbackBody2D.tsx           # Scalable 2D SVG fallback
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                  # Desktop navigation with badges
│   │   │   ├── BottomNav.tsx                # Mobile bottom navigation bar
│   │   │   └── Header.tsx                   # Top status bar & user profile trigger
│   │   └── workout/
│   │       ├── ExerciseSetRow.tsx           # Weight/rep stepper components
│   │       ├── RestTimerModal.tsx           # Auto-countdown gym rest timer
│   │       └── WorkoutSummaryModal.tsx      # Post-session celebration & PR recap
│   ├── lib/
│   │   ├── seedData.ts                      # Canonical exercise & 12-week program data
│   │   └── storage.ts                       # LocalStorage & Supabase sync layer
│   └── types/
│       └── index.ts                         # Strict TypeScript domain interfaces
├── tailwind.config.ts                       # GYM X color tokens & custom animations
├── tsconfig.json                            # TypeScript strict mode configuration
└── package.json                             # Dependencies & scripts
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm** or **yarn** / **pnpm**
- **Python 3.10+** (optional, only needed if re-generating exercise GIFs)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/hussainvali2003/fitness.git
cd fitness
npm install
```

### 2. Configure Environment Variables (Optional for Cloud Sync)
Create a `.env.local` file in the root directory:
```env
# Optional Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
```
> **Note**: GYM X operates with **100% functionality in offline mode** using local state and LocalStorage sync. Cloud credentials are only needed if you wish to sync across multiple remote devices.

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience GYM X.

---

## 🧪 Testing & Quality Assurance

GYM X includes automated test suites covering algorithm math, data integrity, and asset verification:

### Automated Unit Tests
```bash
npm run test
```
Verifies:
- 1RM Epley calculations (`Weight * (1 + Reps / 30)`).
- Double progression recommendation triggers (+2.5kg load increase upon meeting rep ceilings).
- Rep maintenance rules when falling below target range.
- 7-day rolling weight moving averages.

### TypeScript Strict Compilation
```bash
npx tsc --noEmit
```
Ensures 0 syntax, typing, or compilation errors across all pages and 3D components.

### Exercise Asset Verification
```bash
python scripts/verify_exercise_assets.py
```
Validates that every single exercise in the 5-day split has a valid, non-zero GIF animation on disk.

---

## 🎨 Design System & Color Tokens

| Token Name | Hex Code | Usage | Preview |
|:---|:---|:---|:---:|
| **Obsidian** | `#08080a` | Global App Background, Stage Cavity | `■` |
| **Matte Charcoal** | `#111114` | Card Backgrounds, Subsections, Sidebars | `■` |
| **Border Gray** | `#26262b` | Section Dividers, Card Outlines | `■` |
| **Fiery Orange** | `#ee4d00` | Primary CTA, Active Tension, Agonist Muscle Glow | `■` |
| **Bright Orange** | `#ff5500` | Button Hover States, Interactive Badges | `■` |
| **Pure White** | `#ffffff` | Primary Headings, Stat Digits | `■` |
| **Neutral Muted** | `#a1a1aa` | Form Cues, Subtitles, Secondary Text | `■` |

---

## 📄 License & Attribution

- **Creator & Athlete**: Hussain Vali
- **Transformation Model**: MD Sadique Amin
- **Design System**: GYM X Athletic Obsidian
- **License**: MIT License &bull; Free for personal fitness tracking and adaptation.
