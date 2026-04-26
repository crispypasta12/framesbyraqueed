import { useEffect } from 'react';

export function useReveal(selector = '.fi', addedClass = 'v', deps = []) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(addedClass);
        }),
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    const id = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => obs.observe(el));
    }, 50);

    return () => {
      clearTimeout(id);
      obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
