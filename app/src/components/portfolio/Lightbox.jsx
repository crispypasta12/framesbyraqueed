import { useEffect } from 'react';

export default function Lightbox({ photo, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!photo) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [photo, onClose, onPrev, onNext]);

  const [n, d] = photo ? photo.ar.split('/').map(Number) : [3, 2];
  const pct = ((d / n) * 100).toFixed(1) + '%';

  return (
    <div
      className={`modal-bg${photo ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {photo && (
        <div className="lightbox-inner">
          <div className="lb-img">
            <div
              style={{
                background: photo.g,
                width: 'min(80vw,900px)',
                paddingBottom: `min(${pct},68vh)`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontStyle: 'italic',
                    color: 'rgba(240,235,226,0.18)',
                    fontSize: '1rem',
                    letterSpacing: '.2em',
                  }}
                >
                  {photo.title}
                </span>
              </div>
            </div>
          </div>
          <div className="lb-meta">
            <h3>{photo.title}</h3>
            <p>{photo.loc}</p>
            <div className="lb-cam">{photo.cam}</div>
          </div>
        </div>
      )}
      <button className="modal-close" onClick={onClose}>
        ✕
      </button>
      <button className="lb-nav lb-prev" onClick={onPrev}>
        ‹
      </button>
      <button className="lb-nav lb-next" onClick={onNext}>
        ›
      </button>
    </div>
  );
}
