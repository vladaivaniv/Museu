/**
 * VIINYL GALLERY — main.js
 *
 * Flow:
 *   selector  →  (click vinyl)  →  detail
 *   detail    →  (back btn)     →  selector
 *   detail    →  (drag / arrow) →  next / prev vinyl detail
 */

// gsap loaded from ./vendor/gsap.min.js
/* global gsap */

/* ── VINYL DATA ── */
const vinyls = [
  {
    id: 0,
    title: "DON'T CARE",
    artist: 'KLARK KENT',
    desc: `Klark Kent is the debut solo album of Stewart Copeland, drummer of The Police. Released in 1980 as a 10-inch EP on green vinyl. Includes "Don't Care", which entered the UK Top 50 in 1978. A pioneering artifact of the post-punk solo project.`,
    bg: '#0c1812',
  },
  {
    id: 1,
    title: "WHAT'S YOUR NUMBER",
    artist: 'SNIPS',
    desc: `A rare UK post-punk single released on EMI in 1980. Snips, frontman of Baker Gurvitz Army, delivered this driving new wave cut on black vinyl with a striking warm-label pressing. Sought after by collectors of early 80s British punk ephemera.`,
    bg: '#180e06',
  },
  {
    id: 2,
    title: 'LONDON CALLING',
    artist: 'THE CLASH',
    desc: `Released December 1979 on CBS Records, London Calling is one of the defining albums of the punk era. The double LP, priced as a single, features 19 tracks spanning punk, reggae, rockabilly and pop. Pressed on crimson red vinyl for limited editions.`,
    bg: '#1a0608',
  },
  {
    id: 3,
    title: 'LOVE WILL TEAR US APART',
    artist: 'JOY DIVISION',
    desc: `Released posthumously in June 1980 on Factory Records, weeks after Ian Curtis's death. Joy Division's most celebrated single, its stark synthesizer melody and Curtis's baritone have become emblematic of post-punk. Pressed on midnight blue vinyl.`,
    bg: '#050818',
  },
  {
    id: 4,
    title: 'ONCE IN A LIFETIME',
    artist: 'TALKING HEADS',
    desc: `From the 1980 album Remain in Light, produced by Brian Eno. A landmark of new wave, blending West African polyrhythms with funk and David Byrne's stream-of-consciousness lyrics. The ivory vinyl pressing is among the most sought-after of the era.`,
    bg: '#181208',
  },
  {
    id: 5,
    title: 'HONG KONG GARDEN',
    artist: 'SIOUXSIE & THE BANSHEES',
    desc: `The debut single from Siouxsie and the Banshees, released 1978 on Polydor. A hypnotic, sitar-infused post-punk anthem that reached number 7 in the UK charts. This purple pressing is a prized rarity among gothic rock collectors.`,
    bg: '#0e0718',
  },
  {
    id: 6,
    title: 'EVER FALLEN IN LOVE',
    artist: 'BUZZCOCKS',
    desc: `Released September 1978 on United Artists. Written by Pete Shelley, widely regarded as the Buzzcocks' finest moment—a perfect pop-punk single about unrequited love and frustration. The burnt orange vinyl is a limited collectors' edition.`,
    bg: '#180a02',
  },
  {
    id: 7,
    title: 'GOING UNDERGROUND',
    artist: 'THE JAM',
    desc: `Released March 1980 on Polydor Records. The first single ever to enter the UK charts at number one. A furious attack on consumerism and apathy, driven by Paul Weller's razor-sharp guitar. Yellow vinyl limited press from the original run.`,
    bg: '#161400',
  },
  {
    id: 8,
    title: 'OUTDOOR MINER',
    artist: 'WIRE',
    desc: `Released January 1979 on Harvest Records. Written by Colin Newman and Graham Lewis, inspired by the serpentine leafminer insect. A two-minute gem of minimalist post-punk — the band's most accessible single, pressed on teal vinyl.`,
    bg: '#031410',
  },
  {
    id: 9,
    title: 'SHOT BY BOTH SIDES',
    artist: 'MAGAZINE',
    desc: `The debut single from Magazine, released February 1978 on Virgin Records. Howard Devoto's first post-Buzzcocks project announced itself with this jagged, literary post-punk masterpiece. Reached UK #41. The magenta pressing is a collector's gem.`,
    bg: '#14040e',
  },
];

