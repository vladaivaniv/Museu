import { forwardRef } from 'react';
import VinylDisc from '../VinylDisc/VinylDisc.jsx';
import BackButton from '../BackButton/BackButton.jsx';
import DetailInfo from './DetailInfo.jsx';
import './Detail.css';

const Detail = forwardRef(function Detail(
  { vinyl, visuals, isActive, onBack, btnBackRef, infoRef, sceneRef, videoRef },
  ref
) {
  const { wrapRef, coverRef } = ref;

  return (
    <section
      className={`scene scene--detail${isActive ? ' is-active' : ''}`}
      aria-label="Vinyl Detail"
      ref={sceneRef}
    >
      <BackButton onClick={onBack} ref={btnBackRef} />

      <div className="detail-vinyl-wrap" ref={wrapRef}>
        <div className="detail-cover" ref={coverRef}>
          {vinyl.video && (
            <video
              ref={videoRef}
              className="detail-cover-video"
              src={vinyl.video}
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
        </div>
        <div className="detail-disc">
          <VinylDisc visuals={visuals} variant="detail" photo={vinyl.photo} />
        </div>
      </div>

      <DetailInfo
        title={`${vinyl.title} — ${vinyl.artist}`}
        desc={vinyl.desc}
        ref={infoRef}
      />
    </section>
  );
});

export default Detail;
