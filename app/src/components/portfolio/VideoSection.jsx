import { VIDEOS } from '../../data/photos.js';

export default function VideoSection({ onVideo }) {
  const featured = VIDEOS[0];
  const rest = VIDEOS.slice(1);
  return (
    <section id="video" className="video-section">
      <span className="bento-label fi">03 — Videography</span>
      <h2 className="bento-title fi">In Motion</h2>

      <div
        className="video-hero-card fi"
        onClick={() => onVideo(featured)}
        onMouseEnter={() => document.body.classList.add('hovering-photo')}
        onMouseLeave={() => document.body.classList.remove('hovering-photo')}
      >
        <div
          className="vhc-bg"
          style={{
            background: featured.g,
            position: 'absolute',
            inset: 0,
          }}
        />
        <div className="vhc-overlay" />
        <div className="vhc-info">
          <div className="vhc-label">
            Featured Film · {featured.dur}
          </div>
          <div className="vhc-title">{featured.title}</div>
          <div className="vhc-dur">{featured.loc}</div>
        </div>
        <div className="vhc-play">
          <svg viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>

      <div className="video-grid-sm fi">
        {rest.map((v) => (
          <div
            key={v.id}
            className="vsm"
            onClick={() => onVideo(v)}
            onMouseEnter={() => document.body.classList.add('hovering-photo')}
            onMouseLeave={() =>
              document.body.classList.remove('hovering-photo')
            }
          >
            <div
              className="vsm-bg"
              style={{ background: v.g, position: 'absolute', inset: 0 }}
            />
            <div className="vsm-ov">
              <div className="vsm-play">
                <svg viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
            <div className="vsm-info">
              <div className="vsm-title">{v.title}</div>
              <div className="vsm-loc">
                {v.dur} · {v.loc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
