# Export formats (step 7 — user picks, multi-select)

Ask with AskUserQuestion (multiSelect: true) after the base outputs exist. Generate each chosen format from `tokens.css` so all formats share one source of truth.

## A. W3C Design Tokens (DTCG) — `tokens.json`
```json
{
  "color": {
    "teal": { "600": { "$type": "color", "$value": "#0F7B6C" } },
    "accent": { "$type": "color", "$value": "{color.teal.600}", "$description": "Primary action" }
  },
  "space": { "4": { "$type": "dimension", "$value": "16px" } },
  "motion": { "base": { "$type": "duration", "$value": "240ms" } }
}
```
- Semantic tokens reference primitives with `{path}` aliases. Dark theme: separate `tokens.dark.json` with the same semantic keys.
- Works with Style Dictionary / Terrazzo for multi-platform builds.

## B. Tailwind — `tailwind.tokens.css` (v4) and/or `tailwind.config.js` (v3)
- v4: `@theme { --color-accent: …; --font-display: …; --radius-lg: …; }` mapping semantic tokens; dark via `@custom-variant dark` + the same `[data-theme]` selector.
- v3: `theme.extend.colors.accent = 'var(--color-accent)'` etc., keeping CSS variables as the runtime source.
- Ask which version if the user's project is unknown.

## C. Figma Tokens Studio — `tokens-studio.json`
- Token sets `primitive`, `semantic/light`, `semantic/dark`; `$themes` array mapping light/dark; types `color`, `dimension`, `fontFamilies`, `fontWeights`, `lineHeights`, `boxShadow`, `borderRadius`.
- Tell the user: import via Tokens Studio plugin → "Load from file", then "Export styles & variables to Figma".

## D. Claude Design System artifact
Publishes the system as a browsable Design System on claude.ai (README, tokens across themes, components with live previews, guidelines). Later Claude decks/designs can build on it.
1. `Artifact` action `list` with `scope: "types"` → take the `type_url` of the type titled "Design System" (do not hardcode it).
2. `Artifact` publish with that `type_url`, `title` = "<Brand> Design System", no files, `auto_open: "after_first_write"`.
3. Follow the instructions returned by that publish exactly (which files, which store, required README/tokens/components layout). Feed it from `tokens.css`, `DESIGN-SYSTEM.md` and `components.html`.
4. Give the user the artifact URL; it is private until they share it.
If the Artifact tool or the type is unavailable in the session, say so and skip D.
