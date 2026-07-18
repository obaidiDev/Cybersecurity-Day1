# Majal — Cybersecurity Foundations · Day 1

An interactive reveal.js deck for the first day of the Majal cybersecurity course, built on the Majal brand identity.

## Run it
Open `index.html` in a browser. Everything (reveal.js, confetti) is vendored locally, so it works **offline** — with one exception below.

For the two saved artifacts to persist reliably across days, serve the folder instead of double-clicking:
```bash
cd majal-day1
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```
Hosting it (e.g. on majal.website) is the most reliable option for the week.

## Controls
- Arrow keys / space to move · `F` fullscreen · `S` speaker notes · `Esc` slide overview.
- Each interactive slide has speaker notes for the instructor.

## The five interactions (one distinct mechanic each)
1. **CIA triad → tension console** — drag the dials, watch a pillar starve. Balance, not a quiz.
2. **Threat actors → whodunit** — clues drop in, suspects get ruled out, you name the culprit (3 cases).
3. **Attack surface → guess-then-expand** — guess a number, watch ~16 ways-in explode past it.
4. **Kill chain → narrative walk** — walk a real intrusion down 8 stages. *This is the weekly map.*
5. **MITRE ATT&CK → explore & label** — clickable matrix; tag each attack onto it. *This is the weekly board.*

## The two artifacts you reuse all week
- `components/killchain-map.html` — the 8-stage attack-lifecycle map. Day 1 is pre-filled with a retail
  ransomware intrusion (hit **▶ Walk the attack**). Days 2–5: hit **+ New day**, fill in each new attack.
- `components/attack-board.html` — the MITRE ATT&CK board. Day 1 is pre-tagged with the same intrusion’s
  techniques. Switch the day and tag each new attack; coverage builds across the week.

Both save to your browser automatically. Open them standalone on Days 2–5, or they’re embedded in the deck.
**Export** buttons download the JSON if you want to back up or move between machines.

## Brand notes
- Colours, logo mark, and the arrow motif follow the Majal identity (teal / deep petrol / yellow accent).
- Fonts: **Jost** stands in for Avenir (the licensed brand face) and loads from Google Fonts — the only piece
  that needs internet. Offline, it falls back to a system geometric sans. To go fully offline, drop Avenir
  (or Jost) `.woff2` files into `assets/` and swap the `@import` in `css/theme.css` for `@font-face` rules.
- **IBM Plex Mono** is used for ATT&CK IDs (echoes the brand’s IBM Plex family); IBM Plex Sans Arabic for Arabic.
# Cybersecurity-Day1
