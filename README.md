# VIINYL — Vinyl Gallery

A Vite + GSAP interactive vinyl record gallery with animated scene transitions.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

> ⚠️ If you open `index.html` directly (double click), the app will fail because `main.js` imports `gsap` as an npm module. Use the Vite dev server (`npm run dev`) or a production build.

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
Selector Scene  →  Detail Scene
Detail Scene    →  Back to Selector
Detail Scene    →  Previous / Next vinyl
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
