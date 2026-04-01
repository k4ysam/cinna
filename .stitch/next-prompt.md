---
page: index
---
# Cinematic Narrative Experience: Plane to Ship

**OVERALL VIBE:**
Highly immersive, cinematic, and narrative-driven. A storytelling experience that uses depth and perspective to transition between environments.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Full-screen Desktop
- Palette: 
  - Interior: Warm cabin lighting, Soft Grays (#d1d5db), Muted Blues (#1e293b)
  - Exterior: Atmospheric Sky Blue (#7dd3fc), Deep Ocean Navy (#0f172a), Sunlight White (#f8fafc)
- Styles: Realistic 3D feel, soft atmospheric lighting, sleek modern typography (Inter).

**PAGE STRUCTURE & ASSETS:**
1. **Initial View (The Cabin):** A realistic interior view of an airplane passenger cabin. Focus on a single, clean window frame. The "outside" seen through the window is a bright, sun-drenched sky.
2. **The Transition (The Window):** As the scroll happens, the camera zooms into the window. The window frame becomes the border of the screen, then disappears as we "pass through" it.
3. **The Sky (The Atmos):** Large, soft, drifting clouds. Use layers to suggest parallax depth. The background is a vast horizon where the sky meets the ocean.
4. **The Reveal (The Ship):** A majestic, high-detail ship appears at eye level on the ocean surface. It should feel large-scale and powerful.
5. **Interactive Layer:** Subtle, minimalist navigation overlays (About, Work) that appear only when needed, maintaining the cinematic focus.

**TECHNICAL FOCUS:**
Structure the HTML with distinct layers (`z-index`) and semantic sections that can be easily animated with CSS `sticky` or GSAP later. Use high-quality SVG or CSS patterns for environmental details like waves and clouds.
