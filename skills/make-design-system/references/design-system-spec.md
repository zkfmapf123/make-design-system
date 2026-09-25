# Design system spec (step 7 — base outputs, always produced)

Input: the chosen candidate (or a combination, e.g. "03 layout + 04 motion"). Output folder: `{project}/design-system/`.

## Procedure
1. **Extract** — read the candidate's `:root` and scan its CSS for every literal color, size, radius, shadow, duration, easing. `bds.mjs capture <candidate file> --out design-system/.extract` gives computed usage counts.
2. **Normalize** — merge near-duplicates (9px/10px/8px radius → one step; #111/#121212 → one ink). Snap spacing to a 4px base; snap type to a ratio (1.2–1.333) with `clamp()` for display sizes.
3. **Tier the tokens** (3 layers; app code uses layer 2 only):
   - Primitive: `--color-teal-600`, `--space-4`, `--radius-2`, `--font-size-500`, `--duration-200`
   - Semantic: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-accent-contrast`, `--color-focus`, `--color-success|warning|danger` (+ `-soft`), `--font-display|body|mono`, `--text-{xs…4xl}`, `--space-{…}`, `--radius-{sm,md,lg,pill}`, `--shadow-{1,2,3}`, `--motion-{fast,base,slow}`, `--ease-{standard,emphasized,spring}`
   - Component: `--button-bg`, `--button-radius`, `--card-shadow`, … only where a component deviates from semantics.
4. **Fill gaps** the candidate never needed: dark theme (or an explicit single-theme decision), all interactive states, status colors, focus ring, disabled, form error. Check WCAG AA: text ≥ 4.5:1, large text/UI ≥ 3:1 — list any pair that fails and fix it.
5. **Components** — for each: anatomy, variants (primary/secondary/ghost; sm/md/lg), states (default/hover/focus-visible/active/disabled/loading/error), a11y notes (keyboard, aria).
   Minimum set: button, link, input, textarea, select, checkbox/radio, switch, badge/tag, card, nav/header, menu/drawer, modal/dialog, tabs, accordion, toast/alert, table/list row, pagination or carousel control, footer.
6. **Patterns** — the candidate's signature sections (hero, work listing, process, contact, …) as reusable blocks with do/don't.

## Files
| File | Content |
|---|---|
| `tokens.css` | 3 tiers on `:root`; dark overrides under `@media (prefers-color-scheme: dark)` guarded with `:root:not([data-theme="light"])` and repeated under `:root[data-theme="dark"]`; reduced-motion overrides set durations to 0 |
| `DESIGN-SYSTEM.md` | Principles (3–5), color roles table (hex light/dark, contrast), type scale table, spacing/radius/shadow/motion tables, component specs (anatomy/variants/states/a11y/do-don't), patterns, naming rules (`--{category}-{property}-{variant}`), versioning (semver; token rename = major) |
| `components.html` | Single page importing `tokens.css` inline; every component in every state, light/dark toggle, pattern blocks. Must pass `bds.mjs verify` |

## Principles section guidance
Derive from the candidate's concept, phrased as decisions, e.g. "Type carries hierarchy; color is reserved for one action per view." Avoid generic values ("clean", "modern").
