# Plan: Cloud Flood Transition + Projects Page

**Objective:** Add a bouncing arrow to the hero page. Clicking it triggers a flood of kawaii clouds rushing upward to cover the screen, then transitions to a projects page built on the ProjectShowcase component. Two-page SPA with no router — pure React state machine.

**Branch:** Direct-to-main
**Mode:** Direct (edit-in-place)

---

## What's Being Built

```
Page 1: KawaiiHero (existing)
  └── BouncingArrow (new) — sits below scene, bounces idle
        ↓ click
   CloudFlood overlay (new) — clouds rush up from bottom, full-pixel coverage
        ↓ at t=600ms (screen covered)
Page 2: ProjectsPage (new)
  └── placeholder bubbly background (pastel gradient)
  └── ProjectShowcase component (from 21st.dev reference)
```

---

## Infrastructure Gap: Tailwind CSS Required

**Current state:** Vite + React + TypeScript only. No Tailwind, no `@` path alias, no `lucide-react`.

**Why this matters:** The ProjectShowcase component uses Tailwind utility classes (`text-muted-foreground`, `bg-secondary`, `border-border`, etc.) and shadcn CSS variable tokens. Without Tailwind those classes are inert strings — the component renders unstyled.

**We do NOT need the full shadcn CLI.** We need only:
1. Tailwind v4 installed + Vite plugin
2. shadcn-compatible CSS variables defined manually in `index.css`
3. `@` path alias in vite.config.ts + tsconfig.app.json

---

## Animation Sequence

```
t=0      Hero visible. BouncingArrow bounces at bottom-center.
t=click  flooding=true. CloudFlood overlay mounts above everything.
t=0.0s   First row of clouds appears at bottom, rushing upward.
t=0.1s   Cloud grid (3 cols × N rows) animating translateY from +100vh → -120vh
t=0.6s   All clouds above mid-screen — hero is fully covered by kawaii sky flood.
t=0.6s   page state flips to 'projects'. ProjectsPage renders beneath overlay.
t=0.8s   Clouds continue off the top. Projects page bleeds into view.
t=1.0s   Overlay unmounts. Projects page is fully visible.
```

**Cloud flood technique — grid fill:**
- A `position:fixed; inset:0` container with `background:#A8C8F0` (sky blue — matches the cloud PNG bg when using screen blend)
- Inside: CSS grid, 3 columns, rows auto-sized to fit, enough to be 2× viewport height
- Each cloud img: `mix-blend-mode: screen` (black bg disappears on the sky-blue container)
- Entire grid animates `translateY(110vh → -130vh)` over 1.0s with `ease-in`
- At t=600ms: page switch fires (via `setTimeout`)

---

## Files Changed

| File | Change |
|---|---|
| `package.json` | + `tailwindcss`, `@tailwindcss/vite`, `lucide-react` |
| `vite.config.ts` | + Tailwind plugin + `@` alias |
| `tsconfig.app.json` | + `paths: { "@/*": ["./src/*"] }` |
| `src/index.css` | + `@import "tailwindcss"` + shadcn CSS vars + `@theme` block |
| `src/App.tsx` | Two-page state machine |
| `src/App.css` | + `@keyframes arrowBounce` + `.bouncing-arrow` class |
| `src/components/BouncingArrow.tsx` | New — bouncing chevron-down button |
| `src/components/CloudFlood.tsx` | New — full-screen cloud grid rush animation |
| `src/components/ProjectsPage.tsx` | New — placeholder bg + ProjectShowcase |
| `src/components/ui/project-showcase.tsx` | New — pasted from reference, `"use client"` removed |

---

## Step 1 — Install Dependencies

**Context:** No Tailwind or lucide-react in the project. Tailwind v4 uses a Vite plugin (not PostCSS) and a single CSS `@import` instead of `@tailwind` directives.

```bash
npm install tailwindcss @tailwindcss/vite lucide-react
```

**Verification:** `node_modules/tailwindcss` exists; `node_modules/lucide-react` exists

---

## Step 2 — Configure Vite + TypeScript Path Alias

**Context:** The ProjectShowcase component imports from `@/components/ui/...`. The `@` alias must be configured in both Vite (for bundling) and TypeScript (for type checking). Currently neither is set.

**`vite.config.ts` — full rewrite:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**`tsconfig.app.json` — add to `compilerOptions`:**
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

**Verification:** `npx tsc --noEmit` passes (no "Cannot find module '@/...'" errors)

---

## Step 3 — Configure Tailwind + shadcn CSS Variables in index.css

**Context:** Tailwind v4 initializes via a single CSS `@import "tailwindcss"` at the top of the stylesheet. Custom color tokens for shadcn are defined using `@theme` (Tailwind v4 syntax) pointing to CSS custom properties. The properties themselves use HSL values — no `oklch`, no color functions in the values themselves.

