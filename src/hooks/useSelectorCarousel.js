import { useEffect, useCallback, useRef } from 'react';

export default function useSelectorCarousel(rackRef, itemRefs, selectedIndex, setSelectedIndex, view) {
  const snapTimeoutRef = useRef(null);
  const programmaticScrollRef = useRef(false);

  const getClosestIndex = useCallback(() => {
    const rack = rackRef.current;
    if (!rack) return 0;
    const rackRect = rack.getBoundingClientRect();
    const rackCenter = rackRect.left + rackRect.width / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(itemCenter - rackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = index;
      }
    });
    return closestIndex;
  }, [rackRef, itemRefs]);

  const centerItem = useCallback((index, behavior = 'smooth') => {
    const rack = rackRef.current;
    const item = itemRefs.current[index];
    if (!rack || !item) return;
    programmaticScrollRef.current = true;
    clearTimeout(snapTimeoutRef.current);
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const targetLeft = itemCenter - rack.clientWidth / 2;
    const maxLeft = rack.scrollWidth - rack.clientWidth;
    const safeLeft = Math.max(0, Math.min(targetLeft, maxLeft));
    rack.scrollTo({ left: safeLeft, behavior });
    snapTimeoutRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 400);
  }, [rackRef, itemRefs]);

  // Scroll sync
  useEffect(() => {
    const rack = rackRef.current;
    if (!rack) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking || programmaticScrollRef.current) return;
      ticking = true;
      requestAnimationFrame(() => {
        const closest = getClosestIndex();
        setSelectedIndex(closest);
        ticking = false;
      });
    };

    rack.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      rack.removeEventListener('scroll', handleScroll);
      clearTimeout(snapTimeoutRef.current);
    };
  }, [rackRef, getClosestIndex, setSelectedIndex, centerItem]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      centerItem(selectedIndex, 'auto');
      const closest = getClosestIndex();
      setSelectedIndex(closest);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedIndex, centerItem, getClosestIndex, setSelectedIndex]);

  return { centerItem, getClosestIndex };
}
