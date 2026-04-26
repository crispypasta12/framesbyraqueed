import { useEffect } from 'react';

export function useCursor(label = 'VIEW') {
  useEffect(() => {
    const dot = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    const labelEl = document.getElementById('cur-label');
    if (!dot || !ring || !labelEl) return;

    labelEl.textContent = label;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', move);

    let raf = 0;
    const tick = () => {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      labelEl.style.left = rx + 'px';
      labelEl.style.top = ry + 'px';
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, [label]);
}
