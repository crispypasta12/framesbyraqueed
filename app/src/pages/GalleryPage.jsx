import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_PHOTOS, FILTERS } from '../data/photos.js';
import { useCursor } from '../hooks/useCursor.js';

const VIEWS = ['masonry', 'grid', 'list'];

const VIEW_ICONS = {
  masonry: (
    <svg viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="9" />
      <rect x="9" y="1" width="6" height="5" />
      <rect x="9" y="8" width="6" height="7" />
      <rect x="1" y="12" width="6" height="3" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 16 16">
      <line x1="1" y1="4" x2="15" y2="4" />
      <line x1="1" y1="8" x2="15" y2="8" />
      <line x1="1" y1="12" x2="15" y2="12" />
    </svg>
  ),
};

function useParallax() {
  useEffect(() => {
    const header = document.querySelector('.page-header');
    if (!header) return;
    const onScroll = () => {
      header.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

function useGalleryReveal(dep) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.05 }
    );
    const id = setTimeout(() => {
      document
        .querySelectorAll('.gallery-item')
        .forEach((el) => obs.observe(el));
    }, 50);
    return () => {
      clearTimeout(id);
      obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}

function PhotoItem({ photo, idx, view, onClick }) {
  const [n, d] = photo.ar.split('/').map(Number);
  const pct = view === 'grid' ? '100%' : ((d / n) * 100).toFixed(1) + '%';
  const aspect = view === 'grid' ? '1/1' : undefined;

  if (view === 'list') {
    return (
      <div
        className="gallery-item"
        style={{ transitionDelay: `${Math.min(idx, 8) * 40}ms` }}
        onClick={onClick}
        onMouseEnter={() => document.body.classList.add('on-photo')}
        onMouseLeave={() => document.body.classList.remove('on-photo')}
      >
        <div className="gi-scale">
          <div
            style={{
              width: '120px',
              height: '90px',
              background: photo.g,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg,rgba(0,0,0,.3),transparent)',
              }}
            />
          </div>
        </div>
        <div className="gi-info">
          <div className="gi-title">{photo.title}</div>
          <div className="gi-loc">{photo.loc}</div>
        </div>
        <div className="gallery-list-right">
          <span className="gallery-list-cam">{photo.cam}</span>
          <span className="gallery-list-num">
            {String(idx + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gallery-item"
      style={{ transitionDelay: `${Math.min(idx, 12) * 35}ms` }}
      onClick={onClick}
      onMouseEnter={() => document.body.classList.add('on-photo')}
      onMouseLeave={() => document.body.classList.remove('on-photo')}
    >
      <div className="gi-scale">
        <div
          className="gi-placeholder"
          style={{
            background: photo.g,
            paddingBottom: pct,
            aspectRatio: aspect,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top,rgba(8,8,8,.25) 0%,transparent 50%)',
            }}
          />
        </div>
      </div>
      <span className="gi-cam">{photo.cam}</span>
      <div className="gi-overlay" />
      <div className="gi-info">
        <div className="gi-title">{photo.title}</div>
        <div className="gi-loc">{photo.loc}</div>
      </div>
    </div>
  );
}

function GalleryLightbox({ photo, all, onClose, onPrev, onNext, onGoTo }) {
  const stripRef = useRef(null);

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

  useEffect(() => {
    if (!photo || !stripRef.current) return;
    const active = stripRef.current.querySelector('.lb-strip-thumb.active');
    if (!active) return;
    const strip = stripRef.current;
    strip.scrollLeft =
      active.offsetLeft - strip.offsetWidth / 2 + active.offsetWidth / 2;
  }, [photo]);

  if (!photo) return null;
  const idx = all.findIndex((p) => p.id === photo.id);
  const [n, d] = photo.ar.split('/').map(Number);
  const pct = ((d / n) * 100).toFixed(1) + '%';

  return (
    <div
      className={`lb${photo ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lb-main">
        <div className="lb-img-wrap">
          <div
            style={{
              background: photo.g,
              width: 'min(80vw,960px)',
              paddingBottom: `min(${pct},62vh)`,
              position: 'relative',
              overflow: 'hidden',
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
                  color: 'rgba(240,235,226,.15)',
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
          <div className="lb-meta-cam">{photo.cam}</div>
        </div>
        <div className="lb-counter">
          {String(idx + 1).padStart(2, '0')} /{' '}
          {String(all.length).padStart(2, '0')}
        </div>
      </div>

      <button className="lb-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        className="lb-v2-nav lb-v2-prev"
        onClick={onPrev}
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>
      <button
        className="lb-v2-nav lb-v2-next"
        onClick={onNext}
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>

      <div className="lb-strip-wrap">
        <div className="lb-strip" ref={stripRef}>
          {all.map((p, i) => (
            <div
              key={p.id}
              className={`lb-strip-thumb${p.id === photo.id ? ' active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onGoTo(i);
              }}
              style={{ background: p.g }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('masonry');
  const [lb, setLb] = useState(null);
  const [fading, setFading] = useState(false);
  const pendingFilter = useRef(null);

  useCursor('OPEN');
  useParallax();

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? ALL_PHOTOS
        : ALL_PHOTOS.filter((p) => p.tags.includes(filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const c = { All: ALL_PHOTOS.length };
    FILTERS.slice(1).forEach((f) => {
      c[f] = ALL_PHOTOS.filter((p) => p.tags.includes(f)).length;
    });
    return c;
  }, []);

  useGalleryReveal(filter + view + fading);

  const changeFilter = useCallback(
    (f) => {
      if (f === filter) return;
      setFading(true);
      pendingFilter.current = f;
      setTimeout(() => {
        setFilter(f);
        setFading(false);
      }, 220);
    },
    [filter]
  );

  const lbIdx = lb ? filtered.findIndex((p) => p.id === lb.id) : -1;
  const openLb = (p) => setLb(p);
  const closeLb = () => setLb(null);
  const prevLb = () =>
    setLb(filtered[(lbIdx - 1 + filtered.length) % filtered.length]);
  const nextLb = () => setLb(filtered[(lbIdx + 1) % filtered.length]);
  const goToLb = (i) => setLb(filtered[i]);

  return (
    <>
      <nav className="gallery-nav">
        <Link to="/" className="nav-back">
          <svg viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,5 5,12 12,19" />
          </svg>
          Back
        </Link>
        <Link to="/" className="nav-logo">
          framesbyraqueed
        </Link>
      </nav>

      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <span className="page-eyebrow">Photography</span>
            <h1 className="page-title">Full Gallery</h1>
          </div>
          <div className="page-meta">
            <div className="page-count">
              {String(filtered.length).padStart(2, '0')}
            </div>
            <div className="page-count-label">
              {filter === 'All' ? 'All Photos' : 'Filtered'}
            </div>
          </div>
        </div>
      </div>

      <div className="below-hero">
        <div className="filter-bar">
          <span className="filter-label">Filter</span>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => changeFilter(f)}
            >
              {f}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
          <div className="view-toggle">
            {VIEWS.map((v) => (
              <button
                key={v}
                className={`view-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
                title={v}
              >
                {VIEW_ICONS[v]}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-wrap">
          <div className={`gallery-stage${fading ? ' fading' : ''}`}>
            <div
              className={
                view === 'masonry'
                  ? 'gallery-masonry'
                  : view === 'grid'
                  ? 'gallery-grid'
                  : 'gallery-list'
              }
            >
              {filtered.map((p, i) => (
                <PhotoItem
                  key={p.id}
                  photo={p}
                  idx={i}
                  view={view}
                  onClick={() => openLb(p)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <GalleryLightbox
        photo={lb}
        all={filtered}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
        onGoTo={goToLb}
      />
    </>
  );
}
