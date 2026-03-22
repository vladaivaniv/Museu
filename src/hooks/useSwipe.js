import { useEffect, useRef } from 'react';

export default function useSwipe(viewRef, onNavigate) {
  const startXRef = useRef(0);

  useEffect(() => {
    const handleStart = (e) => { startXRef.current = e.touches[0].clientX; };
    const handleEnd = (e) => {
      if (viewRef.current !== 'detail') return;
      const dx = e.changedTouches[0].clientX - startXRef.current;
      if (Math.abs(dx) > 50) {
        onNavigate(dx < 0 ? 1 : -1);
      }
    };

    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [viewRef, onNavigate]);
}
