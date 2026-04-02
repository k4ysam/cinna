# Plan: Kawaii Scene v2 — Cloud Parallax + Marshmallow Name

**Objective:** Transform the hero page into a layered 3D-esque parallax scene: kawaii clouds slide in from left and right as a theatrical curtain, then Cinnamoroll drops from the top. Replace the invisible gradient name with a puffy 3D marshmallow/cloud CSS text effect matching the reference image.

**Branch:** Direct-to-main (small project, full rewrite continuation)
**Mode:** Direct (edit-in-place)

---

## Visual Reference

| Element | Source | Notes |
|---|---|---|
| Background | `src/assets/sky-bg.png` | Already in place |
| Cloud prop | `6e50b0d414952cd746b1e02c117af9ad.png` | Kawaii cloud with rainbow, black bg — use `mix-blend-mode: screen` to drop black on the sky |
| Cinnamoroll | `src/assets/cinnamoroll.png` | Already in place |
| Name style | `ChatGPT Image Apr 2, 2026, 02_48_47 AM.png` | Puffy 3D marshmallow text — white base, layered pink-shadow depth, rounded script font |

---

## Animation Sequence

```
t=0s    Background fills viewport (instant, CSS)
t=0.1s  Cloud LEFT slides in from far-left off-screen  (fast layer, foreground depth)
t=0.1s  Cloud RIGHT slides in from far-right off-screen (fast layer, foreground depth, mirrored)
t=0.3s  Cloud LEFT-BG slides in slower, smaller scale   (slow layer, background depth)
t=0.3s  Cloud RIGHT-BG slides in slower                 (slow layer, background depth)
t=0.6s  All clouds settle with soft bounce
t=1.0s  Cinnamoroll drops from off-screen top (theatrical drop)
t=1.8s  Name "Samaksh" fades+pops in — marshmallow puffed style
```

---

## Parallax Depth Model

Two cloud layers create the 3D illusion:

| Layer | Position | Size | Speed | z-index | Blend |
|---|---|---|---|---|---|
| `cloud-bg-left` | fixed bottom-left, behind Cinna | 28vw | slow (1.1s) | 1 | screen |
| `cloud-bg-right` | fixed bottom-right, behind Cinna | 28vw, mirrored | slow (1.1s) | 1 | screen |
| `cloud-fg-left` | fixed mid-left, in front of bg clouds | 38vw | fast (0.7s) | 3 | screen |
| `cloud-fg-right` | fixed mid-right | 38vw, mirrored | fast (0.7s) | 3 | screen |

Cinnamoroll sits at z-index 5, name at z-index 6.

---

## Name Typography — Marshmallow Puff Effect

**Font:** Pacifico (Google Fonts) — rounded, script, matches the reference image closely
- Replace Fredoka One with Pacifico in `index.html`
- Fredoka One is too geometric/blocky; Pacifico has the organic rounded script letterforms from the reference

**CSS technique — layered text-shadow stack for 3D depth:**
```css
.kawaii-name {
  font-family: 'Pacifico', cursive;
  color: #ffffff;
  /* Remove the broken gradient clip — was invisible because
     -webkit-text-fill-color: transparent clashed with the sky background */
  text-shadow:
    /* 3D depth stack — each layer offset down-right, darkening pink */
    1px  1px 0 #f5e0ef,
    2px  2px 0 #eecce6,
    3px  3px 0 #e7b8dc,
    4px  4px 0 #e0a4d3,
    5px  5px 0 #d990c9,
    6px  6px 0 #d27cc0,
    /* ambient soft glow — reads on the sky bg */
    0 0 40px rgba(255, 255, 255, 0.95),
    0 0 80px rgba(249, 197, 209, 0.6);
  filter: drop-shadow(0 6px 20px rgba(180, 120, 180, 0.35));
}
```

**Why the current name is invisible:** The existing code uses `-webkit-text-fill-color: transparent` + `background-clip: text` + a pink-to-blue gradient. On a sky-blue background, the gradient becomes indistinguishable. Removing the clip approach and using a solid white + layered shadows is the correct fix.

---

## File Structure Changes

### Add Asset
```
6e50b0d414952cd746b1e02c117af9ad.png  →  src/assets/cloud-kawaii.png
```

### Modify
```
index.html                     — swap Fredoka One → Pacifico
src/App.css                    — add cloud slide keyframes; fix .kawaii-name; add cloud layer classes
src/components/KawaiiHero.tsx  — add 4 cloud img elements with depth classes
```

### No changes needed
```
src/index.css      — palette + cursor dot already correct
src/App.tsx        — imports unchanged
src/components/Confetti.tsx   — colors already updated
src/components/CursorDot.tsx  — unchanged
```

---

## Step 1 — Copy Cloud Asset

