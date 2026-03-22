import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';

import { vinyls } from './data/vinyls.js';
import { vinylVisuals } from './data/vinylVisuals.js';

import Landing from './components/Landing/Landing.jsx';
import Selector from './components/Selector/Selector.jsx';
import Detail from './components/Detail/Detail.jsx';
import GrainOverlay from './components/GrainOverlay/GrainOverlay.jsx';
import ArrowNav from './components/ArrowNav/ArrowNav.jsx';

import useSelectorCarousel from './hooks/useSelectorCarousel.js';
import useGalleryTransitions from './hooks/useGalleryTransitions.js';
import useKeyboard from './hooks/useKeyboard.js';
import useSwipe from './hooks/useSwipe.js';
import useMouseDrag from './hooks/useMouseDrag.js';

import './styles/base.css';
import './styles/responsive.css';

const isScreenshotMode = new URLSearchParams(window.location.search).has('screenshot');

export default function App() {
  const [view, setView] = useState('selector');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Imperative refs for GSAP (not driven by render)
  const viewRef = useRef('selector');
  const selectedIndexRef = useRef(0);
  const transitioningRef = useRef(false);

  // DOM refs
  const stageRef = useRef(null);
  const selectorSceneRef = useRef(null);
  const detailSceneRef = useRef(null);
  const rackRef = useRef(null);
  const itemRefs = useRef([]);
  const coverRef = useRef(null);
  const wrapRef = useRef(null);
  const infoRef = useRef(null);
  const btnBackRef = useRef(null);
  const arrowsRef = useRef(null);
  const videoRef = useRef(null);

  // Populate detail imperatively (sets bg + triggers re-render for content)
  const populateDetail = useCallback((index) => {
    const v = vinyls[index];
    if (!v || !stageRef.current) return;
    stageRef.current.style.background = v.bg;
  }, []);

  const { centerItem } = useSelectorCarousel(
    rackRef, itemRefs, selectedIndex, setSelectedIndex, view
  );

  const { openDetail, goBackToSelector, navigateDetail } = useGalleryTransitions({
    viewRef, selectedIndexRef, transitioningRef,
    setView, setSelectedIndex,
    stageRef, selectorSceneRef, detailSceneRef,
    itemRefs, coverRef, wrapRef, infoRef, btnBackRef, arrowsRef, videoRef,
    vinyls, populateDetail,
  });

  // Input hooks
  useKeyboard(viewRef, goBackToSelector, navigateDetail);
  useSwipe(viewRef, navigateDetail);
  useMouseDrag(viewRef, navigateDetail);

  // Update background color when selected vinyl changes
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.style.background = vinyls[selectedIndex].bg;
    }
  }, [selectedIndex]);

  // Selector keyboard nav
  // Center after state change — wait for layout to update, then re-center after CSS transition
  const deferredCenter = useCallback((index) => {
    requestAnimationFrame(() => centerItem(index));
    setTimeout(() => centerItem(index), 420);
  }, [centerItem]);

  const handleItemKeyDown = useCallback((index, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (index === selectedIndexRef.current) {
        openDetail(index);
      } else {
        selectedIndexRef.current = index;
        setSelectedIndex(index);
        deferredCenter(index);
      }
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(index + 1, vinyls.length - 1);
      selectedIndexRef.current = next;
      setSelectedIndex(next);
      deferredCenter(next);
      itemRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      selectedIndexRef.current = prev;
      setSelectedIndex(prev);
      deferredCenter(prev);
      itemRefs.current[prev]?.focus();
    }
  }, [openDetail, deferredCenter, setSelectedIndex, selectedIndexRef, itemRefs]);

  // Initial setup
  useLayoutEffect(() => {
    if (isScreenshotMode) {
      document.body.classList.add('is-screenshot-mode');
      document.documentElement.classList.add('is-screenshot-mode');
      gsap.globalTimeline.timeScale(0.01);
    }

    gsap.set(detailSceneRef.current, { opacity: 0 });
    gsap.set(coverRef.current, { x: '-58%' });
    gsap.set(wrapRef.current, { x: 0, y: 0 });
    gsap.set(infoRef.current, { x: 0, y: 0 });
    gsap.set([arrowsRef.current, btnBackRef.current], { opacity: 0, pointerEvents: 'none' });

    requestAnimationFrame(() => centerItem(0, 'auto'));
    setTimeout(() => centerItem(0, 'auto'), 120);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resize handler for detail view
  useLayoutEffect(() => {
    const handleResize = () => {
      if (viewRef.current === 'detail') {
        gsap.set(coverRef.current, { x: '-58%' });
        gsap.set(wrapRef.current, { x: 0, y: 0 });
        gsap.set(infoRef.current, { x: 0, y: 0 });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center-first-then-open: click a non-centered vinyl → center it; click the centered vinyl → open detail
  const handleSelect = useCallback((index) => {
    if (index === selectedIndex) {
      openDetail(index);
    } else {
      setSelectedIndex(index);
      selectedIndexRef.current = index;
      deferredCenter(index);
    }
  }, [selectedIndex, openDetail, deferredCenter, setSelectedIndex, selectedIndexRef]);

  const currentVinyl = vinyls[selectedIndex];
  const currentVisuals = vinylVisuals[selectedIndex];

  return (
    <>
      <Landing />
      <div className="viewport-wrap">
        <div className="stage" ref={stageRef}>
        <Selector
          ref={rackRef}
          sceneRef={selectorSceneRef}
          vinyls={vinyls}
          vinylVisuals={vinylVisuals}
          selectedIndex={selectedIndex}
          isActive={view === 'selector'}
          onSelect={handleSelect}
          itemRefs={itemRefs}
          onItemKeyDown={handleItemKeyDown}
        />

        <Detail
          ref={{ wrapRef, coverRef }}
          sceneRef={detailSceneRef}
          vinyl={currentVinyl}
          visuals={currentVisuals}
          isActive={view === 'detail'}
          onBack={goBackToSelector}
          btnBackRef={btnBackRef}
          infoRef={infoRef}
          videoRef={videoRef}
        />

        <GrainOverlay />

        <ArrowNav
          ref={arrowsRef}
          onPrev={() => navigateDetail(-1)}
          onNext={() => navigateDetail(1)}
        />
      </div>
    </div>
    </>
  );
}
