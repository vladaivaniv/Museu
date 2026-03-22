import { useEffect } from 'react';

export default function useKeyboard(viewRef, onBack, onNavigate) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewRef.current !== 'detail') return;
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewRef, onBack, onNavigate]);
}
