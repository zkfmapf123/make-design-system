---
name: make-design-system
description: Use when the user gives a reference/benchmark website URL and wants new design directions or a design system inspired by it (not a copy) — analyzes the site, builds 5 structurally original HTML candidates in parallel, lets the user pick or combine one, then produces tokens, components and docs (optional DTCG/Tailwind/Tokens Studio/Claude Design System exports). Triggers: "벤치마킹", "이 사이트처럼", "디자인 시스템 만들어", "design candidates from URL", "/make-design-system <url>".
---

# make-design-system

Reference URL → analysis → banned list → 5 original candidates → user choice → design system.

**Hard rule:** reference code, copy, images, logos and paid fonts are never shipped. `.benchmark/` is never zipped or uploaded.
**How much of its *shape* you may reuse is the user's call, not a default** — settle it in Step 0.5 before any design work.

`SKILL_DIR` = the folder containing this file. `PROJECT` = the user's current working directory (create `candidates/`, `design-system/`, `.benchmark/` there).

## Step 0 — Preflight
1. `bash SKILL_DIR/scripts/setup.sh` → prints `ready` (first run installs puppeteer + sharp + a browser into `SKILL_DIR/scripts`, ~250MB; tell the user before running it the first time).
2. Required taste-skills (Leonxlnx/taste-skill): `minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, `gpt-taste`, `design-taste-frontend`, `full-output-enforcement`, `stitch-design-taste`, `redesign-existing-projects`, `brandkit`, `image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `design-taste-frontend-v1`.
   Check the available-skills list. If any core one is missing, show and (after user OK) run:
   `npx skills add Leonxlnx/taste-skill -s '*' -a claude-code -y` (add `-g` for global), then ask the user to run `/reload-plugins`.
3. Add `.benchmark/` to `PROJECT/.gitignore` if a git repo.

## Step 0.5 — Ask how close (checkpoint, before any analysis framing)

"Benchmark this site" means two opposite things and the wrong guess costs a full build round
(~100–180k tokens per candidate). **Ask with AskUserQuestion before Step 2.** One question, two options:

| Mode | The user means | What changes |
|---|---|---|
| **Distinct** (default for agencies, competitors, anything where a clone is a legal or brand risk) | "Learn from its quality, then give me something of my own" | Step 2 writes the full BANNED.md — order, components, nav, motion, brand, copy |
| **Close** | "Make mine look like this" | Step 2 writes a **reduced** BANNED.md — trademark and assets only: exact brand hexes, licensed/self-hosted fonts, their sentences, logos, images, and any code from `.benchmark/src`. Section order, component shapes, nav pattern and motion are **allowed** |

Record the answer in `.benchmark/REFERENCE.md` under `## Mode`, and repeat it verbatim in every agent brief.

**Why this exists:** on the first real run the user said "벤치마킹" meaning *close*, got five deliberately
distinct candidates, and answered "베끼진 않지만 전혀 다르잖아" — the whole round was rebuilt in Close mode.
The machinery was fine; nobody had asked. Do not infer the mode from the industry alone.

In **Close** mode also tell the agents what still has to differ, or five candidates collapse into one:
give each candidate its **own accent hue** and **own structural idea**, and say that the accent must not be
the reference's hue ±10%.

## Step 1 — Capture & analyze
```bash
node SKILL_DIR/scripts/bds.mjs capture <url> --out .benchmark
node SKILL_DIR/scripts/bds.mjs shots   <url> --out .benchmark/shots
node SKILL_DIR/scripts/bds.mjs grid .benchmark/shots --prefix d && node SKILL_DIR/scripts/bds.mjs grid .benchmark/shots --prefix m --cols 5 --per 10
```
- Read the grid images (not every shot), `analysis.json`, and skim `.benchmark/src/*` for motion/breakpoint logic.
- If the full-page looks blank below the fold, that is scroll-smoothing/animation — the viewport shots are the truth.
- Bot-blocked / login-only site: ask the user for screenshots and proceed from those.
- Write `.benchmark/REFERENCE.md` per `references/reference-template.md`.

## Step 2 — Banned list
Write `.benchmark/BANNED.md` per `references/banned-patterns.md`, **scoped to the Step 0.5 mode**, ending with a `grep:` regex line.
In Close mode the file is short: trademark + assets only. Do not ban the reference's IA, components, nav or motion —
the user asked for them.

