import { Link } from 'react-router-dom';
import { PHOTOS } from '../../data/photos.js';

const LAYOUT = [
  { idx: 1, cls: 'bento-item span2r' },
  { idx: 2, cls: 'bento-item' },
  { idx: 3, cls: 'bento-item' },
  { idx: 6, cls: 'bento-item span2c' },
  { idx: 10, cls: 'bento-item' },
];

export default function BentoGrid({ onPhoto }) {
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
        {LAYOUT.map(({ idx, cls }, i) => {
          const p = PHOTOS[idx];
          return (
            <div
              key={p.id}
              className={cls}
              onClick={() =>
                onPhoto(
                  p,
                  PHOTOS.findIndex((x) => x.id === p.id)
                )
              }
              onMouseEnter={() => document.body.classList.add('hovering-photo')}
              onMouseLeave={() =>
                document.body.classList.remove('hovering-photo')
              }
            >
              <div
                className="bento-bg"
                style={{ position: 'absolute', inset: 0, background: p.g }}
              />
              <div className="bento-ov" />
              <span className="bento-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="bento-meta">
                <div className="bento-meta-title">{p.title}</div>
                <div className="bento-meta-loc">
                  {p.cam} · {p.loc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
