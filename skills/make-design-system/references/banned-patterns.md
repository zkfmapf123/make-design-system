# BANNED.md — how to write it (step 2)

Goal: candidates must be **inspired by the reference's quality and information needs, not by its shape**.
First-pass experience: when agents only got "different colors/fonts", all 5 candidates reused the reference's section order and signature components and looked like re-skins. BANNED.md prevents that.

## Two modes — read Step 0.5 first

`BANNED.md` is written **to the mode the user chose**, not to a default.

| | Distinct mode | Close mode |
|---|---|---|
| Ban the section ORDER | yes | **no** |
| Ban signature COMPONENTS | yes | **no** |
| Ban the NAV shape | yes | **no** |
| Ban signature MOTION | yes | only what breaks the user's own constraints |
| Ban exact brand hexes (±10% hue) | yes | **exact hex only** — near hues are how five candidates stay apart |
| Ban the font pairing | yes | **licensed / self-hosted faces only** |
| Ban reference COPY, logos, images, `src/` code | yes | **yes** |

### Close-mode file (short on purpose)

```markdown
# BANNED (from <url>) — Close mode: trademark and assets only
- BRAND: exact hex #XXXXXX. Near hues are fine, but give each candidate its own accent so they stay apart
- BRAND: <licensed font name> (self-hosted / paid). Pick a freely licensed face with the same personality
- ASSET: the reference's logos, images, 3D renders and video. Draw equivalents with CSS/SVG instead
- COPY: any reference sentence, including translated
- CODE: anything from .benchmark/src
grep: (#XXXXXX|<FontName>)
```

Everything else the reference does — alternating full-bleed planes, oversized display type, pill nav,
its section order — is **what the user asked for**. Do not ban it back by habit.

## What goes in

1. **Section order** — the reference's exact sequence, written as one line. Candidates may not reproduce it (reordering 1–2 sections is not enough; the IA must come from the candidate's own concept).
2. **Signature components** — every item from REFERENCE.md "Signature patterns". Be concrete: component + placement.
3. **Navigation shape** — header layout (e.g. "logo left, two pill CTAs + hamburger right"), menu type, floating buttons.
4. **Signature motion** — reveal style, highlight effect, pinned/looping sequences that define the feel.
5. **Brand surface** — accent hexes (±10% hue counts as same), font pairing, dominant motif shape.
6. **Copy** — no sentences or taglines from the reference, even translated.

## Format

```markdown
# BANNED (from <url>)
- ORDER: hero → 3 service rows → centered statement → 3×3 portfolio rows → 3 feature cards → A+B process → 50/50 photo split → contact → footer
- COMPONENT: contact block with phone mockup and chat bubbles
- COMPONENT: "A + B = result" merge diagram
- COMPONENT: trio of equal cards in 3 brand colors
- NAV: logo left + two pill CTAs + hamburger; fullscreen colored menu overlay
- NAV: floating bottom-right chat/quick button
- MOTION: left-to-right color fill on highlighted words
- MOTION: infinite marquee of circle objects in hero
- BRAND: accents #E2F157 / #4754D2 (and near hues); Pretendard + DM Sans pairing; circle-heavy motifs
- COPY: any reference sentence
grep: (phone-mockup|chat-bubble|marquee|\.fill\b|#E2F157|#4754D2|DM Sans)
```

The last `grep:` line is a regex the main agent runs over each candidate in step 5. Hits are reviewed, not auto-failed (a word like "marquee" may be legitimate in a different form).

The example above is the one produced for the first real run (a video-marketing agency site); replace every line for a new reference.
