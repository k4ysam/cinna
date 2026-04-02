# Plan: Kawaii Hero Page Rewrite

**Objective:** Replace the current dark portfolio page with a theatrical kawaii reveal — pastel sky background, Cinnamoroll drops in from the top like a curtain call, then "Samaksh" fades in below in bubbly Sanrio-matching typography.

**Branch:** `feat/kawaii-hero` (or direct-to-main since this is a full rewrite)
**Mode:** Direct (edit-in-place, no feature branch required for small project)

---

## Visual Reference

| Element | Source | Notes |
|---|---|---|
| Background | `ChatGPT Image Apr 2, 2026, 01_35_23 AM.png` | Periwinkle sky, pink/white clouds, candy elements |
| Character | `b051a706e2c60d22f748bcc824fa0606.png` | Cinnamoroll — white fluffy puppy, blue outline, pink heart |
| Palette | Extracted from images | Sky #A8C8F0, cloud #F5EFFF, candy pink #F9C5D1, Cinna-blue #4DC3FF |

---

## Animation Sequence

```
t=0s    Background fills viewport (instant, CSS)
t=0.3s  Cinnamoroll starts dropping from off-screen top
t=1.1s  Cinnamoroll settles center-stage (spring bounce completes)
t=1.3s  Name "Samaksh" fades + pops in below character
```

---

## File Structure Changes

### Move (rename for clarity)
```
ChatGPT Image Apr 2, 2026, 01_35_23 AM.png  →  src/assets/sky-bg.png
b051a706e2c60d22f748bcc824fa0606.png         →  src/assets/cinnamoroll.png
```

### Delete (replaced entirely)
```
src/components/NavBar.tsx        — theatrical reveal has no nav
src/components/HeroSection.tsx   — replaced by KawaiiHero
src/components/HeroContent.tsx   — replaced by KawaiiHero
```

### Keep & Adapt
```
src/components/CursorDot.tsx     — keep; recolor from yellow to pastel pink
src/components/Confetti.tsx      — keep; recolor burst palette to pastels
```

### Create
```
src/components/KawaiiHero.tsx    — the new theatrical reveal component
```

### Rewrite
```
src/App.tsx        — swap HeroSection for KawaiiHero
src/App.css        — all kawaii keyframes; remove old dark-theme animations
src/index.css      — full palette swap; remove blob background; add font vars
index.html         — add Google Font: Fredoka One
```

---

## Step 1 — Move Image Assets

**Context:** Images are currently in the repo root as untracked files. Vite only serves files in `src/assets/` via import, so they must be moved there.

**Tasks:**
- [ ] Copy `ChatGPT Image Apr 2, 2026, 01_35_23 AM.png` → `src/assets/sky-bg.png`
- [ ] Copy `b051a706e2c60d22f748bcc824fa0606.png` → `src/assets/cinnamoroll.png`
- [ ] Delete originals from repo root

**Verification:** `ls src/assets/` shows `sky-bg.png` and `cinnamoroll.png`

---

## Step 2 — Load Google Font in index.html

**Context:** `index.html` is the Vite entry point. Google Fonts must be loaded here (not in CSS `@import`) to avoid flash of unstyled text. **Fredoka One** was chosen because:
- Single-weight display font, extremely bubbly and rounded
- Closely matches the Sanrio/Cinnamoroll hand-drawn roundness aesthetic
- Wide, bold letterforms make the name feel playful and prominent at large sizes

