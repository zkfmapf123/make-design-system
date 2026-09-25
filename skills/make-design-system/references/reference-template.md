# REFERENCE.md template (step 1)

Write `.benchmark/REFERENCE.md` from `bds.mjs capture` + `bds.mjs shots` output and from reading `.benchmark/src/*` (public CSS/JS).
This file is **analysis only**. Nothing from it — code, copy, images, logos — is copied into candidates or the design system.

```markdown
# REFERENCE: <site name>

## Source
- URL: <url>
- Captured: <YYYY-MM-DD>
- Evidence: analysis.json, rendered.html, src/ (N files), shots d00–dNN, m00–mNN, d_menu, m_menu

## Stack
Rendering (SSR/SPA/static), libraries seen in scripts (GSAP, Swiper, jQuery, React…), fonts source, analytics (ignore).

## Visual summary
3–5 sentences: palette mood, type personality, shape language, density, motion intensity.

## Tokens (observed)
| Role | Value | Evidence |
|---|---|---|
| bg / text / accent-1 / accent-2 / muted / line | #hex | computed count or CSS var |
Type: families + weights loaded; scale as px/weight/line-height/tracking (top 10 from analysis.sizes).
Spacing: header height, gutters, section padding, grid gaps. Radius set. Shadows. Borders.

## Information architecture (section order)
1. <section> — height, bg, purpose, key components
2. …

## Signature patterns
Bullet list of the moves that make this site recognizable (e.g. "phone mockup with chat bubbles in contact", "word-by-word color fill on statements", "circle motif marquee in hero").
These feed BANNED.md.

## Motion
Scroll smoothing, reveal presets (distance/duration/trigger point), pinned sections, marquees, looping timelines, cursor effects, header theme switching.

## Responsive
Breakpoints (from analysis.media), what collapses/stacks/becomes a carousel on mobile, mobile nav.

## Navigation
Header contents, menu type (fullscreen/drawer/dropdown), floating buttons, footer structure.
```
