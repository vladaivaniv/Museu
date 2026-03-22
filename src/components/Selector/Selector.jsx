import { forwardRef, useCallback } from 'react';
import SelectorItem from './SelectorItem.jsx';
import './Selector.css';

function getVisibility(itemIndex, centerIndex) {
  const dist = Math.abs(itemIndex - centerIndex);
  if (dist === 0) return 'is-center';
  if (dist === 1) return 'is-side';
  return 'is-hidden';
}

const Selector = forwardRef(function Selector(
  { vinyls, vinylVisuals, selectedIndex, isActive, onSelect, itemRefs, onItemKeyDown, sceneRef },
  rackRef
) {
  const handleClick = useCallback((index) => () => onSelect(index), [onSelect]);
  const handleKeyDown = useCallback((index) => (e) => onItemKeyDown(index, e), [onItemKeyDown]);

  return (
    <section
      className={`scene scene--selector${isActive ? ' is-active' : ''}`}
      aria-label="Vinyl Selector"
      ref={sceneRef}
    >
      <div className="selector-rack-wrap">
        <div className="selector-rack" ref={rackRef}>
          {vinyls.map((vinyl, i) => (
            <SelectorItem
              key={vinyl.id}
              vinyl={vinyl}
              visuals={vinylVisuals[i]}
              visibility={getVisibility(i, selectedIndex)}
              onClick={handleClick(i)}
              onKeyDown={handleKeyDown(i)}
              ref={(el) => { itemRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default Selector;
