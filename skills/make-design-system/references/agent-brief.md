# Agent brief template (step 4)

Spawn one `general-purpose` agent per candidate, all in ONE message (parallel, `run_in_background: true`).
Fill every `{…}`. Keep the brief self-contained — agents do not see this conversation.

```text
Build ONE design-system candidate as a single self-contained HTML file. Final report in {user language}, ≤8 lines.

FIRST: invoke the Skill tool with skill "{lead-skill}" and follow it; also invoke "full-output-enforcement".
In your report, state which skills you actually invoked.

Mode: **{Distinct|Close}** (from Step 0.5). In Close mode you are *meant* to resemble the reference's shape —
alternating planes, oversized display type, its nav pattern — and only its trademark and assets are off limits.
In Distinct mode every line of BANNED.md is forbidden.

Context: the user will restyle their own site ({business one-liner}). A reference site was analyzed:
- {project}/.benchmark/REFERENCE.md — read for information needs and quality bar ONLY.
- {project}/.benchmark/BANNED.md — every line in it is forbidden in your output. Read it before designing; its
  scope depends on the mode above.
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
- Light AND dark: full light palette on bare :root; redefine only tokens under @media (prefers-color-scheme: dark)
  and again under :root[data-theme="dark"]. Never define a color only inside a media query.
- Every text colour ≥4.5:1 on its own surface in BOTH themes. oklab()/color-mix() cannot be read as strings —
  paint them into a 1×1 canvas and read the pixel.
- Content visible at rest (no section stuck at opacity 0 before scroll).

Verify (tools already installed — do not npm install anything):
  node {skill}/scripts/bds.mjs verify {file}              → must print "ok": true
  (no npm install, no PUPPETEER_CACHE_DIR export needed — bds.mjs pins its own browser cache)
  node {skill}/scripts/bds.mjs shots {file} --out {dir}/shots
**Open the screenshots with the Read tool** — a path is not a look. Fix visual bugs, re-run verify until ok.
Do not write your own screenshot scripts; `shots` already dismisses consent/notice modals and reports what it removed.

Report: concept one-liner, IA summary, palette hexes, fonts, signature moves, skills invoked, verify result, file path.
```

## Rework brief (when a candidate still resembles the reference)
Reuse the template, add at top:
`Rework {file} (backup already at v1.html — do not touch). Keep :root tokens, fonts and the Design System section; rewrite STRUCTURE/IA to the one below.`
