/**
 * VIINYL GALLERY — main.js
 * GSAP-driven scene state machine
 *
 * State indices:
 *   0  →  dark-hero
 *   1  →  green-focus
 *   2  →  brown-focus
 *
 * Navigation sequence (forward):  0 → 1 → 2 → 1 → 0 …
 * The counter shows:               01 → 02 → 03 → 04 → 05
 */

// gsap loaded via CDN script tag in index.html
/* global gsap */

/* ── DOM REFERENCES ── */
const stage          = document.getElementById('stage');
const sceneDarkHero  = document.getElementById('scene-dark-hero');
const sceneGreen     = document.getElementById('scene-green-focus');
const sceneBrown     = document.getElementById('scene-brown-focus');

const heroVinylDisc  = document.getElementById('hero-vinyl-disc');
const heroVinylCover = document.getElementById('hero-vinyl-cover');
const coverVideo     = document.getElementById('cover-video');
const heroInfo       = document.getElementById('hero-info');

const ghostGreen     = document.getElementById('ghost-text-green');
const ghostBrown     = document.getElementById('ghost-text-brown');

const vinylCenterGreenDisc  = document.getElementById('vinyl-center-green-disc');
const vinylCenterBlackDisc  = document.getElementById('vinyl-center-black-disc');

const wipeOverlay    = document.getElementById('wipe-overlay');
const wipePolygon    = document.getElementById('wipe-polygon');

const counterNum     = document.getElementById('counter-num');
const uiCounter      = document.getElementById('ui-counter');
const uiArrows       = document.getElementById('ui-arrows');

const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');

/* ── SCENE STATE MACHINE ── */
/*
 * Logical forward sequence:
 *   step 0 → dark-hero   (counter: 01)
 *   step 1 → green-focus (counter: 02)
 *   step 2 → brown-focus (counter: 03)
 *   step 3 → green-focus (counter: 04)  [same scene, different counter]
 *   step 4 → dark-hero   (counter: 05)  [loops back]
 *
 * We track `stepIndex` (0-4) and map it to a scene id.
 */
const TOTAL_STEPS = 5;

const stepMap = [
  { scene: sceneDarkHero, counter: '01' },
  { scene: sceneGreen,    counter: '02' },
  { scene: sceneBrown,    counter: '03' },
  { scene: sceneGreen,    counter: '04' },
  { scene: sceneDarkHero, counter: '05' },
];

let currentStep    = 0;
let isTransitioning = false;

/* ── HELPERS ── */

/**
 * Set the active scene class (opacity + pointer-events via CSS).
 * We keep the previous scene visible during the transition by not
 * removing its .is-active until the timeline calls for it.
 */
function setSceneActive(sceneEl) {
  [sceneDarkHero, sceneGreen, sceneBrown].forEach(s => {
    if (s !== sceneEl) {
      s.classList.remove('is-active');
    }
  });
  sceneEl.classList.add('is-active');
}

function updateCounter(value) {
  gsap.to(counterNum, {
    opacity: 0,
    y: -8,
    duration: 0.18,
    onComplete: () => {
      counterNum.textContent = value;
      gsap.to(counterNum, { opacity: 1, y: 0, duration: 0.22 });
    }
  });
}

function setUIMode(mode /* 'light' | 'dark' */) {
  if (mode === 'light') {
    uiCounter.classList.add('is-light');
    uiArrows.classList.add('is-light');
  } else {
    uiCounter.classList.remove('is-light');
    uiArrows.classList.remove('is-light');
  }
}

/* ── WIPE POLYGON HELPERS ── */
/*
 * The SVG viewBox is 0 0 100 100 (with preserveAspectRatio="none").
 * We animate the polygon's points attribute for the diagonal wipe.
 *
 * Collapsed (off right side):
 *   "110,0  110,0  110,100  110,100"
 *
 * Diagonal mid-state (ribbon covering upper-right to lower-left):
 *   "-10,0  110,0  110,100  -10,100"   (full cover)
 *
 * We use GSAP's attr tween plus a custom interpolator.
 */

function buildPoints(x0, x1) {
  // top-left, top-right, bottom-right, bottom-left
  // The wipe has a slight diagonal slant: top edge advances faster
  return `${x0 - 15},0 ${x1},0 ${x1 + 5},100 ${x0},100`;
}

function setWipePoints(pct) {
  // pct 0 = fully off right, pct 1 = fully covering
  const startX = 110 + ((-10 - 110) * pct);   // 110 → -10
  const endX   = 110 + ((115 - 110) * pct);    // 110 → 115 (keep full right side covered)
  wipePolygon.setAttribute('points', buildPoints(startX, endX));
}

