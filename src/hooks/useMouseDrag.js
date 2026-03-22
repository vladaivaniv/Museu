import { useEffect, useRef } from 'react';

export default function useMouseDrag(viewRef, onNavigate) {
  const startXRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    const handleDown = (e) => {
      if (viewRef.current !== 'detail') return;
      if (e.target instanceof HTMLElement && e.target.closest('button')) return;
      startXRef.current = e.clientX;
      draggingRef.current = true;
    };
    const handleUp = (e) => {
      if (!draggingRef.current || viewRef.current !== 'detail') {
        draggingRef.current = false;
        return;
      }
      draggingRef.current = false;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 60) {
        onNavigate(dx < 0 ? 1 : -1);
      }
    };

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [viewRef, onNavigate]);
}
