# Apex Fitness &middot; Hussain's 12-Week Transformation Dashboard

A production-grade, personal fitness tracking web application engineered for daily gym use, progressive overload tracking, 3D human muscle anatomy visualization, macro/water/sleep tracking, and 12-week body transformation roadmapping.

---

## 1. Features & Highlights

- **Dynamic 5-Day Workout System**: Tailored for Hussain's 5-day split:
  - **Monday (Push)**: Chest + Shoulders + Triceps + Incline Cardio Finisher
  - **Tuesday (Pull)**: Back + Biceps + Core + Cardio
  - **Wednesday (Legs + Core)**: Quads + Hamstrings + Calves + Core
  - **Thursday (Upper Body)**: Incline Press, Lat Pulldowns, Rows, Delts & Arms
  - **Friday (Lower + Conditioning)**: Leg Press, Hamstrings, Calves + 3-Round HIIT Conditioning
  - **Saturday & Sunday**: Active Recovery, Hydration & Weekly Sunday Review
- **Dedicated Live Workout Logger**:
  - Focus-optimized gym interface with large numeric steppers (`[-] 30kg [+]`, `[-] 8 reps [+]`).
  - Automatically recalls and compares against previous workout performance.
  - Interactive auto-countdown rest timer (60s, 90s, 150s) with audio chime.
  - In-flight autosave to LocalStorage (immune to browser refreshes & gym dead-zones).
- **Rule-Based Progressive Overload Engine**:
  - Deterministic double-progression model recommending exact loads (+2.5kg / +2.0kg) or rep targets.
  - Transparent explanations with no fake AI claims.
- **Interactive 3D Human Body & Muscle Visualizer**:
  - Built with **Three.js & React Three Fiber**.
  - OrbitControls (rotate, zoom, pan, Front view, Back view, Reset camera).
  - Dynamic highlight materials for Primary muscle (glowing emerald), Secondary muscles (vivid cyan), and inactive muscles (obsidian).
  - Interactive 2D SVG Anatomical fallback for quick inspections and mobile devices.
- **Full Health & Habit Tracking Suites**:
  - **Body Weight & Girth**: Daily logging with 7-day moving averages and circumference delta trackers (Waist, Chest, Arms, Thighs, Hips, Neck).
  - **Nutrition & Macros**: 1,850 kcal & 135g protein targets with pre-seeded gym food library and meal buckets.
  - **Water Tracker**: Circular progress ring with quick-add buttons (+250ml, +500ml, +1L).
  - **Sleep Tracker**: Duration calculation, bedtime/wake-time logs, and quality ratings.
  - **Recovery & Readiness**: Subjective ratings (Energy, Soreness, Stress) to determine CNS readiness.
  - **Daily Steps**: 10,000 steps target with weekly consistency charts.
- **Supabase Free Tier & Vercel Ready**:
  - Fully compatible with Supabase Free PostgreSQL and Prisma ORM.
  - Zero-config local offline storage mode with 1-click JSON backup export and import.
- **Android Health Connect Abstraction**:
  - Decoupled `HealthDataProvider` interface, `ManualHealthProvider`, and `HealthConnectProvider` bridge.

---

