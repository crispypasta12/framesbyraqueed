import { useVideos } from '../../hooks/useVideos';

export default function VideoSection({ onVideo }) {
  const { videos } = useVideos();

  if (videos.length === 0) return null;

  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <section id="video" className="video-section">
      <span className="bento-label fi">02 — Videography</span>
      <h2 className="bento-title fi">In Motion</h2>

      <div
        className="video-hero-card fi"
        onClick={() => onVideo(featured)}
      >
        {featured.thumbnail_url ? (
          <img
            src={featured.thumbnail_url}
            alt={featured.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="vhc-bg"
            style={{ background: featured.g, position: 'absolute', inset: 0 }}
          />
        )}
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
          >
            {v.thumbnail_url ? (
              <img
                src={v.thumbnail_url}
                alt={v.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="vsm-bg"
                style={{ background: v.g, position: 'absolute', inset: 0 }}
              />
            )}
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
