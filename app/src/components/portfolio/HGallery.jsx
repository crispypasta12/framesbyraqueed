import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HPHOTOS } from '../../data/photos.js';

export default function HGallery({ onPhoto }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    const countEl = countRef.current;
    if (!outer || !track) return;

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const scrollable = outer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const maxTx = track.scrollWidth - track.parentElement.offsetWidth;
      track.style.transform = `translateX(${-maxTx * progress}px)`;
      if (bar) bar.style.transform = `scaleX(${progress})`;

      const slideW = track.children[0]?.offsetWidth || 1;
      const idx = Math.min(
        Math.round((maxTx * progress) / (slideW + 16)),
        HPHOTOS.length - 1
      );
      if (countEl)
        countEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(
          HPHOTOS.length
        ).padStart(2, '0')}`;
    };

    const setHeight = () => {
      const overscroll = track.scrollWidth - track.parentElement.offsetWidth;
      outer.style.height = window.innerHeight + Math.max(overscroll, 0) + 'px';
      update();
    };

    setHeight();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  return (
    <div id="gallery" ref={outerRef} className="hscroll-outer">
      <div className="hscroll-section">
        <div className="hscroll-header fi">
          <div>
            <span className="sec-label">01 — Photography</span>
            <h2>The Still Frame</h2>
          </div>
          <div className="hscroll-progress-wrap">
            <span ref={countRef} className="hscroll-count">
              01 / 08
            </span>
            <div className="hscroll-bar">
              <div
                ref={barRef}
                className="hscroll-bar-fill"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <Link to="/gallery" className="view-all-link">
              View All →
            </Link>
          </div>
        </div>
        <div className="hscroll-track-wrap">
          <div ref={trackRef} className="hscroll-track">
            {HPHOTOS.map((p, i) => (
              <div
                key={p.id}
                className="hslide"
                onClick={() => onPhoto(p, i)}
                onMouseEnter={() =>
                  document.body.classList.add('hovering-photo')
                }
                onMouseLeave={() =>
                  document.body.classList.remove('hovering-photo')
                }
              >
                <div className="hslide-bg" style={{ background: p.g }} />
                <div className="hslide-overlay" />
                <span className="hslide-cam">{p.cam}</span>
                <div className="hslide-info">
                  <span className="hslide-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="hslide-title">{p.title}</div>
                  <div className="hslide-loc">{p.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
