# Agent brief template (step 4)

Spawn one `general-purpose` agent per candidate, all in ONE message (parallel, `run_in_background: true`).
Fill every `{…}`. Keep the brief self-contained — agents do not see this conversation.

```text
Build ONE design-system candidate as a single self-contained HTML file. Final report in {user language}, ≤8 lines.

FIRST: invoke the Skill tool with skill "{lead-skill}" and follow it; also invoke "full-output-enforcement".
In your report, state which skills you actually invoked.

Context: the user will restyle their own site ({business one-liner}). A reference site was analyzed:
- {project}/.benchmark/REFERENCE.md — read for information needs and quality bar ONLY.
- {project}/.benchmark/BANNED.md — every line is forbidden in your output (order, components, nav, motion, brand, copy).
Never copy code, copy, images or logos from the reference or from .benchmark/src.

Direction: "{name}" — {concept}.
Information architecture (build exactly this, in this order):
{IA bullets from pattern-catalog, adapted}
Visual language: {palette idea, font roles (Korean-capable if user language is Korean), shape, motion}.

Requirements:
- Output: {project}/candidates/{NN-slug}/index.html (create folder). Single file, inline CSS/JS. External assets only from cdn.jsdelivr.net, cdnjs.cloudflare.com, fonts.googleapis.com.
- A "Design System" section (top, bottom, or reachable from nav): color swatches (hex + role), type scale, spacing/radius/shadow, button/badge/card/input samples. All tokens as CSS custom properties on :root.
- Images/illustrations = placeholder boxes (.ph with a small label like "16:9 image"). Placeholder copy you write; brand name "BRAND".
- Responsive 1440 and 390; working nav on both; visible focus states; alt/aria; prefers-reduced-motion stops motion.
- Content visible at rest (no section stuck at opacity 0 before scroll).

Verify (tools already installed — do not npm install anything):
  node {skill}/scripts/bds.mjs verify {file}              → must print "ok": true
  node {skill}/scripts/bds.mjs shots {file} --out {dir}/shots
Look at the screenshots, fix visual bugs, re-run verify until ok. Do not write your own screenshot scripts.

Report: concept one-liner, IA summary, palette hexes, fonts, signature moves, skills invoked, verify result, file path.
```

## Rework brief (when a candidate still resembles the reference)
Reuse the template, add at top:
`Rework {file} (backup already at v1.html — do not touch). Keep :root tokens, fonts and the Design System section; rewrite STRUCTURE/IA to the one below.`