## Step 3 — Propose directions (checkpoint)
From `references/pattern-catalog.md`, pick 5 directions suited to the user's business and mutually distinct. **In Close mode the catalog is the wrong source** — the directions are instead five readings of the reference's own language, separated by accent hue and one structural idea each. Say so in the table, so the user can see at a glance that these will resemble the reference. Present a table: # · name · concept · IA in one line · palette/font idea · lead skill. Ask (AskUserQuestion) to confirm, swap, or reduce to 3 (cost: ~100–180k tokens per candidate). Don't build before confirmation.

## Step 4 — Build in parallel
One `general-purpose` agent per direction, all spawned in a single message, background. Use `references/agent-brief.md` verbatim with blanks filled. Output: `PROJECT/candidates/NN-slug/index.html`.

## Step 5 — Verify
When all agents report:
- `node SKILL_DIR/scripts/bds.mjs verify candidates/NN-slug/index.html` for each (must be `"ok": true`).
- Run the BANNED `grep:` regex over each file; inspect hits.
- Check each report names the skills it invoked.
- If a candidate still mirrors the reference's IA, re-brief that agent with the rework block (back up to `v1.html` first).

## Step 6 — Present
- `open -a "Google Chrome" candidates/*/index.html` (macOS; otherwise give paths).
- Comparison table: concept · IA signature · accent hex · fonts · fits-best-for · known limits.
- Offer (don't do unasked): zip / S3 upload via `bash SKILL_DIR/scripts/publish-s3.sh candidates <bucket> [prefix] [public-domain]` — confirm bucket and warn the links become public.

## Step 7 — Design system (checkpoint)
1. User picks one candidate or a combination ("03 layout + 04 motion").
2. Build base outputs per `references/design-system-spec.md` into `PROJECT/design-system/`; verify `components.html` with `bds.mjs verify`.
3. Ask (AskUserQuestion, multiSelect) which extra formats to add, per `references/export-formats.md`:
   A. W3C DTCG `tokens.json` · B. Tailwind · C. Figma Tokens Studio · D. Claude Design System artifact.
4. Generate the chosen ones, then summarize files + next step (applying to the user's real site uses `redesign-existing-projects`).

## Output layout
```
PROJECT/
├── .benchmark/        analysis only — never shipped (REFERENCE.md, BANNED.md, analysis.json, src/, shots/)
├── candidates/NN-slug/index.html (+ shots/)
└── design-system/     tokens.css, DESIGN-SYSTEM.md, components.html, [tokens.json, tailwind.*, tokens-studio.json]
```

## Troubleshooting

- **`Could not find chrome-headless-shell`** — `.puppeteerrc.cjs` is resolved from the *current working directory*,
  so running the CLI from the user's project used to fall back to `~/.cache/puppeteer`. `bds.mjs` now pins
  `PUPPETEER_CACHE_DIR` to its own folder; if it still fails, re-run `bash SKILL_DIR/scripts/setup.sh`.
- **Custom scripts that reuse these `node_modules`** must launch with `headless: 'shell'` — only
  chrome-headless-shell is downloaded, never full Chrome.
- **Consent / cookie / regional-notice modals** are dismissed automatically by `capture`, `shots` and `verify`
  (click the accept control, then remove any fixed element covering >35% of the viewport). The result reports
  `overlays: {clicked, stripped}` — if a grid still looks covered, pass `--keep-overlays` to see the raw state
  and fix the selector rather than writing your own screenshot script.
- **Bot-blocked or login-only** site: ask the user for screenshots and proceed from those.

## Common mistakes
- **Skipping Step 0.5 and assuming Distinct.** The most expensive mistake in this skill: five finished candidates the user did not want.
- Letting agents vary only colors/fonts → re-skins of the reference. In Distinct mode BANNED.md + per-direction IA prevent it.
- Agents writing their own screenshot scripts into a shared path and overwriting each other → always use `bds.mjs`.
- Skipping the step-3 checkpoint → 500k+ tokens spent on directions the user didn't want.
- Uploading `.benchmark/` or `v1.html` files → only `*/index.html` is published.