**Replace the `:root` block in `index.css` and add Tailwind import + theme block:**

```css
@import "tailwindcss";

/* ── Tailwind theme — maps shadcn CSS var names to Tailwind utilities ── */
@theme {
  --color-background:       hsl(var(--background));
  --color-foreground:       hsl(var(--foreground));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-secondary:        hsl(var(--secondary));
  --color-border:           hsl(var(--border));
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* ── Kawaii palette (existing) ──────────────────── */
  --sky:         #A8C8F0;
  --cloud:       #F5EFFF;
  --candy-pink:  #F9C5D1;
  --cinna-blue:  #87CEEB;
  --heart-pink:  #FFB3D9;
  --text-dark:   #4a3f5c;

  --font-display: 'Pacifico', cursive, system-ui, sans-serif;
  --font-body:    'Nunito', system-ui, sans-serif;

  --spring-kawaii: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-gentle: cubic-bezier(0.25, 1.08, 0.65, 1);

  /* ── shadcn tokens — for ProjectShowcase ────────── */
  /* Light mode (used on projects page) */
  --background:       220 40% 97%;   /* near-white with lavender tint */
  --foreground:       240 15% 18%;   /* dark purple-grey */
  --muted-foreground: 240 10% 52%;   /* mid-grey */
  --secondary:        220 25% 90%;   /* soft periwinkle for hover bg */
  --border:           220 18% 84%;   /* subtle border */

  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ... rest of existing index.css rules unchanged ... */
```

**Why `hsl(var(--background))` not `var(--background)`:**
Tailwind v4's `@theme` resolves colors at build time. The CSS variable holds the raw HSL values (`220 40% 97%`) without the `hsl()` wrapper, which is the shadcn convention. The wrapper is added in `@theme`.

**Verification:** `npm run build` exits 0; browser shows Tailwind utility classes applying correctly

---

## Step 4 — Add Keyframes + Arrow CSS to App.css

**Context:** App.css owns all custom animation keyframes. Add the `arrowBounce` keyframe and `.bouncing-arrow` class here, keeping it consistent with the existing pattern.

```css
/* Arrow bounce */
@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(10px); }
}

.bouncing-arrow {
  position: absolute;
  bottom: clamp(1.5rem, 5vh, 3rem);
  left: 50%;
  translate: -50% 0;
  z-index: 10;
  background: none;
  border: none;
  cursor: pointer;
  animation: arrowBounce 1.4s ease-in-out infinite;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(255,255,255,0.6));
  transition: opacity 0.2s ease;
  padding: 0.5rem;
}

.bouncing-arrow:hover {
  opacity: 0.75;
}
```

---

## Step 5 — Create BouncingArrow.tsx

**Context:** Pure presentational component. Renders a Lucide `ChevronDown` icon inside a `<button>`. The parent (`App.tsx`) passes the `onClick` handler.

```tsx
import { ChevronDown } from 'lucide-react'

interface BouncingArrowProps {
  onClick: () => void
}

export default function BouncingArrow({ onClick }: BouncingArrowProps) {
  return (
    <button
      className="bouncing-arrow"
      onClick={onClick}
      aria-label="Scroll to projects"
    >
      <ChevronDown size={40} strokeWidth={2.5} />
    </button>
  )
}
```

---

## Step 6 — Create CloudFlood.tsx

**Context:** Full-screen overlay that animates a grid of kawaii cloud images rushing upward. Mounts above everything (z-index 50). The cloud PNG (`cloud-kawaii.png`) has a black background — `mix-blend-mode: screen` on a sky-blue container makes black invisible, showing only the cloud pixels.

**Grid sizing logic:**
- Each cloud image is rendered at `~40vw` wide (so 3 columns = 120vw, guaranteed horizontal coverage)
- Rows: enough to fill 2.3× viewport height (so the grid starts fully below and ends fully above)
- Total images: 3 cols × 5 rows = 15 (plenty for full coverage, lightweight)

