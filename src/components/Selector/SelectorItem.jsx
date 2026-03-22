import { forwardRef, memo } from 'react';
import VinylDisc from '../VinylDisc/VinylDisc.jsx';

const SelectorItem = forwardRef(function SelectorItem({ vinyl, visuals, visibility, onClick, onKeyDown }, ref) {
  return (
    <button
      className={`selector-item ${visibility}`}
      data-index={vinyl.id}
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-current={visibility === 'is-center' ? 'true' : 'false'}
      ref={ref}
    >
      <div className="selector-disc">
        <VinylDisc visuals={visuals} variant="selector" photo={vinyl.photo} />
      </div>
      <div className="selector-meta">
        <span className="selector-artist">{vinyl.artist}</span>
      </div>
    </button>
  );
});

export default memo(SelectorItem);
