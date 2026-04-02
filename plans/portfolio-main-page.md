# Portfolio Main Page — Implementation Blueprint

**Project:** stichtest (React + TypeScript + Tailwind)  
**Scope:** Replace ProjectsPage internals with a full two-column portfolio layout  
**Constraint:** Do not modify App.tsx routing logic, Confetti.tsx, BouncingArrow.tsx  
**Date:** 2026-04-02  

---

## 0. Context Brief (cold-start summary)

`App.tsx` manages two pages (`hero` | `projects`) via `useState`. The CloudFlood
transition calls `setPage('projects')` and passes `revealed` prop to
`ProjectsPage`. All routing logic lives in `App.tsx` — touch nothing there.

`ProjectsPage.tsx` currently wraps `ProjectShowcase` — its internals are fully
replaced. The `revealed: boolean` prop interface **must be preserved** so
`App.tsx` keeps working with no changes.

`CursorDot.tsx` is imported in `App.tsx` as `<CursorDot />` — replace its
*contents* in-place rather than creating a new file (avoids any App.tsx edit).

CSS design tokens already live in `src/index.css` under `:root`. Dark mode
will redefine those same vars under `html.dark`.

---

## 1. Component Tree

### New files to create

```
src/
  hooks/
    useScrollSpy.ts          — IntersectionObserver hook → active section ID
    useDarkMode.ts           — localStorage + html.dark class toggle

  components/
    portfolio/
      PortfolioLayout.tsx    — outer two-column shell (sidebar + scroll panel)
      Sidebar.tsx            — sticky nav, music player, socials, dark toggle
      MusicPlayer.tsx        — local audio widget (self-contained)
      ExperienceSection.tsx  — section 01
      ProjectsCarousel.tsx   — section 02 (horizontal carousel, NOT project-showcase)
      SchoolSection.tsx      — section 03 (accordions + club cards)
      CuriousSection.tsx     — section 04 (about, hobbies, fake now-playing)
      Accordion.tsx          — reusable open/close accordion primitive
      SectionWrapper.tsx     — shared fade+slide-up IntersectionObserver wrapper
```

### Files to modify

| File | Change |
|------|--------|
| `src/components/ProjectsPage.tsx` | Replace internals; keep `revealed` prop |
| `src/components/CursorDot.tsx` | Replace entire implementation with Inkay GIF cursor |
| `src/index.css` | Add `html.dark` var overrides; update `.cursor-dot` → `.inkay-cursor` |

### Files to leave untouched

`App.tsx`, `Confetti.tsx`, `BouncingArrow.tsx`, `CloudFlood.tsx`,
`KawaiiHero.tsx`, `App.css`, `ui/project-showcase.tsx`

---

## 2. Carousel Orientation — Recommendation: HORIZONTAL

**Reasoning:**

The portfolio has 3–4 projects. A vertical (stacked) layout inside the right
scroll panel means the user must scroll *through* all project cards to reach
School and Curious sections — this inflates perceived length and buries content.

A horizontal carousel occupies a **fixed vertical band** regardless of project
count. All projects are reachable via ← → arrow buttons without consuming
vertical scroll budget. A "peek" effect (right edge of next card partially
visible) provides affordance that more cards exist without requiring the user
to scroll down.

Horizontal also matches the two-column editorial aesthetic better — it reads
like a magazine spread rather than a feed.

**Implementation sketch:**
- Outer container: `overflow: hidden`, fixed height (~300–340px)
- Inner track: `display: flex`, `transform: translateX(-N * cardWidth)`,
  `transition: transform 0.4s var(--spring-kawaii)`
- Arrow buttons: absolutely positioned left/right, disabled at edges
- No drag — arrows only (keeps implementation minimal, no touch library needed)

---

## 3. Music Player Architecture

### State management
Fully local to `MusicPlayer.tsx` via `useState` + `useRef`. No global state,
no context. The widget is self-contained and isolated.

```
State:
  trackIndex: number          — which track in TRACKS[] is loaded
  isPlaying: boolean          — play/pause
  volume: number (0–1)        — slider value

Refs:
  audioRef: HTMLAudioElement  — imperative Audio API handle
```