```tsx
import cloudKawaii from '../assets/cloud-kawaii.png'

interface CloudFloodProps {
  onComplete: () => void
}

const COLS = 3
const ROWS = 5

export default function CloudFlood({ onComplete }: CloudFloodProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        backgroundColor: '#A8C8F0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          width: '110%',
          marginLeft: '-5%',
          animation: 'cloudRush 1.05s ease-in forwards',
        }}
        onAnimationEnd={onComplete}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <img
            key={i}
            src={cloudKawaii}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: 'auto',
              mixBlendMode: 'screen',
              display: 'block',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

**`@keyframes cloudRush` in App.css:**
```css
@keyframes cloudRush {
  0%   { transform: translateY(110vh); }
  100% { transform: translateY(-140vh); }
}
```

**`onComplete` timing:** fires when the animation ends (~1.05s). By this time the grid has passed fully off the top of the screen. The parent switches `flooding=false` in the callback, which unmounts the overlay and reveals the projects page that was already rendered beneath.

**Why not `onAnimationEnd` for the page switch:** The page switch (hero → projects) happens at `t=600ms` via `setTimeout` inside the click handler — halfway through the animation, when clouds have covered the screen. The `onAnimationEnd` callback only cleans up the overlay after the clouds are gone.

---

## Step 7 — Create src/components/ui/project-showcase.tsx

**Context:** Pasted verbatim from the reference, with two modifications:
1. Remove `"use client"` — it's a Next.js directive, not valid in Vite (TypeScript strict mode would treat it as an unused expression)
2. The `style` prop uses `scale` as a CSS property string — valid in React 19

**Full file:** Paste the component code exactly as provided, minus the `"use client"` first line.

**Note on `"use client"` removal:** In Vite/React, this string at the top of a file is a no-op expression. With `noUnusedLocals` off it compiles, but with `strict: true` it may trigger a lint warning. Remove it cleanly.

---

## Step 8 — Create ProjectsPage.tsx

**Context:** Second page of the app. Placeholder background: animated pastel gradient (soft lavender + pink bubbles feel — a full design pass is deferred until the user picks the final background). ProjectShowcase is centered on top.

```tsx
import { ProjectShowcase } from './ui/project-showcase'

export default function ProjectsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8d5f5 0%, #d5e8f5 50%, #f5d5e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <ProjectShowcase />
    </div>
  )
}
```

**Placeholder background rationale:** Soft tricolor pastel gradient — lavender/sky/pink — matches the kawaii palette and gives the ProjectShowcase component a readable surface while the final background is decided.

---

## Step 9 — Rewrite App.tsx (State Machine)

**Context:** App owns the page state and the flood trigger. Structure:
- `page`: `'hero' | 'projects'`
- `flooding`: `boolean`
- `handleArrowClick`: sets flooding=true, after 600ms sets page='projects'
- `handleFloodComplete`: sets flooding=false (called by CloudFlood.onComplete)

Both pages are kept mounted while flooding (so projects page is already rendered when clouds uncover it), but only the active page is visible via `display` or opacity. Actually, simpler: just render both pages, projects is behind the flood overlay, hero is behind the flood overlay too. Once flood completes, conditionally render only the active page.

```tsx
import { useState } from 'react'
import KawaiiHero from './components/KawaiiHero'
import BouncingArrow from './components/BouncingArrow'
import CloudFlood from './components/CloudFlood'
import ProjectsPage from './components/ProjectsPage'
import CursorDot from './components/CursorDot'
import Confetti from './components/Confetti'
import './App.css'

type Page = 'hero' | 'projects'

function App() {
  const [page, setPage] = useState<Page>('hero')
  const [flooding, setFlooding] = useState(false)

  function handleArrowClick() {
    if (flooding) return
    setFlooding(true)
    setTimeout(() => setPage('projects'), 600)
  }

  function handleFloodComplete() {
    setFlooding(false)
  }

  return (
    <>
      <CursorDot />
      {page === 'hero' && !flooding && <Confetti />}

      {page === 'hero' && (
        <>
          <KawaiiHero />
          <BouncingArrow onClick={handleArrowClick} />
        </>
      )}

      {page === 'projects' && <ProjectsPage />}

      {flooding && <CloudFlood onComplete={handleFloodComplete} />}
    </>
  )
}

export default App
```

---

## Step 10 — Final Build Verification

```bash
npx tsc --noEmit   # must pass with 0 errors
npm run build      # must exit 0
```

Visual checks:
- [ ] Bouncing arrow visible on hero page, below Cinnamoroll
- [ ] Arrow click triggers cloud flood from bottom
- [ ] Clouds cover entire screen (no gaps at edges)
- [ ] Projects page reveals after clouds clear
- [ ] ProjectShowcase hover effects work (image thumbnail follows cursor)
- [ ] Placeholder gradient background on projects page

---

## Dependency Graph

```
Step 1 (install)        ──→  ALL subsequent steps
Step 2 (vite/ts alias)  ──→  Step 7 (@/components/ui import)
Step 3 (tailwind css)   ──→  Step 7 (utility classes work)
Step 4 (App.css)        ──→  Step 5 (BouncingArrow class) + Step 6 (cloudRush keyframe)
Step 5 (BouncingArrow)  ──→  Step 9 (App.tsx imports it)
Step 6 (CloudFlood)     ──→  Step 9 (App.tsx imports it)
Step 7 (ProjectShowcase)──→  Step 8 (ProjectsPage imports it)
Step 8 (ProjectsPage)   ──→  Step 9 (App.tsx imports it)
Steps 1–9               ──→  Step 10 (verification)
```

**Parallel:** Steps 5, 6, 7, 8 can all be written simultaneously after Steps 1-4.

---

## Rollback

```bash
git stash
```

All current code is safe in git history.
