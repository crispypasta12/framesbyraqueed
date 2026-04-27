import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAspectClass, getAspectFromDimensions, getAspectValue } from '../../lib/aspectClass.js';
import { IMAGE_PRESETS, cloudinaryImage } from '../../lib/cloudinary.js';

function ExifStrip({ photo }) {
  const chips = [
    photo.aperture,
    photo.shutter_speed,
    photo.iso != null && `ISO ${photo.iso}`,
    photo.focal_length,
  ].filter(Boolean);
  if (!chips.length) return null;
  return (
    <div className="exif-strip">
      {chips.map((c) => <span key={c} className="exif-chip">{c}</span>)}
    </div>
  );
}

function interleave(photos) {
  const portrait = photos.filter((p) => {
    const [w, h] = (p.ar || '4/3').split('/').map(Number);
    return h > w;
  });
  const wide = photos.filter((p) => {
    const [w, h] = (p.ar || '4/3').split('/').map(Number);
    return h <= w;
  });
  const result = [];
  const len = Math.max(portrait.length, wide.length);
  for (let i = 0; i < len; i++) {
    if (i < wide.length) result.push(wide[i]);
    if (i < portrait.length) result.push(portrait[i]);
  }
  return result;
}

export default function HGallery({ photos, onPhoto }) {
  const [loadedAspects, setLoadedAspects] = useState({});
  const ordered = interleave(photos);
  const rows = ordered.reduce(
    (acc, photo) => {
      const srcIdx = photos.indexOf(photo);
      acc[acc[0].length <= acc[1].length ? 0 : 1].push({ photo, srcIdx });
      return acc;
    },
    [[], []]
  );

  return (
    <div id="gallery" className="hscroll-outer">
      <div className="hscroll-section">
        <div className="hscroll-header fi">
          <div>
            <span className="sec-label">01 — Photography</span>
            <h2>The Still Frame</h2>
          </div>
          <div className="hscroll-progress-wrap">
            <span className="hscroll-count">
              {String(photos.length).padStart(2, '0')} Frames
            </span>
            <Link to="/gallery" className="view-all-link">
              View All →
            </Link>
          </div>
        </div>
        <div className="hscroll-track-wrap">
          <div className="hscroll-track">
            <div className="hscroll-rows">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="hscroll-row">
                  {row.map(({ photo: p, srcIdx }, rowPos) => {
                    const aspect = loadedAspects[p.id] || {
                      className: getAspectClass(p.ar),
                      value: getAspectValue(p.ar),
                    };

                    return (
                      <div
                        key={p.id}
                        className={`hslide ${aspect.className}`}
                        onClick={() => onPhoto(p, srcIdx)}
                        onMouseEnter={() => document.body.classList.add('hovering-photo')}
                        onMouseLeave={() => document.body.classList.remove('hovering-photo')}
                        style={{ '--photo-ar': aspect.value }}
                      >
                        <div className="hslide-bg" style={{ background: p.url ? '#080808' : p.g }}>
                          {p.url && (
                            <img
                              src={cloudinaryImage(p.url, IMAGE_PRESETS.card)}
                              alt={p.title}
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                              loading={rowPos < 3 ? 'eager' : 'lazy'}
                              fetchPriority={rowPos < 3 ? 'high' : 'auto'}
                              decoding="async"
                              onLoad={(e) => {
                                const { naturalWidth, naturalHeight } = e.currentTarget;
                                setLoadedAspects((prev) => ({
                                  ...prev,
                                  [p.id]: getAspectFromDimensions(naturalWidth, naturalHeight),
                                }));
                              }}
                            />
                          )}
                        </div>
                        <div className="hslide-overlay" />
                        <span className="hslide-cam">{p.cam}</span>
                        <div className="hslide-info">
                          <span className="hslide-num">{String(srcIdx + 1).padStart(2, '0')}</span>
                          <div className="hslide-title">{p.title}</div>
                          <div className="hslide-loc">{p.loc}</div>
                          <ExifStrip photo={p} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
