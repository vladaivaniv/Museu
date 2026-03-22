import { forwardRef } from 'react';
import './BackButton.css';

const BackButton = forwardRef(function BackButton({ onClick }, ref) {
  return (
    <button className="btn-back" type="button" onClick={onClick} ref={ref}>
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      ALL RECORDS
    </button>
  );
});

export default BackButton;
