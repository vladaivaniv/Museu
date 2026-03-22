import { useCallback, useRef } from 'react';
import gsap from 'gsap';

const DETAIL_COVER_REST_X = '-58%';

export default function useGalleryTransitions({
  viewRef,
  selectedIndexRef,
  transitioningRef,
  setView,
  setSelectedIndex,
  stageRef,
  selectorSceneRef,
  detailSceneRef,
  itemRefs,
  coverRef,
  wrapRef,
  infoRef,
  btnBackRef,
  arrowsRef,
  videoRef,
  vinyls,
  populateDetail,
}) {
  const activeTimeline = useRef(null);

  const playVideo = () => {
    const v = videoRef?.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  };

  const pauseVideo = () => {
    const v = videoRef?.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

  const openDetail = useCallback((index) => {
    if (transitioningRef.current || !Number.isInteger(index) || index < 0 || index >= vinyls.length) return;
    transitioningRef.current = true;
    selectedIndexRef.current = index;
    setSelectedIndex(index);

    populateDetail(index);

    const items = itemRefs.current.filter(Boolean);
    gsap.set(coverRef.current, { x: '110%' });
    gsap.set([wrapRef.current, infoRef.current], { x: 0, y: 0 });
    gsap.set(infoRef.current, { opacity: 0, x: 40 });
    gsap.set(wrapRef.current, { scale: 0.88, opacity: 0 });

    pauseVideo();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = 'detail';
        setView('detail');
        transitioningRef.current = false;
        playVideo();
      },
    });
    activeTimeline.current = tl;

    tl.call(() => {
      items.forEach(el => el.removeAttribute('style'));
      selectorSceneRef.current?.classList.remove('is-active');
      gsap.set(selectorSceneRef.current, { opacity: 0 });
      detailSceneRef.current?.classList.add('is-active');
    });

    tl.to(detailSceneRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    tl.to(wrapRef.current, {
      scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.3)',
    }, '-=0.25');

    tl.to(infoRef.current, {
      opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
    }, '-=0.35');

    tl.to(coverRef.current, {
      x: DETAIL_COVER_REST_X, duration: 0.85, ease: 'power3.out',
    }, '-=0.3');

    tl.to([btnBackRef.current, arrowsRef.current], { opacity: 1, duration: 0.25 }, '-=0.4');
    tl.set([btnBackRef.current, arrowsRef.current], { pointerEvents: 'auto' });
  }, [vinyls, populateDetail, transitioningRef, selectedIndexRef, setSelectedIndex, viewRef, setView, itemRefs, coverRef, wrapRef, infoRef, btnBackRef, arrowsRef, selectorSceneRef, detailSceneRef]);

  const goBackToSelector = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    pauseVideo();

    const items = itemRefs.current.filter(Boolean);
    const idx = selectedIndexRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = 'selector';
        setView('selector');
        transitioningRef.current = false;
      },
    });
    activeTimeline.current = tl;

    tl.set([btnBackRef.current, arrowsRef.current], { pointerEvents: 'none' });
    tl.to([btnBackRef.current, arrowsRef.current], { opacity: 0, duration: 0.2 });

    tl.to(coverRef.current, { x: '110%', duration: 0.35, ease: 'power2.in' }, 0);
    tl.to(infoRef.current, { opacity: 0, x: 40, duration: 0.3, ease: 'power2.in' }, 0);
    tl.to(wrapRef.current, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.05);

    tl.to(detailSceneRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1);

    tl.call(() => {
      detailSceneRef.current?.classList.remove('is-active');
      selectorSceneRef.current?.classList.add('is-active');
      gsap.set(selectorSceneRef.current, { opacity: 1 });
      gsap.set(coverRef.current, { x: DETAIL_COVER_REST_X });
      gsap.set(wrapRef.current, { x: 0, y: 0 });
      gsap.set(infoRef.current, { x: 0, y: 0 });
      items.forEach(el => el.removeAttribute('style'));
    });
  }, [transitioningRef, viewRef, setView, selectedIndexRef, itemRefs, coverRef, wrapRef, infoRef, btnBackRef, arrowsRef, selectorSceneRef, detailSceneRef, stageRef]);

  const navigateDetail = useCallback((direction) => {
    if (transitioningRef.current) return;
    const current = selectedIndexRef.current;
    const next = (current + direction + vinyls.length) % vinyls.length;

    transitioningRef.current = true;
    pauseVideo();
    const exitX = direction * -80;
    const enterX = direction * 80;

    const tl = gsap.timeline({
      onComplete: () => {
        transitioningRef.current = false;
        playVideo();
      },
    });
    activeTimeline.current = tl;

    tl.to(coverRef.current, {
      x: direction > 0 ? '-160%' : '110%', duration: 0.3, ease: 'power2.in',
    }, 0);
    tl.to([infoRef.current, wrapRef.current], {
      opacity: 0, x: exitX, duration: 0.3, ease: 'power2.in',
    }, 0);

    tl.call(() => {
      selectedIndexRef.current = next;
      setSelectedIndex(next);
      populateDetail(next);
      gsap.set(coverRef.current, { x: '110%' });
      gsap.set([wrapRef.current, infoRef.current], { x: 0, y: 0 });
      gsap.set([infoRef.current, wrapRef.current], { x: enterX, opacity: 0 });
    });

    tl.to([infoRef.current, wrapRef.current], {
      opacity: 1, x: 0, duration: 0.45, ease: 'power3.out',
    });

    tl.to(coverRef.current, {
      x: DETAIL_COVER_REST_X, duration: 0.75, ease: 'power3.out',
    }, '-=0.35');
  }, [transitioningRef, selectedIndexRef, setSelectedIndex, vinyls, populateDetail, coverRef, wrapRef, infoRef]);

  return { openDetail, goBackToSelector, navigateDetail };
}