/* ── DOM ── */
const stage          = document.getElementById('stage');
const sceneSelector  = document.getElementById('scene-selector');
const sceneDetail    = document.getElementById('scene-detail');
const selectorRack   = document.getElementById('selector-rack');
const selectorItems  = Array.from(document.querySelectorAll('.selector-item'));
const detailCover    = document.getElementById('detail-cover');
const detailVinylWrap = document.getElementById('detail-vinyl-wrap');
const detailInfo     = document.getElementById('detail-info');
const detailTitle    = document.getElementById('detail-title');
const detailDesc     = document.getElementById('detail-desc');
const detailDiscs    = Array.from(document.querySelectorAll('.detail-disc'));
const btnBack        = document.getElementById('btn-back');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');
const uiArrows       = document.getElementById('ui-arrows');

/* ── STATE ── */
let currentView     = 'selector';
let selectedIndex   = 0;
let isTransitioning = false;

/* ── HELPERS ── */
function showDisc(index) {
  detailDiscs.forEach((d, i) => {
    gsap.set(d, { display: i === index ? 'block' : 'none' });
  });
}

function populateDetail(index) {
  const v = vinyls[index];
  if (!v) { console.error('[VIINYL] No vinyl at index', index); return; }
  detailTitle.innerHTML = `${v.title}<br/>${v.artist}`;
  detailDesc.textContent = v.desc;
  stage.style.background = v.bg;
  showDisc(index);
}

function getClosestSelectorIndex() {
  const rackRect = selectorRack.getBoundingClientRect();
  const rackCenter = rackRect.left + rackRect.width / 2;
  let closestIndex = 0;
  let closestDist = Number.POSITIVE_INFINITY;

  selectorItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const dist = Math.abs(itemCenter - rackCenter);
    if (dist < closestDist) {
      closestDist = dist;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function updateSelectorVisibility(index) {
  selectorItems.forEach((item, i) => {
    item.classList.remove('is-center', 'is-side', 'is-hidden');
    const distance = Math.abs(i - index);
    if (distance === 0) item.classList.add('is-center');
    else if (distance === 1) item.classList.add('is-side');
    else item.classList.add('is-hidden');
  });
}

function centerSelectorItem(index, behavior = 'smooth') {
  const item = selectorItems[index];
  if (!item) return;
  const itemCenter = item.offsetLeft + item.offsetWidth / 2;
  const targetLeft = itemCenter - selectorRack.clientWidth / 2;
  const maxLeft = selectorRack.scrollWidth - selectorRack.clientWidth;
  const safeLeft = Math.max(0, Math.min(targetLeft, maxLeft));
  selectorRack.scrollTo({ left: safeLeft, behavior });
}

/* ── INIT ── */
function init() {
  selectedIndex = 0;
  sceneSelector.classList.add('is-active');
  gsap.set(sceneDetail, { opacity: 0 });
  gsap.set([uiArrows, btnBack], { opacity: 0, pointerEvents: 'none' });
  updateSelectorVisibility(selectedIndex);
  requestAnimationFrame(() => centerSelectorItem(selectedIndex, 'auto'));
  setTimeout(() => centerSelectorItem(selectedIndex, 'auto'), 120);

  // Stagger vinyls in
  gsap.from('.selector-item', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.18,
    ease: 'power3.out',
    delay: 0.2,
  });
}

/* ── SELECTOR → DETAIL ── */
function openDetail(index) {
  if (isTransitioning || index < 0 || index >= vinyls.length) return;
  isTransitioning = true;
  selectedIndex = index;

  populateDetail(index);
  gsap.set(detailCover, { x: '110%' });
  gsap.set(detailInfo,  { opacity: 0, x: 40 });
  gsap.set(detailVinylWrap, { scale: 0.88, opacity: 0 });

  const tl = gsap.timeline({
    onComplete: () => {
      currentView = 'detail';
      isTransitioning = false;
    },
  });

  // Selector items fly out
  tl.to('.selector-item', {
    y: -40,
    opacity: 0,
    duration: 0.32,
    stagger: 0.06,
    ease: 'power2.in',
  });

  tl.call(() => {
    sceneSelector.classList.remove('is-active');
    gsap.set(sceneSelector, { opacity: 0 });
    sceneDetail.classList.add('is-active');
  });

  // Detail fades in
  tl.to(sceneDetail, { opacity: 1, duration: 0.4, ease: 'power2.out' });

  // Disc pops in
  tl.to(detailVinylWrap, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'back.out(1.3)',
  }, '-=0.25');

  // Info slides in
  tl.to(detailInfo, {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'power3.out',
  }, '-=0.35');

  // Cover slides over disc
  tl.to(detailCover, {
    x: '-58%',
    duration: 0.85,
    ease: 'power3.out',
  }, '-=0.3');

  // Show back + arrows
  tl.to([btnBack, uiArrows], { opacity: 1, duration: 0.25 }, '-=0.4');
  tl.set([btnBack, uiArrows], { pointerEvents: 'auto' });
}

