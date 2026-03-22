import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-hero-title">
          Vinyl<br />Collection
        </h1>
        <p className="landing-hero-sub">
          A curated gallery of iconic post-punk and new wave vinyl pressings
          from the late 1970s and early 1980s.
        </p>
        <div className="landing-scroll-hint">
          <span>Scroll to explore</span>
          <span className="landing-scroll-arrow" />
        </div>
      </div>
    </div>
  );
}
