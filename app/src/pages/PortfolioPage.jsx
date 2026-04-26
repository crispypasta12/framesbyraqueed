import { useEffect, useState } from 'react';
import { PHOTOS } from '../data/photos.js';
import { useCursor } from '../hooks/useCursor.js';
import { useReveal } from '../hooks/useReveal.js';
import Nav from '../components/portfolio/Nav.jsx';
import Hero from '../components/portfolio/Hero.jsx';
import Marquee from '../components/portfolio/Marquee.jsx';
import HGallery from '../components/portfolio/HGallery.jsx';
import BentoGrid from '../components/portfolio/BentoGrid.jsx';
import Stats from '../components/portfolio/Stats.jsx';
import VideoSection from '../components/portfolio/VideoSection.jsx';
import About from '../components/portfolio/About.jsx';
import Footer from '../components/portfolio/Footer.jsx';
import Lightbox from '../components/portfolio/Lightbox.jsx';
import VideoModal from '../components/portfolio/VideoModal.jsx';

export default function PortfolioPage() {
  const [lightbox, setLightbox] = useState({ photo: null, idx: 0 });
  const [videoModal, setVideoModal] = useState(null);

  useCursor('VIEW');
  useReveal('.fi', 'v', []);

  useEffect(() => {
    const btt = document.getElementById('btt');
    if (!btt) return;
    const h = () => btt.classList.toggle('show', window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      window.removeEventListener('scroll', h);
      btt.onclick = null;
    };
  }, []);

  const openPhoto = (photo, idx) => setLightbox({ photo, idx });
  const closeLB = () => setLightbox({ photo: null, idx: 0 });
  const prevPhoto = () =>
    setLightbox(({ idx }) => {
      const ni = (idx - 1 + PHOTOS.length) % PHOTOS.length;
      return { photo: PHOTOS[ni], idx: ni };
    });
  const nextPhoto = () =>
    setLightbox(({ idx }) => {
      const ni = (idx + 1) % PHOTOS.length;
      return { photo: PHOTOS[ni], idx: ni };
    });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Nav />
      <Hero
        onPhoto={() => scrollTo('gallery')}
        onVideo={() => scrollTo('video')}
      />
      <Marquee />
      <HGallery onPhoto={openPhoto} />
      <BentoGrid onPhoto={openPhoto} />
      <Stats />
      <VideoSection onVideo={setVideoModal} />
      <About />
      <Footer />
      <Lightbox
        photo={lightbox.photo}
        onClose={closeLB}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />
      <VideoModal video={videoModal} onClose={() => setVideoModal(null)} />
    </>
  );
}
