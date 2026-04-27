import { useEffect } from 'react';
import { IMAGE_PRESETS, cloudinaryImage } from '../../lib/cloudinary.js';

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

  return (
    <div
      className={`modal-bg${photo ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {photo && (
        <div className="lightbox-inner">
          <div className="lb-img">
            {photo.url ? (
              <img
                className="lb-photo"
                src={cloudinaryImage(photo.url, IMAGE_PRESETS.lightbox)}
                alt={photo.title}
                decoding="async"
              />
            ) : (
              <span className="lb-placeholder">{photo.title}</span>
            )}
          </div>
          <div className="lb-meta">
            <h3>{photo.title}</h3>
            <p>{photo.loc}</p>
            <div className="lb-cam">{photo.cam}</div>
            {(() => {
              const chips = [
                photo.aperture,
                photo.shutter_speed,
                photo.iso != null && `ISO ${photo.iso}`,
                photo.focal_length,
              ].filter(Boolean);
              return chips.length ? (
                <div className="exif-strip exif-strip--centered" style={{ marginTop: '0.7rem' }}>
                  {chips.map((c) => <span key={c} className="exif-chip">{c}</span>)}
                </div>
              ) : null;
            })()}
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