### Track list
Hardcoded `const TRACKS` array at top of file:
```ts
const TRACKS = [
  { title: 'Song Title', artist: 'Artist Name', src: '/src/assets/music/track1.mp3' },
  // …
]
```
Vite serves files under `public/` at root paths, or files under `src/assets/`
can be imported as module URLs. For mp3s added later, use:
```ts
import track1 from '../assets/music/track1.mp3'
```
This gives Vite a chance to fingerprint and bundle them. If the file is absent
at import time, the build will error — so either keep them in `public/music/`
(no import needed, just path strings), or gate the imports behind existence
checks. **Recommendation: `public/music/` folder** so paths are just strings
and missing files don't break the build.

### Graceful missing-file handling
```ts
audioRef.current.onerror = () => {
  // mark track as unavailable, skip to next or show "unavailable"
  setUnavailable(true)
}
```
Player renders disabled state (grayed out, no crash) when `unavailable` is true.

### Volume
```ts
useEffect(() => {
  if (audioRef.current) audioRef.current.volume = volume
}, [volume])
```

### Auto-advance
`audio.onended` → `setTrackIndex(i => (i + 1) % TRACKS.length)`

---

## 4. Dark Mode Implementation Strategy

**Approach: CSS custom property swap via `html.dark` class**

The design system already uses CSS vars (`--sky`, `--cloud`, etc.) throughout.
Redefining those vars under `html.dark` is the single-change point — no `dark:`
prefixes needed on every element.

Tailwind's `darkMode: 'class'` config should be set in `tailwind.config.ts`
for any components that use Tailwind utilities with dark variants, but most
styling goes through the CSS vars.

### `src/index.css` additions

```css
html.dark {
  --sky:        #1a1f35;
  --cloud:      #2a2040;
  --candy-pink: #c47080;
  --cinna-blue: #3a6080;
  --heart-pink: #8a4060;
  --text-dark:  #e8dff5;

  /* shadcn token overrides */
  --background: 240 20% 10%;
  --foreground:  240 10% 90%;
  --muted-foreground: 240 8% 60%;
  --secondary:  240 15% 18%;
  --border:     240 12% 22%;
}
```

### `useDarkMode.ts` hook

```ts
// Reads: localStorage.getItem('theme') || system preference
// Writes: document.documentElement.classList.toggle('dark', isDark)
//         localStorage.setItem('theme', isDark ? 'dark' : 'light')
// Returns: [isDark, toggleDark]
```

### Dark mode toggle placement
Inside `Sidebar.tsx` — a small sun/moon icon button at top-right of sidebar.
Uses `useDarkMode` hook directly.

---

## 5. Scroll Spy — Sidebar Active State

### Problem
The scrollable area is the **right panel** (`overflow-y: auto`), not `window`.
`IntersectionObserver` must target that panel as its `root`.

### `useScrollSpy.ts` hook API

```ts
function useScrollSpy(
  sectionIds: string[],
  scrollContainerRef: RefObject<HTMLElement>
): string  // returns active section ID
```

### Implementation

```ts
useEffect(() => {
  const root = scrollContainerRef.current
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id)
      })
    },
    {
      root,
      rootMargin: '-20% 0px -60% 0px',  // section must be in top 40% of panel
      threshold: 0
    }
  )

  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect()
}, [sectionIds, scrollContainerRef])
```

### Smooth scroll on nav click

```ts
function scrollTo(id: string) {
  const container = scrollContainerRef.current
  const target = document.getElementById(id)
  if (!container || !target) return
  container.scrollTo({
    top: target.offsetTop - 32,   // 32px breathing room above section
    behavior: 'smooth'
  })
}
```

### Sidebar active style
```ts
// For each nav item:
const isActive = activeSection === sectionId
// Apply: font-weight bold + left border accent (--candy-pink) when active
```

---

## 6. Ordered Task List

Tasks are sized for single implementation sessions. Each is independent unless
a dependency edge is noted.

---

### Task 1 — Dark mode foundation
**Files:** `src/index.css`, `src/hooks/useDarkMode.ts`  
**Steps:**
1. Add `html.dark` CSS var block to `index.css` (dark palette values above)
2. Add `darkMode: 'class'` to `tailwind.config.ts`
3. Write `useDarkMode.ts` hook (reads localStorage + system pref, toggles class)
**Exit criteria:** Toggling `document.documentElement.classList.add('dark')` manually
in console shifts all var-driven colors. No visual regressions on hero page.

---

