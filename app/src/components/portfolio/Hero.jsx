import { useEffect, useRef } from 'react';

const genShadow = (n) =>
  Array.from(
    { length: n },
    () =>
      `${Math.floor(Math.random() * 2000)}px ${Math.floor(
        Math.random() * 2000
      )}px rgba(255,255,255,${(Math.random() * 0.5 + 0.3).toFixed(2)})`
  ).join(',');

export default function Hero({ onPhoto, onVideo }) {
  const smRef = useRef(null);
  const mdRef = useRef(null);
  const lgRef = useRef(null);

  useEffect(() => {
    if (smRef.current) smRef.current.style.boxShadow = genShadow(700);
    if (mdRef.current) mdRef.current.style.boxShadow = genShadow(200);
    if (lgRef.current) lgRef.current.style.boxShadow = genShadow(100);
  }, []);

  return (
    <section id="top" className="hero">
      <div ref={smRef} className="cosmic-star cosmic-star-sm" />
      <div ref={mdRef} className="cosmic-star cosmic-star-md" />
      <div ref={lgRef} className="cosmic-star cosmic-star-lg" />
      <div id="hero-horizon">
        <div className="glow" />
      </div>
      <div id="hero-earth" />
      <div className="hero-vert-label">
        framesbyraqueed - photography &amp; film - bangladesh
      </div>

      <div className="hero-left">
        <div className="hero-top-row">
          <span className="hero-handle">framesbyraqueed</span>
          <div className="hero-rule" />
          <span className="hero-location">Dhaka, Bangladesh</span>
        </div>

        <div className="hero-center">
          <div className="hero-eyebrow">
            Hobbyist Photographer &amp; Filmmaker
          </div>
          <h1 className="hero-name">
            Syed Raqueed
            <em>Bin Alvee</em>
          </h1>
          <p className="hero-tagline">
            Capturing moments that move you - one frame at a time.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-fill" onClick={onPhoto}>
              Explore Work
              <svg viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </button>
            <button className="btn btn-outline" onClick={onVideo}>
              Watch Films
            </button>
          </div>
        </div>

        <div className="hero-bottom-row">
          <div className="hero-exif">
            <div className="exif-item">
              <span>Aperture</span>f/2.0
            </div>
            <div className="exif-item">
              <span>ISO</span>400
            </div>
            <div className="exif-item">
              <span>Shutter</span>1/500s
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
