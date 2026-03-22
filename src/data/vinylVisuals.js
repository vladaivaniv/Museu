// Per-vinyl SVG visual configuration extracted from the original HTML.
// Each entry maps to the same index in vinyls.js.

export const vinylVisuals = [
  // 0: Green — Klark Kent
  {
    discFill: 'rgba(22,160,60,0.88)',
    grooveStroke: 'rgba(0,0,0,0.18)',
    detailGrooveAlt: 'rgba(255,255,255,0.04)',
    shine: { rx: 30, ry: 18, fill: 'rgba(255,255,255,0.06)' },
    label: { fill: '#e8e0d0', radius: 34, detailRadius: 42 },
    spindle: { fill: '#ccc', detailFill: '#d0cdc8' },
    selectorText: [
      { text: "DON'T CARE", y: 97, fontSize: 5, fill: '#1a1a1a', bold: true },
      { text: 'KLARK KENT', y: 106, fontSize: 3.8, fill: '#666', bold: false },
    ],
    detailText: [
      { text: "DON'T CARE", y: 93, fontSize: 5.5, fill: '#1a1a1a', bold: true },
      { text: 'A&M RECORDS', y: 101, fontSize: 4, fill: '#555', bold: false },
      { text: 'KLARK KENT', y: 110, fontSize: 4.5, fill: '#1a1a1a', bold: true },
    ],
  },
  // 1: Black — Snips
  {
    discFill: '#111111',
    grooveStroke: 'rgba(255,255,255,0.07)',
    detailGrooveAlt: 'rgba(0,0,0,0.5)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.04)' },
    label: { fill: '#c8784a', radius: 34, detailRadius: 40 },
    spindle: { fill: '#f0ede8', detailFill: '#f0ede8' },
    selectorText: [
      { text: "WHAT'S YOUR", y: 97, fontSize: 4.5, fill: '#fff', bold: true },
      { text: 'NUMBER', y: 106, fontSize: 4.5, fill: '#fff', bold: true },
    ],
    detailText: [
      { text: 'EMI 5040', y: 92, fontSize: 5.5, fill: '#fff', bold: true },
      { text: "WHAT'S YOUR NUMBER", y: 101, fontSize: 4, fill: 'rgba(255,255,255,0.8)', bold: false },
      { text: 'SNIPS', y: 110, fontSize: 4.5, fill: '#fff', bold: true },
    ],
  },
  // 2: Crimson — The Clash
  {
    discFill: 'rgba(185,25,25,0.88)',
    grooveStroke: 'rgba(0,0,0,0.22)',
    detailGrooveAlt: 'rgba(255,255,255,0.05)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.08)' },
    label: { fill: '#111111', radius: 34, detailRadius: 40 },
    spindle: { fill: '#888', detailFill: '#888' },
    selectorText: [
      { text: 'LONDON', y: 97, fontSize: 5, fill: '#fff', bold: true },
      { text: 'CALLING', y: 106, fontSize: 5, fill: '#fff', bold: true },
    ],
    detailText: [
      { text: 'CBS RECORDS', y: 92, fontSize: 5.5, fill: '#fff', bold: true },
      { text: 'LONDON CALLING', y: 101, fontSize: 4, fill: 'rgba(255,255,255,0.7)', bold: false },
      { text: 'THE CLASH', y: 110, fontSize: 4.5, fill: '#fff', bold: true },
    ],
  },
  // 3: Midnight Blue — Joy Division
  {
    discFill: 'rgba(10,25,90,0.92)',
    grooveStroke: 'rgba(255,255,255,0.08)',
    detailGrooveAlt: 'rgba(0,0,0,0.4)',
    shine: { rx: 26, ry: 15, fill: 'rgba(255,255,255,0.05)' },
    label: { fill: '#e8e8f5', radius: 34, detailRadius: 40 },
    spindle: { fill: '#aaa', detailFill: '#aaa' },
    selectorText: [
      { text: 'LOVE WILL', y: 95, fontSize: 4.2, fill: '#1a1a3a', bold: true },
      { text: 'TEAR US', y: 103, fontSize: 4.2, fill: '#1a1a3a', bold: true },
      { text: 'APART', y: 111, fontSize: 4.2, fill: '#1a1a3a', bold: true },
    ],
    detailText: [
      { text: 'FACTORY', y: 90, fontSize: 5, fill: '#1a1a3a', bold: true },
      { text: 'LOVE WILL TEAR US APART', y: 99, fontSize: 3.8, fill: '#444', bold: false },
      { text: 'JOY DIVISION', y: 108, fontSize: 4.5, fill: '#1a1a3a', bold: true },
    ],
  },
  // 4: Ivory — Talking Heads
  {
    discFill: 'rgba(232,227,208,0.95)',
    grooveStroke: 'rgba(0,0,0,0.1)',
    detailGrooveAlt: 'rgba(255,255,255,0.3)',
    shine: { rx: 30, ry: 18, fill: 'rgba(255,255,255,0.25)' },
    label: { fill: '#d04818', radius: 34, detailRadius: 40 },
    spindle: { fill: '#c0b8a0', detailFill: '#c0b8a0' },
    selectorText: [
      { text: 'ONCE IN A', y: 96, fontSize: 4.2, fill: '#fff', bold: true },
      { text: 'LIFETIME', y: 105, fontSize: 4.2, fill: '#fff', bold: true },
    ],
    detailText: [
      { text: 'SIRE RECORDS', y: 92, fontSize: 5, fill: '#fff', bold: true },
      { text: 'ONCE IN A LIFETIME', y: 101, fontSize: 4, fill: 'rgba(255,255,255,0.8)', bold: false },
      { text: 'TALKING HEADS', y: 110, fontSize: 4.5, fill: '#fff', bold: true },
    ],
  },
  // 5: Purple — Siouxsie
  {
    discFill: 'rgba(108,35,148,0.88)',
    grooveStroke: 'rgba(255,255,255,0.07)',
    detailGrooveAlt: 'rgba(0,0,0,0.3)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.07)' },
    label: { fill: '#f0e8ff', radius: 34, detailRadius: 40 },
    spindle: { fill: '#c0a8e0', detailFill: '#c0a8e0' },
    selectorText: [
      { text: 'HONG KONG', y: 95, fontSize: 4, fill: '#4a1870', bold: true },
      { text: 'GARDEN', y: 104, fontSize: 4, fill: '#4a1870', bold: true },
    ],
    detailText: [
      { text: 'POLYDOR', y: 92, fontSize: 5, fill: '#4a1870', bold: true },
      { text: 'HONG KONG GARDEN', y: 101, fontSize: 4, fill: '#6a3890', bold: false },
      { text: 'SIOUXSIE & THE BANSHEES', y: 110, fontSize: 3.5, fill: '#4a1870', bold: true },
    ],
  },
  // 6: Orange — Buzzcocks
  {
    discFill: 'rgba(225,90,18,0.88)',
    grooveStroke: 'rgba(0,0,0,0.2)',
    detailGrooveAlt: 'rgba(255,255,255,0.06)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.09)' },
    label: { fill: '#f5f5f0', radius: 34, detailRadius: 40 },
    spindle: { fill: '#ccc', detailFill: '#ccc' },
    selectorText: [
      { text: 'EVER FALLEN', y: 95, fontSize: 3.8, fill: '#222', bold: true },
      { text: 'IN LOVE', y: 103, fontSize: 3.8, fill: '#222', bold: true },
    ],
    detailText: [
      { text: 'UNITED ARTISTS', y: 92, fontSize: 5, fill: '#222', bold: true },
      { text: 'EVER FALLEN IN LOVE', y: 101, fontSize: 3.8, fill: '#555', bold: false },
      { text: 'BUZZCOCKS', y: 110, fontSize: 4.5, fill: '#222', bold: true },
    ],
  },
  // 7: Yellow — The Jam
  {
    discFill: 'rgba(210,182,0,0.9)',
    grooveStroke: 'rgba(0,0,0,0.15)',
    detailGrooveAlt: 'rgba(255,255,255,0.2)',
    shine: { rx: 30, ry: 18, fill: 'rgba(255,255,255,0.18)' },
    label: { fill: '#1a1890', radius: 34, detailRadius: 40 },
    spindle: { fill: '#b8a200', detailFill: '#b8a200' },
    selectorText: [
      { text: 'GOING', y: 96, fontSize: 4.2, fill: '#fff', bold: true },
      { text: 'UNDERGROUND', y: 106, fontSize: 4.2, fill: '#fff', bold: true },
    ],
    detailText: [
      { text: 'POLYDOR', y: 92, fontSize: 5, fill: '#fff', bold: true },
      { text: 'GOING UNDERGROUND', y: 101, fontSize: 4, fill: 'rgba(255,255,255,0.8)', bold: false },
      { text: 'THE JAM', y: 110, fontSize: 4.5, fill: '#fff', bold: true },
    ],
  },
  // 8: Teal — Wire
  {
    discFill: 'rgba(18,162,152,0.88)',
    grooveStroke: 'rgba(0,0,0,0.18)',
    detailGrooveAlt: 'rgba(255,255,255,0.06)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.07)' },
    label: { fill: '#f0fafa', radius: 34, detailRadius: 40 },
    spindle: { fill: '#a0d8d5', detailFill: '#a0d8d5' },
    selectorText: [
      { text: 'OUTDOOR', y: 97, fontSize: 5, fill: '#0a4040', bold: true },
      { text: 'MINER', y: 107, fontSize: 5, fill: '#0a4040', bold: true },
    ],
    detailText: [
      { text: 'HARVEST', y: 92, fontSize: 5, fill: '#0a4040', bold: true },
      { text: 'OUTDOOR MINER', y: 101, fontSize: 4, fill: '#2a6060', bold: false },
      { text: 'WIRE', y: 110, fontSize: 4.5, fill: '#0a4040', bold: true },
    ],
  },
  // 9: Magenta — Magazine
  {
    discFill: 'rgba(198,42,118,0.88)',
    grooveStroke: 'rgba(0,0,0,0.18)',
    detailGrooveAlt: 'rgba(255,255,255,0.06)',
    shine: { rx: 28, ry: 16, fill: 'rgba(255,255,255,0.07)' },
    label: { fill: '#111111', radius: 34, detailRadius: 40 },
    spindle: { fill: '#888', detailFill: '#888' },
    selectorText: [
      { text: 'SHOT BY', y: 96, fontSize: 4, fill: '#fff', bold: true },
      { text: 'BOTH SIDES', y: 105, fontSize: 4, fill: '#fff', bold: true },
    ],
    detailText: [
      { text: 'VIRGIN', y: 92, fontSize: 5, fill: '#fff', bold: true },
      { text: 'SHOT BY BOTH SIDES', y: 101, fontSize: 4, fill: 'rgba(255,255,255,0.7)', bold: false },
      { text: 'MAGAZINE', y: 110, fontSize: 4.5, fill: '#fff', bold: true },
    ],
  },
];