### Task 2 — Inkay cursor (replaces CursorDot)
**Files:** `src/components/CursorDot.tsx`, `src/index.css`  
**Depends on:** nothing (isolated)  
**Steps:**
1. Remove `.cursor-dot` CSS block from `index.css`; add `.inkay-cursor` styles:
   - `position: fixed`, `pointer-events: none`, `z-index: 9999`
   - `width: 48px`, `height: 48px`, `image-rendering: pixelated`
   - `transform: translate(calc(Xpx - 50%), calc(Ypx - 50%))`
2. Replace `CursorDot.tsx` internals:
   - Two `img` refs: `idleRef` (inkay_idle.gif) and `pressRef` (inkay_press2.gif)
   - Same lerp loop (keep `lerp(a, b, 0.14)` constant — matches existing feel)
   - `mousedown` → show pressRef, hide idleRef
   - `mouseup` → swap back
   - Both images rendered, toggled via `display: none`/`block`
   - No `data-hover` size change needed (GIF is already expressive)
**Exit criteria:** Cursor follows mouse with lag on hero page. Clicks swap to press GIF.

---

### Task 3 — Layout shell + scroll spy hook
**Files:** `src/components/portfolio/PortfolioLayout.tsx`,
`src/hooks/useScrollSpy.ts`  
**Depends on:** Task 1 (dark mode vars should exist before layout styling)  
**Steps:**
1. Write `useScrollSpy.ts` (full implementation from section 5 above)
2. Write `PortfolioLayout.tsx`:
   - Outer: `display: flex`, `height: 100vh`, `overflow: hidden`
   - Left: `width: 260px`, `flex-shrink: 0`, `height: 100vh`, `overflow: hidden`
     (sidebar slot, receives `scrollContainerRef` + `activeSection` from parent)
   - Right: `flex: 1`, `height: 100vh`, `overflow-y: auto`, ref attached
   - Background: `var(--cloud)` (light) / dark equivalent
3. Wire `useScrollSpy` inside `PortfolioLayout`, pass `activeSection` down to
   `Sidebar`
**Exit criteria:** Two-column shell renders; right panel scrolls; left is sticky.

---

### Task 4 — Sidebar component
**Files:** `src/components/portfolio/Sidebar.tsx`  
**Depends on:** Task 3  
**Steps:**
1. Nav section: map over `NAV_ITEMS` array with id, label, number prefix
2. Active highlight via `activeSection` prop (left border + bold)
3. Smooth scroll via `scrollTo` callback prop
4. Inline sub-links: "Resume ↗" under Experience, "GitHub ↗" under Projects
5. Dark mode toggle button (calls `useDarkMode` hook)
6. Socials at bottom: GitHub ↗, LinkedIn ↗
7. `<MusicPlayer />` slot above socials (import from Task 6)
**Exit criteria:** Nav highlights update as right panel scrolls. Clicking a nav
item smooth-scrolls to that section.

---

### Task 5 — SectionWrapper utility
**Files:** `src/components/portfolio/SectionWrapper.tsx`  
**Depends on:** nothing  
**Steps:**
1. Accept `id: string`, `children: ReactNode`
2. `useRef` + `IntersectionObserver` (threshold 0.15) on section element
3. Apply `opacity-0 translate-y-6` → `opacity-100 translate-y-0` via
   Tailwind classes + CSS transition when entry.isIntersecting
4. Once visible, disconnect observer (one-shot animation)
**Exit criteria:** Any section wrapped in it fades+slides in on scroll.

---

### Task 6 — Music player widget
**Files:** `src/components/portfolio/MusicPlayer.tsx`  
**Depends on:** nothing  
**Steps:**
1. Define `TRACKS` const array (3–4 placeholder entries, src points to
   `public/music/` paths)
2. `audioRef = useRef<HTMLAudioElement>(null)`, create via `new Audio()` in
   `useEffect` (avoids SSR issues)
3. Wire play/pause: `audio.play()` in try/catch, `audio.pause()`
4. Wire track advance: `audio.onended` → next track
5. Wire volume: `audio.volume = volume` in effect
6. `audio.onerror` → set `unavailable: true` for current track, skip
7. UI: track title + artist (truncated), play/pause icon button, prev/next
   arrows, volume range input
8. Compact height: ~80px total
**Exit criteria:** Player renders, prev/next changes track label, volume slider
works, missing file shows disabled state without crash.

---