**Tasks:**
- [ ] Add `<link>` preconnect + stylesheet in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
```

**Verification:** `grep -c "Fredoka" index.html` returns 1

---

## Step 3 — Rewrite index.css (global styles + palette)

**Context:** Current `index.css` is a dark theme (`oklch(12% ...)`) with animated blobs. It must be fully replaced with a light kawaii palette. The cursor dot, reduced-motion query, and base resets are preserved.

**New CSS variables (replace entire `:root` block):**
```css
:root {
  --sky:         #A8C8F0;   /* periwinkle sky — background tint */
  --cloud:       #F5EFFF;   /* soft lavender-white — text surfaces */
  --candy-pink:  #F9C5D1;   /* pulled from the cookie decoration */
  --cinna-blue:  #87CEEB;   /* Cinnamoroll's outline color */
  --heart-pink:  #FFB3D9;   /* the heart in the character image */
  --text-dark:   #4a3f5c;   /* soft purple-dark for any labels */

  --font-display: 'Fredoka One', 'Nunito', system-ui, sans-serif;
  --font-body:    'Nunito', system-ui, sans-serif;

  /* Spring easing — same token, new values tuned for kawaii bounce */
  --spring-kawaii: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-gentle: cubic-bezier(0.25, 1.08, 0.65, 1);
}
```

**Remove entirely:**
- `@property --bx1` ... `--by3` blocks
- `.bg-blobs` ruleset and `@keyframes blobDrift*`
- All `oklch(...)` color usage
- `color-scheme: dark`

**Keep:**
- `*, *::before, *::after` reset
- `body` base (update `background-color` to `var(--sky)`)
- Cursor dot styles (update color to `var(--candy-pink)`)
- `@media (pointer: fine)` cursor hide
- `@media (prefers-reduced-motion)` block

**Verification:** `grep -c "oklch" src/index.css` returns 0; page renders with sky-blue body background

---

## Step 4 — Rewrite App.css (kawaii keyframes)

**Context:** `App.css` currently holds keyframes for the old dark-theme animations (charIn, springUp, etc.) plus button/layout styles that are all being replaced. Replace the entire file with only what the new KawaiiHero needs.

**Keyframes to write:**

```css
/* Character theatrical drop — springs from off-screen top */
@keyframes theatricalDrop {
  0%   { transform: translateY(-120vh) rotate(-8deg); opacity: 0; }
  60%  { transform: translateY(8px)    rotate(3deg);  opacity: 1; }
  75%  { transform: translateY(-12px)  rotate(-2deg); }
  88%  { transform: translateY(5px)    rotate(1deg);  }
  100% { transform: translateY(0)      rotate(0deg);  opacity: 1; }
}

/* Name reveal — fades in with a bubbly pop */
@keyframes nameReveal {
  0%   { opacity: 0; transform: scale(0.75) translateY(16px); }
  65%  { opacity: 1; transform: scale(1.05) translateY(-4px); }
  100% { opacity: 1; transform: scale(1)    translateY(0);    }
}