/* ── DETAIL → SELECTOR ── */
function goBackToSelector() {
  if (isTransitioning) return;
  isTransitioning = true;

  const tl = gsap.timeline({
    onComplete: () => {
      currentView = 'selector';
      isTransitioning = false;
    },
  });

  tl.set([btnBack, uiArrows], { pointerEvents: 'none' });
  tl.to([btnBack, uiArrows], { opacity: 0, duration: 0.2 });

  // Cover and info exit
  tl.to(detailCover, { x: '110%', duration: 0.35, ease: 'power2.in' }, 0);
  tl.to(detailInfo,  { opacity: 0, x: 40, duration: 0.3, ease: 'power2.in' }, 0);
  tl.to(detailVinylWrap, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.05);

  // Detail fades out
  tl.to(sceneDetail, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1);

  tl.call(() => {
    sceneDetail.classList.remove('is-active');
    sceneSelector.classList.add('is-active');
    gsap.set(sceneSelector, { opacity: 1 });
    stage.style.background = '';
    updateSelectorVisibility(selectedIndex);
    centerSelectorItem(selectedIndex, 'auto');
    // Reset selector items for animation
    gsap.set('.selector-item', { y: 40, opacity: 0 });
  });

  tl.to('.selector-item', {
    y: 0,
    opacity: 1,
    duration: 0.55,
    stagger: 0.1,
    ease: 'power3.out',
  });
}

/* ── DETAIL: NAVIGATE TO NEXT / PREV VINYL ── */
function navigateDetail(direction /* +1 | -1 */) {
  if (isTransitioning) return;
  const next = selectedIndex + direction;
  if (next < 0 || next >= vinyls.length) return;

  isTransitioning = true;
  const exitX = direction * -80;
  const enterX = direction * 80;

  const tl = gsap.timeline({
    onComplete: () => {
      selectedIndex = next;
      isTransitioning = false;
    },
  });

  // Exit
  tl.to(detailCover, { x: direction > 0 ? '-160%' : '110%', duration: 0.3, ease: 'power2.in' }, 0);
  tl.to([detailInfo, detailVinylWrap], {
    opacity: 0,
    x: exitX,
    duration: 0.3,
    ease: 'power2.in',
  }, 0);

  // Swap content
  tl.call(() => {
    populateDetail(next);
    gsap.set(detailCover, { x: '110%' });
    gsap.set([detailInfo, detailVinylWrap], { x: enterX, opacity: 0 });
  });

  // Enter
  tl.to([detailInfo, detailVinylWrap], {
    opacity: 1,
    x: 0,
    duration: 0.45,
    ease: 'power3.out',
  });

  tl.to(detailCover, {
    x: '-58%',
    duration: 0.75,
    ease: 'power3.out',
  }, '-=0.35');
}

/* ── EVENT LISTENERS ── */

// Selector: click to open
selectorItems.forEach(item => {
  item.addEventListener('click', () => {
    openDetail(parseInt(item.dataset.index, 10));
  });
});

let selectorTicking = false;
let selectorSnapTimeout;
selectorRack.addEventListener('scroll', () => {
  if (selectorTicking) return;
  selectorTicking = true;
  requestAnimationFrame(() => {
    const closestIndex = getClosestSelectorIndex();
    selectedIndex = closestIndex;
    updateSelectorVisibility(closestIndex);
    clearTimeout(selectorSnapTimeout);
    selectorSnapTimeout = setTimeout(() => {
      centerSelectorItem(selectedIndex);
    }, 90);
    selectorTicking = false;
  });
}, { passive: true });

window.addEventListener('resize', () => {
  centerSelectorItem(selectedIndex, 'auto');
});

// Detail: back
btnBack.addEventListener('click', goBackToSelector);

// Detail: arrows
btnNext.addEventListener('click', () => navigateDetail(1));
btnPrev.addEventListener('click', () => navigateDetail(-1));

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'     && currentView === 'detail')   goBackToSelector();
  if (e.key === 'ArrowRight' && currentView === 'detail')   navigateDetail(1);
  if (e.key === 'ArrowLeft'  && currentView === 'detail')   navigateDetail(-1);
});

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (currentView !== 'detail') return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) navigateDetail(1);
    else         navigateDetail(-1);
  }
});

// Mouse drag
let dragStartX   = 0;
let isDragging   = false;
document.addEventListener('mousedown', e => {
  if (currentView !== 'detail') return;
  dragStartX = e.clientX;
  isDragging = true;
});
document.addEventListener('mouseup', e => {
  if (!isDragging || currentView !== 'detail') { isDragging = false; return; }
  isDragging = false;
  const dx = e.clientX - dragStartX;
  if (Math.abs(dx) > 60) {
    if (dx < 0) navigateDetail(1);
    else         navigateDetail(-1);
  }
});

/* ── START ── */
init();
