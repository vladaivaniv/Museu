# VIINYL — Vinyl Gallery

A Vite + GSAP interactive vinyl record gallery with animated scene transitions.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
/
├── index.html        Main HTML — stage, nav, scenes, vinyl SVGs
├── styles.css        All CSS — colors, stage, scenes, records, UI
├── main.js           GSAP state machine — transitions, navigation
├── vite.config.js    Vite configuration
└── package.json      Dependencies
```

## Scene Flow

```
[01] Dark Hero  →  [02] Green Focus  →  [03] Brown Focus
                                              ↓
[05] Dark Hero  ←  [04] Green Focus  ←  (3D flip)
```

## Navigation

- Arrow buttons (bottom-right)
- Keyboard: ArrowRight / ArrowLeft
- Touch: swipe left/right

## Tech Stack

- **Vite** — dev server and bundler
- **GSAP** — all animations and transitions
- **Vanilla JS** — no framework
- **CSS custom properties** — theming
- **Google Fonts** — Space Grotesk + Barlow Condensed
