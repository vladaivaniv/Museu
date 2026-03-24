import { useRef, useCallback, useEffect, useState } from 'react';
import { vinyls } from '../../data/vinyls.js';
import './Landing.css';

// Seeded random so positions are stable across renders
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const rng = seededRandom(42);
const INIT_OFFSETS = vinyls.map(() => ({
  rot: (rng() - 0.5) * 30,
}));

const IMG_SIZE_VW = 36;

export default function Landing() {
  const heroRef = useRef(null);
  const imgRefs = useRef([]);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  // Initialize with random spread — computed once on mount
  const bodies = useRef(null);
  if (bodies.current === null) {
    const rng2 = seededRandom(123);
    bodies.current = vinyls.map(() => ({
      x: (rng2() - 0.5) * window.innerWidth * 0.7,
      y: (rng2() - 0.5) * window.innerHeight * 0.7,
      vx: 0,
      vy: 0,
      opacity: 0,
    }));
  }
  const enteredAtRef = useRef(0);
  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const mousePos = useRef({ x: -9999, y: -9999 });
  const velocityRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0, t: 0 });
  const [entered, setEntered] = useState(false);
  const rafRef = useRef(null);
  const dragRef = useRef({ active: false, index: -1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const t = setTimeout(() => {
      setEntered(true);
      enteredAtRef.current = performance.now();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Find which image is under a point (checks from top z-order)
  const hitTest = useCallback((mx, my) => {
    const hero = heroRef.current;
    if (!hero) return -1;
    const rect = hero.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const imgPx = Math.min(rect.width, rect.height) * IMG_SIZE_VW / 100;
    const half = imgPx / 2;

    // Check in reverse order (last rendered = on top)
    for (let i = bodies.current.length - 1; i >= 0; i--) {
      const b = bodies.current[i];
      const ax = centerX + b.x;
      const ay = centerY + b.y;
      if (mx >= ax - half && mx <= ax + half && my >= ay - half && my <= ay + half) {
        return i;
      }
    }
    return -1;
  }, []);

  // Physics loop
  const tick = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const now = performance.now();
      const enteredAt = enteredAtRef.current;

      bodies.current.forEach((body, i) => {
        // JS-driven entrance fade-in (staggered 70ms per image)
        if (enteredAt > 0 && body.opacity < 0.95) {
          const elapsed = now - enteredAt - i * 70;
          if (elapsed > 0) {
            body.opacity = Math.min(0.95, elapsed / 600); // 600ms fade
          }
        }

        // Skip physics for dragged image
        if (dragRef.current.active && dragRef.current.index === i) {
          body.x = mx - centerX + dragRef.current.offsetX;
          body.y = my - centerY + dragRef.current.offsetY;
          body.vx = 0;
          body.vy = 0;
        } else {
          // Apply velocity
          body.x += body.vx;
          body.y += body.vy;

          // Friction
          body.vx *= 0.88;
          body.vy *= 0.88;
        }

        // Update DOM — JS controls everything
        const img = imgRefs.current[i];
        if (img) {
          const rot = INIT_OFFSETS[i].rot + body.x * 0.012;
          const isDragged = dragRef.current.active && dragRef.current.index === i;
          const scale = isDragged ? 1.08 : 1;
          img.style.transform = `translate(calc(-50% + ${body.x}px), calc(-50% + ${body.y}px)) rotate(${rot}deg) scale(${scale})`;
          img.style.opacity = body.opacity;
          img.style.zIndex = isDragged ? 20 : 5;
          img.style.boxShadow = isDragged
            ? '0 20px 60px rgba(0,0,0,0.8)'
            : '0 6px 40px rgba(0,0,0,0.65)';
        }
      });
    }

    // Cursor ring
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (ring && dot) {
      ringPos.current.x += (dotPos.current.x - ringPos.current.x) * 0.09;
      ringPos.current.y += (dotPos.current.y - ringPos.current.y) * 0.09;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      dot.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`;
      const s = 1 + velocityRef.current * 0.012;
      ring.style.width = `${40 * s}px`;
      ring.style.height = `${40 * s}px`;
    }
    velocityRef.current *= 0.92;

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleMouseMove = useCallback((e) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mousePos.current = { x: mx, y: my };
    dotPos.current = { x: mx, y: my };

    // Velocity
    const now = Date.now();
    const ddx = mx - lastMouseRef.current.x;
    const ddy = my - lastMouseRef.current.y;
    const dt = Math.max(now - lastMouseRef.current.t, 1);
    velocityRef.current = Math.min(Math.sqrt(ddx * ddx + ddy * ddy) / dt * 16, 60);
    lastMouseRef.current = { x: mx, y: my, t: now };

    // 3D tilt on title
    const nx = mx / rect.width - 0.5;
    const ny = my / rect.height - 0.5;
    hero.style.setProperty('--rx', `${-ny * 3}deg`);
    hero.style.setProperty('--ry', `${nx * 3}deg`);

    // Update cursor style
    if (!dragRef.current.active) {
      const hit = hitTest(mx, my);
      hero.style.cursor = hit >= 0 ? 'none' : 'none';
      const ringEl = ringRef.current;
      if (ringEl) {
        ringEl.style.borderColor = hit >= 0
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(255,255,255,0.5)';
      }
    }
  }, [hitTest]);

  const handleMouseDown = useCallback((e) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const hit = hitTest(mx, my);
    if (hit >= 0) {
      const body = bodies.current[hit];
      dragRef.current = {
        active: true,
        index: hit,
        offsetX: (centerX + body.x) - mx,
        offsetY: (centerY + body.y) - my,
      };
    }
  }, [hitTest]);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current.active) {
      // Give a throw velocity based on last mouse movement
      const body = bodies.current[dragRef.current.index];
      const now = Date.now();
      const dt = Math.max(now - lastMouseRef.current.t, 1);
      body.vx = (mousePos.current.x - lastMouseRef.current.x) / dt * 8;
      body.vy = (mousePos.current.y - lastMouseRef.current.y) / dt * 8;
    }
    dragRef.current = { active: false, index: -1, offsetX: 0, offsetY: 0 };
  }, []);

  useEffect(() => {
    imgRefs.current = imgRefs.current.slice(0, vinyls.length);
    // Mouseup anywhere (even outside hero)
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  return (
    <div className="landing">
      <div
        className={`landing-hero ${entered ? 'is-entered' : ''}`}
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        <div className="cursor-dot" ref={dotRef} />
        <div className="cursor-ring" ref={ringRef} />

        {vinyls.map((v, i) => (
          v.photo ? (
            <img
              key={v.id}
              ref={(el) => (imgRefs.current[i] = el)}
              className="landing-floating-img"
              src={v.photo}
              alt={v.title}
              draggable={false}
              style={{}} /* JS handles all visual state */
            />
          ) : null
        ))}

        <div className="landing-content">
          <h1 className="landing-hero-title">
            Col·lecció de<br />Projectes Artístics
          </h1>
        </div>

        <div className="landing-scroll-hint">
          <div className="scroll-track">
            <div className="scroll-thumb" />
          </div>
        </div>
      </div>
    </div>
  );
}