### Task 7 — Experience section (01)
**Files:** `src/components/portfolio/ExperienceSection.tsx`  
**Depends on:** Task 5 (SectionWrapper)  
**Steps:**
1. Wrap in `<SectionWrapper id="experience">`
2. Define `EXPERIENCE_DATA` placeholder array (3 entries):
   ```ts
   { company, role, dates, bullets: string[], tags: string[] }
   ```
3. Map entries: company name (Pacifico font), role + dates (Nunito), bullets,
   tech tag pills (rounded, `var(--cinna-blue)` bg)
4. Divider: `<hr>` with `border-color: var(--candy-pink)` opacity 30%
**Exit criteria:** 3 placeholder entries render with pills; section animates on scroll.

---

### Task 8 — Projects carousel (02)
**Files:** `src/components/portfolio/ProjectsCarousel.tsx`  
**Depends on:** Task 5  
**Steps:**
1. Define `PROJECTS_DATA` placeholder array (4 entries):
   ```ts
   { name, description, image: null, tags: string[] }
   ```
2. Carousel shell: `overflow: hidden` wrapper + `flex` inner track
3. `currentIndex` state, translate track by `currentIndex * cardWidth`
4. Prev/next arrow buttons; disable at boundaries
5. Card: 280×320px, `var(--cloud)` bg, placeholder image area (gray box),
   name (Pacifico), description, tag pills
6. Hover: `translateY(-4px)` + `box-shadow` via CSS transition
7. Wrap in `<SectionWrapper id="projects">`
**Exit criteria:** 4 cards visible with arrow nav; hover lift works; placeholder
images show as gray boxes; no reuse of `project-showcase.tsx`.

---

### Task 9 — School section (03)
**Files:** `src/components/portfolio/SchoolSection.tsx`,
`src/components/portfolio/Accordion.tsx`  
**Depends on:** Task 5  
**Steps:**
1. Write `Accordion.tsx`: takes `title: string`, `children: ReactNode`
   - `isOpen` state (default false)
   - Chevron icon rotates 180° on open (CSS transform transition)
   - Content: `max-height: 0` → `max-height: 500px` transition (CSS only)
2. `SchoolSection.tsx`:
   - "McGill University" heading (Pacifico)
   - 3 `<Accordion>` instances: CS courses, Economics courses, Stats courses
   - Each contains a simple `<ul>` of placeholder course names
   - Clubs grid below: 2-column grid of club cards
     - Club card: name, short description, 2 image placeholder slots (gray boxes)
3. Wrap in `<SectionWrapper id="school">`
**Exit criteria:** All 3 accordions closed by default; click toggles open with
animation; club grid renders with placeholder image slots.

---

### Task 10 — Curious section (04)
**Files:** `src/components/portfolio/CuriousSection.tsx`  
**Depends on:** Task 5  
**Steps:**
1. About me: 2 paragraph `<p>` placeholder text
2. Hobbies: `HOBBIES` array `{ icon: string (emoji), label: string }`, rendered
   as pill grid (wrap flex)
3. Fake now-playing card:
   - Styled like a Spotify mini-player (dark card, green accent)
   - Album art: 64×64 gray placeholder box
   - "Now Playing" label + fake song title + artist
   - Animated "playing" bars (3 bars, CSS `@keyframes` height oscillation)
   - Purely decorative — no state, no audio
4. Wrap in `<SectionWrapper id="curious">`
**Exit criteria:** Section renders; hobbies wrap correctly; now-playing card has
animated bars in light and dark mode.

---

### Task 11 — Wire everything into ProjectsPage
**Files:** `src/components/ProjectsPage.tsx`  
**Depends on:** Tasks 3, 4, 6, 7, 8, 9, 10  
**Steps:**
1. Replace `ProjectsPage` body — keep `revealed: boolean` prop
2. Existing animate-in logic (opacity/translateY transition on `revealed`) moves
   to the `PortfolioLayout` wrapper div — preserves the post-CloudFlood reveal
3. Import and render:
   ```tsx
   <PortfolioLayout>
     <ExperienceSection />
     <ProjectsCarousel />
     <SchoolSection />
     <CuriousSection />
   </PortfolioLayout>
   ```
   (`PortfolioLayout` receives sections as children and renders them in the
   right scroll panel)
4. `<Sidebar />` is rendered inside `PortfolioLayout`, not in ProjectsPage
**Exit criteria:** After CloudFlood transition, full portfolio layout appears
with reveal animation. All 4 sections reachable. Landing page and CloudFlood
completely unaffected.

