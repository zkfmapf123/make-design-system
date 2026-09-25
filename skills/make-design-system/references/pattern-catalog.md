# Pattern catalog (step 3)

Each direction = **concept + own information architecture (IA) + visual language + lead taste-skill**.
Pick 5 (or the count the user chose) that suit the reference's industry and differ from each other on all four axes. Adapt IA section names to the user's business; keep the *mechanism* of each IA (e.g. "TOC doubles as nav").
Never pick a direction whose palette/fonts collide with BANNED.md; swap the accent instead.

## Core 5 (proven in first run)

### 01 Minimal Editorial — skill: `minimalist-ui`
- Concept: the site is one issue of a magazine.
- IA: masthead cover (issue no./date, oversized title, cover-story teaser) + "In this issue" TOC as primary nav → editor's letter (drop cap, signature) → services as numbered chapters with margin footnotes → client pull-quote → one lead case feature + 2-col archive index (year · client type · format, cursor-follow thumbnail) → "how we work" footnote list + "by the numbers" sidebar → letter-style contact form → colophon footer.
- Visual: warm paper, ink, ONE muted accent; serif display + clean sans body + mono meta; hairline/double rules; restrained motion (line reveals, underline draw).
- Fits: trust-driven, text-heavy, consulting, publishing.

### 02 Industrial Signal — skill: `industrial-brutalist-ui`
- Concept: control room / spec sheet.
- IA: persistent status bar (clock, "accepting projects", queue) → console hero with live log lines + "request ID" button that pre-fills contact → capabilities as expandable spec table → filterable work index (chips; hover preview follows cursor) → animated metric counters → vertical pipeline log (stage IDs, status LEDs, durations) → roster of ID-badge cards → terminal-style form (--name, --budget) with ACK output → footer with coordinates/build string.
- Visual: concrete grays + ONE signal color, visible 12-col grid, mono labels, condensed heavy display, square corners, hard-cut (stepped) reveals, tickers.
- Fits: tech, B2B, dev tools, manufacturing.

### 03 Soft Premium — skill: `high-end-visual-design`
- Concept: showcase-first concierge.
- IA: floating glass header (centered wordmark, 3 links, single "Book a call") → hero = one featured case film with result metric → asymmetric bento of work (hover reveals meta) → services accordion (deliverables, timeline bar, starting price) → outcome metrics → testimonial carousel → engagement plans (project/retainer/partnership) → FAQ → calm closing CTA; contact is a slide-in drawer with time-slot chips.
- Visual: deep ink ↔ pearl sections, one warm metallic/coral accent, large radii, layered soft shadows, grain/mesh, magnetic buttons, blur-in reveals.
- Fits: premium agency, enterprise clients, luxury.

### 04 Kinetic Cinema — skill: `gpt-taste`
- Concept: the website is a film.
- IA: HUD instead of header (REC dot, running timecode mapped to scroll, "SC 03/07") + scene-select overlay → cold open (3-2-1 leader, fullscreen reel, title card) → logline → genres (services) as 2:3 posters → filmography scrubber by year (drag/keys/scroll moves playhead) → production call sheet (pre/shoot/post/release) → cast & crew credit cards → casting-call slate form (take number increments) → auto-rolling credits footer → "THE END" / post-credits link.
- Visual: charcoal + cream + ONE hot accent, huge condensed display, viewfinder corners, sprockets, slugline headers; GSAP pins, horizontal scroll (desktop only), scrubbed reveals.
- Fits: video/motion studios, entertainment, launches.

### 05 Playful Pop — skill: `design-taste-frontend`
- Concept: studio playground.
- IA: sticker tab bar (mobile: bottom tabs) → hero sticker board (draggable + keyboard-nudgeable stickers, shuffle button) → "pick your mission" goal chips that swap a recommended service card (and pre-fill contact) → polaroid/pinboard work wall + lightbox → board-game process track (token advances on scroll) → flippable trading-card team → sticker-shop testimonials (speech shapes) → multi-step form with progress stars → big wordmark footer with bouncing back-to-top sticker.
- Visual: cream base, 3 saturated friendly colors, chunky rounded display, thick outlines, hard offset shadows, blobs/squircles/stars, tilted cards, spring easing.
- Fits: consumer brands, youth, education, community.

## Extra seeds (use when the core 5 clash with the reference or industry)

- **Swiss Data** (`minimalist-ui` + `stitch-design-taste`): annual-report IA — key figures cover, chapters as charts, case studies as data stories. Grid-strict, one primary + one data palette.
- **Organic Craft** (`high-end-visual-design`): studio-visit IA — "the workshop" hero, materials/process first, portfolio as objects on a table, appointment form. Earth tones, textured paper, hand-drawn rules.
- **Retro OS** (`industrial-brutalist-ui`): desktop-OS IA — windows as sections, icons as nav, portfolio in a file browser, contact as a dialog. Pixel/bitmap accents, bevels.
- **Museum Wall** (`minimalist-ui`): exhibition IA — rooms as sections, wall labels as captions, audio-guide numbers, visitor book contact. Gallery white, placard typography.
- **Sports Broadcast** (`gpt-taste`): match-day IA — scoreboard hero, lineup (team), highlights reel (work), stats, fixtures (process/timeline), ticket form. Bold italics, broadcast lower-thirds.

## Supporting taste-skills
- `full-output-enforcement` — add to every agent brief (no truncated code).
- `stitch-design-taste` — structure reference for DESIGN-SYSTEM.md in step 7.
- `redesign-existing-projects` — after step 7, when applying the system to the user's real site.
- `brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code` — only if an image-generation tool is available; otherwise skip.
