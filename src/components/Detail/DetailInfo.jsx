import { forwardRef } from 'react';

const DetailInfo = forwardRef(function DetailInfo({ title, desc }, ref) {
  return (
    <div className="detail-info" ref={ref}>
      <h1 className="detail-title">{title}</h1>
      <p className="detail-desc">{desc}</p>
      <button className="hero-visit-btn" type="button">
        VISIT <span aria-hidden="true">&#8594;</span>
      </button>
    </div>
  );
});

export default DetailInfo;