---

### Task 12 — Mobile responsive sidebar
**Files:** `src/components/portfolio/Sidebar.tsx`,
`src/components/portfolio/PortfolioLayout.tsx`  
**Depends on:** Tasks 3, 4  
**Steps:**
1. Add `isMobileMenuOpen` state in `PortfolioLayout`
2. At `< 768px` breakpoint:
   - Sidebar: hidden by default (`transform: translateX(-100%)`)
   - Hamburger button: fixed top-left, toggles sidebar
   - Sidebar slides in as overlay (`position: fixed`, full height, z-index above
     content, `transition: transform`)
   - Clicking a nav item closes the menu
3. Right panel: full width on mobile (`width: 100%`)
**Exit criteria:** On viewport < 768px, sidebar is hidden; hamburger toggles it;
nav still works; layout doesn't break.

---

## Parallelism Map

```
Task 1 (dark mode)  ──────────────────────────┐
Task 2 (cursor)     ─── independent ───────────┤
Task 5 (SectionWrapper) ─ independent ─────────┤
Task 6 (MusicPlayer) ─── independent ──────────┤
                                               ▼
Task 3 (layout shell) ── after Task 1 ──► Task 4 (Sidebar)
                                               │
Tasks 7,8,9,10 ─── after Task 5 ─────────────►│
                                               ▼
                                         Task 11 (wire up)
                                               │
                                               ▼
                                         Task 12 (mobile)
```

Tasks 1, 2, 5, 6 can run in parallel.  
Tasks 7, 8, 9, 10 can run in parallel (all depend only on Task 5).  
Task 3 depends on Task 1; Task 4 depends on Tasks 3 and 6.  
Task 11 is the integration gate; Task 12 is final polish.

---

## Typography — Impeccable Font Audit

**Pacifico (headings) + Nunito (body) assessment:**

This pairing works well for a kawaii portfolio — Pacifico is expressive and
playful; Nunito rounds out the body text with geometric softness. To make it
feel editorial and energetic rather than corporate:

**Type scale (portfolio page):**

| Role | Font | Size | Weight | Notes |
|------|------|------|--------|-------|
| Section numbers (01, 02…) | Nunito | 11px | 700 | Uppercase tracking: 0.15em |
| Section title | Pacifico | 28px | 400 | Pacifico has no weight variation |
| Company name / Project name | Pacifico | 22px | 400 | |
| Role / Sub-heading | Nunito | 16px | 700 | |
| Body / Description | Nunito | 15px | 400 | line-height 1.65 |
| Date range | Nunito | 13px | 600 | muted color |
| Tag pills | Nunito | 11px | 700 | uppercase, letter-spacing 0.08em |
| Nav items | Nunito | 14px | 700 → 800 active | |
| Sub-links (Resume ↗) | Nunito | 12px | 400 | muted, italic optional |

**Energy note:** The large Pacifico section titles (22–28px) against tight Nunito
body (15px) creates the editorial contrast. Avoid using Pacifico below 18px —
it becomes muddy. Never use Pacifico for body copy. The numbered prefixes in
Nunito Bold create a rhythmic, magazine-style index feel.

---

## Anti-patterns to Avoid

- **Do not** import `project-showcase.tsx` anywhere in the new portfolio layout
- **Do not** use `window.scrollY` for scroll spy — use IntersectionObserver
  with the scroll container as `root`
- **Do not** reach into the DOM in `PortfolioLayout` to scroll — pass a
  `scrollTo` callback down from where the `scrollContainerRef` lives
- **Do not** use `autoPlay` on the audio element — browsers block it and it
  triggers console errors
- **Do not** put audio files in `src/assets/` and import them at module level
  until the actual mp3 files exist — use `public/music/` paths as strings
- **Do not** add new keyframe animations to `App.css` — put portfolio-specific
  animations in `index.css` or scoped component styles
- **Do not** modify the `heroFadeBlue` keyframe or any CloudFlood-related CSS

---

## Rollback Strategy

All new components are isolated in `src/components/portfolio/`. The only
existing file with behavior change is `ProjectsPage.tsx`. If the layout breaks,
revert `ProjectsPage.tsx` to its current state (wraps `<ProjectShowcase />`)
and the hero + transition remain fully functional.

`CursorDot.tsx` rewrite is also isolated — reverting it restores the dot cursor.
