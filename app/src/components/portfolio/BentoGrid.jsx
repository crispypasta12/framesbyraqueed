import { Link } from 'react-router-dom';

const CLASSES = ['bento-item span2r', 'bento-item', 'bento-item', 'bento-item span2c', 'bento-item'];

export default function BentoGrid({ photos, onPhoto }) {
  const items = photos.slice(0, 5);

  return (
    <section className="bento-section fi">
      <span className="bento-label">02 — Featured</span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '3rem',
        }}
      >
        <h2 className="bento-title" style={{ margin: 0 }}>
          Selected Work
        </h2>
        <Link to="/gallery" className="view-all-link">
          View Full Gallery →
        </Link>
      </div>
      <div className="bento">
        {items.map((p, i) => (
          <div
            key={p.id}
            className={CLASSES[i]}
            onClick={() => onPhoto(p, i)}
            onMouseEnter={() => document.body.classList.add('hovering-photo')}
            onMouseLeave={() => document.body.classList.remove('hovering-photo')}
          >
            <div
              className="bento-bg"
              style={{ position: 'absolute', inset: 0, background: p.url ? '#080808' : p.g }}
            >
              {p.url && (
                <img
                  src={p.url}
                  alt={p.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              )}
            </div>
            <div className="bento-ov" />
            <span className="bento-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="bento-meta">
              <div className="bento-meta-title">{p.title}</div>
              <div className="bento-meta-loc">
                {p.cam} · {p.loc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