**Context:** The cloud PNG has a black background. We intentionally keep it as-is and use CSS `mix-blend-mode: screen` on the `<img>` element. On the sky-blue background, screen mode makes black pixels invisible while preserving the white/blue cloud colors perfectly.

**Tasks:**
- [ ] Copy `6e50b0d414952cd746b1e02c117af9ad.png` → `src/assets/cloud-kawaii.png`

**Verification:** `ls src/assets/` shows `cloud-kawaii.png`

---

## Step 2 — Swap Font in index.html

**Context:** Replace Fredoka One with Pacifico. Pacifico is a single-weight display font with the organic rounded script letterforms that match the marshmallow reference image. Fredoka One is geometric/display-block — good for labels but lacks the flowing curves of the reference.

**Old link tag to replace:**
```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
```

**New link tag:**
```html
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
```

Also update `--font-display` in `index.css` `:root`:
- Old: `'Fredoka One', 'Nunito', system-ui, sans-serif`
- New: `'Pacifico', cursive, system-ui, sans-serif`

**Verification:** `grep Pacifico index.html` returns 1 match

---

## Step 3 — Add Cloud Keyframes + Updated Name CSS to App.css

**Context:** App.css owns all animation keyframes and layout classes. Add 4 new keyframes for cloud slide-ins (left/right × fast/slow layers). Update `.kawaii-name` to use the marshmallow puff technique — remove the broken gradient clip and replace with layered text-shadow.

### New keyframes to add (append to App.css):

```css
/* Cloud slides — foreground layer (faster, larger) */
@keyframes cloudSlideLeft {
  0%   { transform: translateX(calc(-100% - 60vw)); opacity: 0; }
  70%  { opacity: 1; }
  85%  { transform: translateX(8px); }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes cloudSlideRight {
  0%   { transform: translateX(calc(100% + 60vw)); opacity: 0; }
  70%  { opacity: 1; }
  85%  { transform: translateX(-8px); }
  100% { transform: translateX(0); opacity: 1; }
}

/* Cloud slides — background layer (slower, smaller) */
@keyframes cloudSlideLeftBg {
  0%   { transform: translateX(calc(-100% - 80vw)) scale(0.85); opacity: 0; }
  70%  { opacity: 0.85; }
  100% { transform: translateX(0) scale(0.85); opacity: 0.85; }
}

@keyframes cloudSlideRightBg {
  0%   { transform: translateX(calc(100% + 80vw)) scale(0.85); opacity: 0; }
  70%  { opacity: 0.85; }
  100% { transform: translateX(0) scale(0.85); opacity: 0.85; }
}

/* Cloud idle float — bg clouds bob slower than Cinnamoroll */
@keyframes cloudFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
```

### Cloud layout classes to add:

```css
/* Shared cloud base */
.cloud-layer {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;  /* drops the black PNG background on the sky */
}

/* Foreground clouds — faster entry, lower on screen */
.cloud-fg-left {
  width: clamp(260px, 38vw, 520px);
  bottom: 8%;
  left: -4%;
  z-index: 3;
  animation:
    cloudSlideLeft 0.70s var(--spring-kawaii) 0.10s both,
    cloudFloat     5s   ease-in-out          1.8s  infinite;
}

.cloud-fg-right {
  width: clamp(260px, 38vw, 520px);
  bottom: 8%;
  right: -4%;
  z-index: 3;
  transform-origin: right center;
  animation:
    cloudSlideRight 0.70s var(--spring-kawaii) 0.10s both,
    cloudFloat      5s   ease-in-out           2.3s  infinite;
}

/* Background clouds — slower entry, higher on screen, slightly transparent */
.cloud-bg-left {
  width: clamp(200px, 28vw, 380px);
  top: 18%;
  left: 2%;
  z-index: 1;
  opacity: 0.85;
  animation:
    cloudSlideLeftBg 1.10s var(--spring-gentle) 0.30s both,
    cloudFloat       7s   ease-in-out           2.8s  infinite;
}

.cloud-bg-right {
  width: clamp(200px, 28vw, 380px);
  top: 18%;
  right: 2%;
  z-index: 1;
  opacity: 0.85;
  animation:
    cloudSlideRightBg 1.10s var(--spring-gentle) 0.30s both,
    cloudFloat        7s   ease-in-out            3.4s  infinite;
}
```

### Updated .kawaii-name (replace existing rule):

```css
.kawaii-name {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #ffffff;
  text-shadow:
    1px  1px 0 #f5e0ef,
    2px  2px 0 #eecce6,
    3px  3px 0 #e7b8dc,
    4px  4px 0 #e0a4d3,
    5px  5px 0 #d990c9,
    6px  6px 0 #d27cc0,
    0 0 40px rgba(255, 255, 255, 0.95),
    0 0 80px rgba(249, 197, 209, 0.60);
  filter: drop-shadow(0 6px 20px rgba(180, 120, 180, 0.35));
  animation: nameReveal 0.75s var(--spring-kawaii) 1.8s both;
  user-select: none;
  margin-top: clamp(-1.5rem, -3vw, -2.5rem);
  position: relative;
  z-index: 6;
}
```