## 2. Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript
- **Styling & Design System**: Tailwind CSS (Athletic Obsidian & Electric Emerald palette), Lucide Icons, Glassmorphism
- **3D Visualization**: [Three.js](https://threejs.org/), `@react-three/fiber`, `@react-three/drei`
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Database & ORM**: Supabase (Free Tier PostgreSQL) + Prisma ORM
- **State & Offline Storage**: LocalStorage sync & React hooks
- **Celebration Effects**: `canvas-confetti`

---

## 3. Project Structure

```
apex-fitness/
├── prisma/
│   └── schema.prisma            # Prisma schema for Supabase / PostgreSQL / SQLite
├── scripts/
│   └── test-logic.js            # Automated unit tests for progressive overload & math
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Dark athletic shell & navigations
│   │   ├── page.tsx             # Main dashboard
│   │   ├── globals.css          # Design system tokens & glassmorphism
│   │   ├── workout/
│   │   │   ├── page.tsx         # 5-day split overview & exercise sequence
│   │   │   └── active/page.tsx  # Live Workout Logger & Rest Timer mode
│   │   ├── exercises/
│   │   │   ├── page.tsx         # Searchable exercise database
│   │   │   └── [id]/page.tsx    # Exercise detail with 3D anatomy viewer
│   │   ├── muscle-map/
│   │   │   └── page.tsx         # 3D & 2D Interactive anatomical body map
│   │   ├── program/
│   │   │   └── page.tsx         # 12-Week Transformation roadmap
│   │   ├── body/
│   │   │   └── page.tsx         # Body weight, girth & 7-day average tracking
│   │   ├── nutrition/
│   │   │   └── page.tsx         # Macro logger, food library & water
│   │   ├── steps/
│   │   │   └── page.tsx         # Steps tracker & weekly charts
│   │   ├── recovery/
│   │   │   └── page.tsx         # Sleep & subjective readiness scores
│   │   ├── history/
│   │   │   └── page.tsx         # Past workout sessions & exercise details
│   │   ├── goals/
│   │   │   └── page.tsx         # Milestones & Personal Records (PRs)
│   │   └── settings/
│   │       └── page.tsx         # Profile customization, Supabase & JSON export/import
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HumanBodyCanvas.tsx  # R3F Canvas wrapper with controls
│   │   │   ├── MuscleMannequin.tsx  # 3D Mannequin geometry & muscle shaders
│   │   │   └── FallbackBody2D.tsx   # Interactive SVG anatomical fallback
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Desktop left navigation
│   │   │   ├── BottomNav.tsx        # Mobile thumb-friendly navigation
│   │   │   └── Header.tsx           # Dynamic greeting & workout resume banner
│   │   └── workout/
│   │       ├── ExerciseSetRow.tsx   # Mobile-friendly stepper row
│   │       ├── RestTimerModal.tsx   # Auto countdown rest timer
│   │       └── WorkoutSummaryModal.tsx # Celebration & PR summary modal
│   ├── lib/
│   │   ├── progressiveOverload.ts   # Double-progression engine & 1RM formulas
│   │   ├── storage.ts               # Local persistence & JSON export/import
│   │   ├── seedData.ts              # Hussain's 5-day routine & pre-seeded foods
│   │   ├── supabase.ts              # Supabase client helper
│   │   └── health/                  # Health Connect provider abstraction
│   └── types/
│       └── index.ts                 # Strong TypeScript domain definitions
└── README.md
```

---

## 4. Local Development Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Verification Tests
```bash
node scripts/test-logic.js
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Connecting Supabase Free Tier

1. Sign up for a free account at [https://supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings &rarr; Database**, copy your connection string (URI).
3. In your project `.env.local` or Vercel dashboard:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   ```
4. Push the schema to Supabase:
   ```bash
   npx prisma db push
   ```

---

## 6. Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. In the project settings, add the `DATABASE_URL` (your Supabase PostgreSQL URI) and `NEXT_PUBLIC_APP_URL`.
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js application.

---

## 7. How Progressive Overload Works

The application employs a **Double-Progression Model**:
1. **Target Bracket**: E.g., Barbell Bench Press at $3 \times 6–10$ reps with 30 kg.
2. **Rep Accumulation**: When logging sets, you aim to build reps across all 3 sets (e.g. Session 1: $8/8/7$, Session 2: $9/8/8$, Session 3: $10/9/9$).
3. **Ceiling Breakthrough**: Once you hit the top of the bracket ($10/10/10$), the engine recommends $+2.5\text{ kg}$ (e.g. 32.5 kg) for $6–8$ reps for the next session.
4. **Estimated 1RM**: Calculated deterministically via the Epley Formula:
   $$\text{1RM} = \text{Weight} \times \left(1 + \frac{\text{Reps}}{30}\right)$$

---

## 8. Android Health Connect Architecture

The application abstracts all health metrics behind the `IHealthDataProvider` interface (`src/lib/health/HealthDataProvider.ts`):
- `ManualHealthProvider`: Active out-of-the-box for web browsers.
- `HealthConnectProvider`: Prepared for wrapping the web app inside an Android Capacitor or Trusted Web Activity (TWA) shell with native Health Connect permissions (`READ_STEPS`, `READ_WEIGHT`, `READ_SLEEP`).

---

## 9. Data Sovereignty & Backups

Go to **Settings &rarr; Export JSON Backup** at any time to download your complete personal fitness records. You can restore your data on any device using **Import Backup**.
