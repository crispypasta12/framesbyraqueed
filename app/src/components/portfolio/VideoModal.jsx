import { useEffect } from 'react';

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const h = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [video, onClose]);

  return (
    <div
      className={`modal-bg${video ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {video && (
        <div className="modal-iframe-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={video.title}
          />
        </div>
      )}
      <button className="modal-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