/* ── INITIAL STATE ── */
function initScene() {
  // Only dark-hero is visible
  sceneDarkHero.classList.add('is-active');
  gsap.set(sceneDarkHero, { opacity: 1 });
  gsap.set([sceneGreen, sceneBrown], { opacity: 0 });

  // Wipe overlay hidden
  gsap.set(wipeOverlay, { opacity: 0 });

  // Hero vinyl spinning (via CSS animation already), add initial offset
  gsap.set(heroVinylDisc, { rotation: 0 });

  // Hero info: fade in
  gsap.from(heroInfo, {
    x: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.3,
  });

  // Square album cover slides in from the right, rests at -40% (covers left 60% of disc)
  gsap.set(heroVinylCover, { opacity: 1, x: '110%' });
  gsap.to(heroVinylCover, {
    x: '-58%',
    duration: 0.9,
    ease: 'power3.out',
    delay: 2.0,
    onStart: () => {
      if (coverVideo.querySelector('source')) {
        coverVideo.play().catch(() => {});
      }
    },
  });

  setUIMode('light');
}

/* ══════════════════════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════════════════════ */

/* ── DARK HERO → GREEN FOCUS ── */
function transitionToGreen(onComplete) {
  const tl = gsap.timeline({ onComplete });

  // Fade out hero info; slide cover back out to the right
  tl.to(heroInfo, {
    opacity: 0,
    x: 30,
    duration: 0.4,
    ease: 'power2.in',
  }, 0);
  tl.to(heroVinylCover, {
    x: '110%',
    duration: 0.35,
    ease: 'power2.in',
  }, 0);

  // Fade out dark hero, fade in green
  tl.to(sceneDarkHero, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.15);

  tl.call(() => {
    sceneGreen.classList.add('is-active');
    sceneDarkHero.classList.remove('is-active');
    setUIMode('dark');
  });

  tl.fromTo(sceneGreen,
    { opacity: 0 },
    { opacity: 1, duration: 0.55, ease: 'power2.out' }
  );

  // Green vinyl slides in from left-center
  tl.from('#vinyl-center-green', {
    x: -80,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
  }, '-=0.35');

  // Ghost text fades up
  tl.from(ghostGreen, {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.5');

  // Side vinyls
  tl.from('#vinyl-left-green', {
    x: -40,
    opacity: 0,
    duration: 0.55,
    ease: 'power2.out',
  }, '-=0.45');
  tl.from('#vinyl-right-green', {
    x: 40,
    opacity: 0,
    duration: 0.55,
    ease: 'power2.out',
  }, '-=0.55');

  return tl;
}

/* ── GREEN FOCUS → BROWN FOCUS (diagonal wipe) ── */
function transitionGreenToBrown(onComplete) {
  const tl = gsap.timeline({ onComplete });

  // Stage: make wipe overlay visible
  tl.set(wipeOverlay, { opacity: 1 });
  tl.call(() => { setWipePoints(0); }); // Start off-screen right

  // Brown scene ready behind the wipe
  tl.call(() => {
    sceneGreen.style.zIndex  = '2';
    sceneBrown.style.zIndex  = '3';
    gsap.set(sceneBrown, { opacity: 1 });
  });

  // Animate the diagonal wipe from right to left
  tl.to({}, {
    duration: 0.95,
    ease: 'power3.inOut',
    onUpdate: function () {
      setWipePoints(this.progress());
    }
  });

  // Clean up
  tl.call(() => {
    sceneBrown.classList.add('is-active');
    sceneGreen.classList.remove('is-active');
    sceneGreen.style.zIndex  = '';
    sceneBrown.style.zIndex  = '';
    gsap.set(sceneGreen, { opacity: 0 });
    gsap.set(wipeOverlay, { opacity: 0 });
    setUIMode('dark');
  });

  // Animate brown scene elements in
  tl.from('#vinyl-center-black', {
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.4)',
  });
  tl.from(ghostBrown, {
    opacity: 0,
    scale: 0.95,
    duration: 0.45,
    ease: 'power2.out',
  }, '-=0.4');
  tl.from('#vinyl-left-brown', {
    x: -40,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
  }, '-=0.4');
  tl.from('#vinyl-right-brown', {
    x: 40,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
  }, '-=0.4');

  return tl;
}

/* ── BROWN FOCUS → GREEN FOCUS (reverse wipe) ── */
function transitionBrownToGreen(onComplete) {
  const tl = gsap.timeline({ onComplete });

  tl.set(wipeOverlay, { opacity: 1 });

  // Use a reversed wipe: wipe goes from left to right, fill is green-bg
  tl.call(() => {
    // Change wipe color to green
    wipePolygon.style.fill = '#189638';
  });
  tl.call(() => { setWipePoints(0); });

  tl.call(() => {
    sceneBrown.style.zIndex = '2';
    sceneGreen.style.zIndex = '3';
    gsap.set(sceneGreen, { opacity: 1 });
  });

  // Wipe animation (same direction, color change creates reverse illusion)
  tl.to({}, {
    duration: 0.95,
    ease: 'power3.inOut',
    onUpdate: function () {
      setWipePoints(this.progress());
    }
  });

  tl.call(() => {
    sceneGreen.classList.add('is-active');
    sceneBrown.classList.remove('is-active');
    sceneBrown.style.zIndex = '';
    sceneGreen.style.zIndex = '';
    gsap.set(sceneBrown, { opacity: 0 });
    gsap.set(wipeOverlay, { opacity: 0 });
    // Reset wipe color for next forward transition
    wipePolygon.style.fill = '';
    setUIMode('dark');
  });

  // Green scene pop-in
  tl.from('#vinyl-center-green', {
    scale: 0.9,
    duration: 0.4,
    ease: 'back.out(1.2)',
  });

  return tl;
}

/* ── GREEN FOCUS → DARK HERO ── */
function transitionGreenToDark(onComplete) {
  const tl = gsap.timeline({ onComplete });

  // Fade out green scene
  tl.to(sceneGreen, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0);

  tl.call(() => {
    sceneGreen.classList.remove('is-active');
    gsap.set(sceneDarkHero, { opacity: 1 });
    sceneDarkHero.classList.add('is-active');
    setUIMode('light');
  });

  tl.fromTo(sceneDarkHero, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' });

  // Hero info re-enters
  tl.set(heroInfo, { opacity: 0, x: 30 });
  tl.to(heroInfo, { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out' }, '-=0.3');

  // Cover slides in again from the right
  tl.set(heroVinylCover, { x: '110%' });
  tl.to(heroVinylCover, {
    x: '-58%',
    duration: 0.75,
    ease: 'power3.out',
  }, '-=0.3');

  return tl;
}

/* ── BROWN FOCUS 3D FLIP (then transition to green-return or dark) ── */
function doBlackVinylFlip(onComplete) {
  const tl = gsap.timeline({ onComplete });

  // 3D Y-axis flip on black vinyl
  tl.to(vinylCenterBlackDisc, {
    rotationY: 90,
    duration: 0.5,
    ease: 'power2.in',
  });
  tl.to(vinylCenterBlackDisc, {
    rotationY: 0,
    duration: 0.5,
    ease: 'power2.out',
  });

  return tl;
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════ */

function goNext() {
  if (isTransitioning) return;
  if (currentStep >= TOTAL_STEPS - 1) return; // already at end, loop handled
  isTransitioning = true;

  const nextStep = currentStep + 1;
  const stepInfo = stepMap[nextStep];
  updateCounter(stepInfo.counter);

  function done() {
    currentStep = nextStep;
    isTransitioning = false;
  }

  // Determine which transition to fire
  if (currentStep === 0 && nextStep === 1) {
    // dark-hero → green-focus
    transitionToGreen(done);

  } else if (currentStep === 1 && nextStep === 2) {
    // green-focus → brown-focus (diagonal wipe)
    transitionGreenToBrown(done);

  } else if (currentStep === 2 && nextStep === 3) {
    // brown-focus → green-focus (reverse wipe)
    // Optionally trigger flip first
    doBlackVinylFlip(() => {
      transitionBrownToGreen(done);
    });

  } else if (currentStep === 3 && nextStep === 4) {
    // green-focus → dark-hero
    transitionGreenToDark(done);

  } else {
    // Fallback: simple crossfade
    crossfadeScenes(stepMap[currentStep].scene, stepInfo.scene, done);
  }
}

function goPrev() {
  if (isTransitioning) return;
  if (currentStep <= 0) return;
  isTransitioning = true;

  const prevStep = currentStep - 1;
  const stepInfo = stepMap[prevStep];
  updateCounter(stepInfo.counter);

  function done() {
    currentStep = prevStep;
    isTransitioning = false;
  }

  if (currentStep === 4 && prevStep === 3) {
    // dark-hero → green-focus (prev direction)
    transitionToGreen(done);

  } else if (currentStep === 3 && prevStep === 2) {
    // green-focus → brown-focus (reverse: wipe right to left)
    transitionGreenToBrown(done);

  } else if (currentStep === 2 && prevStep === 1) {
    // brown-focus → green-focus
    transitionBrownToGreen(done);

  } else if (currentStep === 1 && prevStep === 0) {
    // green-focus → dark-hero
    transitionGreenToDark(done);

  } else {
    crossfadeScenes(stepMap[currentStep].scene, stepInfo.scene, done);
  }
}

function crossfadeScenes(fromScene, toScene, onComplete) {
  const tl = gsap.timeline({ onComplete });
  tl.to(fromScene, { opacity: 0, duration: 0.4, ease: 'power2.in' });
  tl.call(() => {
    fromScene.classList.remove('is-active');
    toScene.classList.add('is-active');
    gsap.set(toScene, { opacity: 1 });
  });
  tl.fromTo(toScene, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
}

/* ── EVENT LISTENERS ── */
btnNext.addEventListener('click', goNext);
btnPrev.addEventListener('click', goPrev);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
});

/* Touch swipe */
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) goNext();
    else goPrev();
  }
});

/* ── INIT ── */
initScene();

/* ── AMBIENT SPIN ── */
// The center vinyl spin is handled by CSS animation.
// Additionally, we give the hero vinyl a subtle idle wobble.
gsap.to(heroVinylDisc, {
  scale: 1.025,
  duration: 4,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});
