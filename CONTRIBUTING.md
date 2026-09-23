# 🤝 Contributing to GYM X

Thank you for your interest in contributing to **GYM X**! This repository follows clean, production-grade engineering principles, strict TypeScript typing, deterministic algorithms, and high-fidelity 3D biomechanics.

---

## 🛠️ Development Workflow

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Python**: `3.10+` with `PIL` (Pillow) and `numpy` (if modifying or adding exercise GIF animations)

### 2. Fork & Branch Convention
1. Clone the repository:
   ```bash
   git clone https://github.com/hussainvali2003/fitness.git
   cd fitness
   ```
2. Create a feature branch following the naming standard:
   - `feat/feature-name` &mdash; New features (e.g. `feat/seated-calf-3d`)
   - `fix/bug-name` &mdash; Bug fixes (e.g. `fix/rest-timer-chime`)
   - `refactor/area-name` &mdash; Code improvements (e.g. `refactor/kinematics-lerp`)
   - `docs/topic-name` &mdash; Documentation updates (e.g. `docs/api-guide`)

---

## 🧪 Testing Requirements

Before proposing any pull request or committing code, all three validation gates must pass:

### 1. TypeScript Strict Type-Check
```bash
npx tsc --noEmit
```
Must complete with **0 errors**. No `any` escapes without explicit architectural rationale.

### 2. Logic & Progressive Overload Test Suite
```bash
npm run test
```
Validates the double progression engine, 1RM Epley equations, and rolling averages.

### 3. Exercise Asset Verification
```bash
python scripts/verify_exercise_assets.py
```
Validates that every `exerciseId` in `src/lib/seedData.ts` has a corresponding verified `.gif` file in `public/exercises/`.

---

## 🎨 Design System Rules

All new UI components MUST adhere strictly to the GYM X Obsidian Dark Design System:

| Color Token | Value | Strict Rule |
|:---|:---|:---|
| `bg-obsidian` | `#08080a` | Background for app layout, cavities, and 3D canvases. |
| `bg-card` | `#111114` | Background for cards, modals, and sidebar panels. |
| `border-subtle` | `#26262b` | Section outlines and card borders. |
| `text-accent` | `#ee4d00` | Primary actions, CTAs, active tension bars, and glowing muscles. |
| **Prohibited** | `#38bdf8`, `#10b981`, `#3b82f6` | Do NOT introduce arbitrary cyan, green, or blue accent tokens. |

---

## 📝 Commit Convention

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <short description>
```

**Types**:
- `feat`: A new feature (e.g., `feat(3d): add latissimus dorsi v-taper wings`)
- `fix`: A bug fix (e.g., `fix(workout): resolve 404 on cable fly GIF`)
- `docs`: Documentation updates (e.g., `docs(readme): add 3D stage architecture diagram`)
- `style`: Visual aesthetic or formatting changes (e.g., `style(theme): apply fiery orange accent`)
- `refactor`: Code refactoring without behavior changes
- `test`: Adding or updating automated tests