Note: `animation-delay` bumped from 1.3s → 1.8s to appear after clouds settle.

### Updated .kawaii-character (add z-index):

```css
.kawaii-character {
  /* existing properties... */
  position: relative;
  z-index: 5;
  /* rest unchanged */
}
```

**Verification:** No oklch, no background-clip, no -webkit-text-fill-color in the name rule.

---

## Step 4 — Update KawaiiHero.tsx

**Context:** Add 4 cloud `<img>` elements to the stage. Use the same `cloud-kawaii.png` for all 4 — right-side clouds get CSS `scaleX(-1)` via a modifier class to mirror the image. The stage is already `position: fixed; inset: 0` so absolute-positioned children work correctly.

```tsx
import cinnamoroll from '../assets/cinnamoroll.png'
import cloudKawaii from '../assets/cloud-kawaii.png'

export default function KawaiiHero() {
  return (
    <div className="kawaii-stage">
      {/* Background depth clouds */}
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-bg-left"  draggable={false} />
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-bg-right cloud-mirror" draggable={false} />

      {/* Foreground depth clouds */}
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-fg-left"  draggable={false} />
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-fg-right cloud-mirror" draggable={false} />

      {/* Cinnamoroll — drops after clouds */}
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

Add `.cloud-mirror` utility to App.css:
```css
.cloud-mirror {
  transform-origin: center;
  /* scaleX(-1) is baked into the right-side animation start transforms,
     but we need it as a persistent style for the settled state */
}

/* Applied after animation settles — right clouds are mirrored */
.cloud-fg-right,
.cloud-bg-right {
  scale: -1 1;  /* mirrors horizontally without affecting animation keyframes */
}
```

**Note on mirroring:** Using CSS `scale: -1 1` (the individual transform property, not `transform: scaleX`) avoids fighting the keyframe `transform` values. The individual `scale` property composes with `transform` independently in modern CSS.

**Verification:** 4 cloud images render; right-side clouds face the correct direction (mirrored)

---

## Step 5 — Final Build Verification

**Tasks:**
- [ ] Run `npx tsc --noEmit` — must pass
- [ ] Run `npm run build` — must exit 0
- [ ] Visual check: clouds slide in from sides, Cinnamoroll drops, name is visible white-marshmallow
- [ ] Check reduced-motion: static render, no animation flicker

**Verification commands:**
```bash
npx tsc --noEmit
npm run build
```

---

## Dependency Graph

```
Step 1 (cloud asset)    ──→  Step 4 (KawaiiHero imports cloud-kawaii.png)
Step 2 (font swap)      ──→  Step 3 (App.css .kawaii-name uses --font-display var)
Step 3 (App.css)        ──→  Step 4 (KawaiiHero uses .cloud-* classes)
Steps 1–4               ──→  Step 5 (final verification)
```

**Parallel opportunities:**
- Steps 1 + 2 can run simultaneously
- Step 3 (CSS) and Step 4 (TSX) can be written simultaneously since CSS classes exist before TSX renders

---

## Rollback

```bash
git stash  # or git checkout -- .
```

All current working state is in git at the most recent commit.

---

## Key Technical Decisions

### Why `mix-blend-mode: screen` for clouds
The cloud PNG has a black background (not transparent). On a light sky-blue background, `screen` blend mode makes black (`#000`) fully invisible while white and blue tones pass through correctly. This is cheaper than re-exporting the PNG with transparency and works perfectly for light backgrounds.

### Why `scale: -1 1` instead of `transform: scaleX(-1)` for mirroring
CSS individual transform properties (`scale`, `rotate`, `translate`) compose with `transform` rather than overriding it. If we used `transform: scaleX(-1)`, it would override the keyframe `transform` values mid-animation, causing a visual glitch on the right-side clouds. Using the `scale` property keeps the two systems separate.

### Why Pacifico over Fredoka One for the name
Fredoka One is a geometric rounded sans-serif — good for labels and UI. Pacifico is an organic rounded brush script. The reference image shows the flowing baseline undulation and rounded stroke terminals of a brush script, not the uniform cap-height of Fredoka One. Pacifico matches the reference letterform shapes most closely among free Google Fonts.

### Why the current name is invisible
The existing code uses `-webkit-text-fill-color: transparent` + `background-clip: text` + a `#F9C5D1 → #A8C8F0 → #FFB3D9` gradient. These pastel colors are nearly indistinguishable from the `#A8C8F0` sky-blue background. The marshmallow technique (solid white + layered pink text-shadows) reads clearly on any sky color.
