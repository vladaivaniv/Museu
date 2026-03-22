import { forwardRef } from 'react';
import './ArrowNav.css';

const ArrowNav = forwardRef(function ArrowNav({ onPrev, onNext }, ref) {
  return (
    <div className="ui-arrows" ref={ref}>
      <button className="arrow-btn" type="button" aria-label="Previous" onClick={onPrev}>
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="arrow-btn" type="button" aria-label="Next" onClick={onNext}>
        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
      </button>
    </div>
  );
});

export default ArrowNav;