/* Floating idle — character gently bobs after landing */
@keyframes floatIdle {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Layout classes:**
```css
.kawaii-stage {
  position: fixed;
  inset: 0;
  background-image: url('/src/assets/sky-bg.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.kawaii-character {
  width: clamp(220px, 35vw, 420px);
  height: auto;
  animation:
    theatricalDrop 0.95s var(--spring-kawaii) 0.3s both,
    floatIdle      4s    ease-in-out          2s    infinite;
  filter: drop-shadow(0 12px 32px rgba(135, 206, 235, 0.45));
}

.kawaii-name {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  /* Gradient: candy-pink to cinna-blue — matches character palette exactly */
  background: linear-gradient(135deg, #F9C5D1 0%, #A8C8F0 60%, #FFB3D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Soft text-shadow for depth (on fallback) */
  filter: drop-shadow(0 2px 8px rgba(249, 197, 209, 0.6));
  animation: nameReveal 0.75s var(--spring-kawaii) 1.3s both;
  user-select: none;
  margin-top: clamp(-1.5rem, -3vw, -2.5rem);  /* tuck under character */
}
```

**Verification:** `npx vite build` exits with code 0; visual check shows character and name positioned correctly

---

## Step 5 — Create KawaiiHero.tsx

**Context:** Single component that owns the theatrical stage. Replaces NavBar + HeroSection + HeroContent. No state needed — pure CSS animation timing handles the sequence.

```tsx
import cinnamoroll from '../assets/cinnamoroll.png'

export default function KawaiiHero() {
  return (
    <div className="kawaii-stage">
      <img
        src={cinnamoroll}
        alt="Cinnamoroll"
        className="kawaii-character"
        draggable={false}
      />
      <h1 className="kawaii-name">Samaksh</h1>
    </div>
  )
}
```

**Why no state:** The animation sequence is fully driven by CSS `animation-delay`. Adding JS-based sequencing would add complexity for zero visual benefit.

**Verification:** Component renders without TypeScript errors; character image appears; name appears below it

---

## Step 6 — Rewrite App.tsx

**Context:** Remove NavBar, HeroSection, HeroContent imports. Keep CursorDot (adapted) and Confetti (adapted colors in Step 7).

```tsx
import KawaiiHero from './components/KawaiiHero'
import CursorDot from './components/CursorDot'
import Confetti from './components/Confetti'
import './App.css'

function App() {
  return (
    <>
      <CursorDot />
      <Confetti />
      <KawaiiHero />
    </>
  )
}

export default App
```

**Verification:** No import errors; `npx tsc --noEmit` passes

---

## Step 7 — Adapt CursorDot colors

**Context:** CursorDot currently uses `--yellow` and `--pink` CSS variables that will be removed. Update the component's inline style references or update index.css cursor-dot rules to use new palette tokens.

**In `index.css`, update cursor dot styles:**
- Default dot: `background: var(--candy-pink)` (was `--yellow`)
- Hover state: `background: var(--cinna-blue); opacity: 0.5` (was `--pink`)
- Pressed state: `background: var(--heart-pink)` (was `--orange`)

**Verification:** Cursor dot visible and pink on the new page

---

## Step 8 — Adapt Confetti burst colors

**Context:** Confetti/burst colors in `HeroContent.tsx` are `BURST_COLORS = ['#f2cc00', '#e07820', ...]` — warm/dark palette. Since HeroContent is being deleted, the burst logic is gone too. Confetti component itself may have its own color constants — check and update to pastels if so.

**If Confetti.tsx has hardcoded colors:**
- Replace with pastel palette: `['#F9C5D1', '#A8C8F0', '#FFB3D9', '#87CEEB', '#F5EFFF']`

**Verification:** Confetti particles (if triggered) render in pastel colors matching the sky palette

---

## Step 9 — Delete retired components

**Tasks:**
- [ ] Delete `src/components/NavBar.tsx`
- [ ] Delete `src/components/HeroSection.tsx`
- [ ] Delete `src/components/HeroContent.tsx`

**Verification:** `npx tsc --noEmit` still passes after deletion (no dangling imports)

---

## Step 10 — Final build verification

**Tasks:**
- [ ] Run `npm run build` — must exit 0
- [ ] Run `npm run dev` — visual check of animation sequence
- [ ] Confirm timing: character drops ~0.3s in, name appears ~1.3s in
- [ ] Check mobile: character and name centered at 375px width
- [ ] Check reduced-motion: static render, no animation

**Verification commands:**
```bash
npm run build
npx tsc --noEmit
```

---

## Dependency Graph

```
Step 1 (assets)     ──→  Step 5 (KawaiiHero needs image paths)
Step 2 (font)       ──→  Step 3 (index.css references font var)
Step 3 (index.css)  ──→  Step 4 (App.css builds on CSS vars)
Step 4 (App.css)    ──→  Step 5 (KawaiiHero uses .kawaii-* classes)
Step 5 (component)  ──→  Step 6 (App.tsx imports KawaiiHero)
Step 6 (App.tsx)    ──→  Step 9 (safe to delete old components)
Step 7 (cursor)     — parallel to Steps 3–6
Step 8 (confetti)   — parallel to Steps 3–6
Steps 1–9           ──→  Step 10 (final verification)
```

**Parallel opportunities:**
- Steps 1 + 2 can run simultaneously
- Steps 7 + 8 can run simultaneously with Steps 3–5

---

## Rollback

Since this is a full rewrite, the rollback is git:
```bash
git stash   # or
git checkout -- .
```

All existing code is preserved in git history at commit `7c36168`.

---

## Typography Rationale

**Fredoka One** chosen over alternatives because:
| Font | Roundness | Kawaii match | Notes |
|---|---|---|---|
| Fredoka One | ★★★★★ | ★★★★★ | Single-weight but perfect for display |
| Pacifico | ★★★★ | ★★★ | Script-y, less Sanrio-matching |
| Nunito | ★★★ | ★★★ | Good body font, not impactful enough at display size |
| Baloo 2 | ★★★★ | ★★★★ | Good fallback if Fredoka feels too heavy |

**Color gradient rationale:** The name gradient `#F9C5D1 → #A8C8F0 → #FFB3D9` mirrors exactly the character's pink cheeks → sky blue body → heart pink, creating visual unity between the text and the image above it.
