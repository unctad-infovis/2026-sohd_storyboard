import { useEffect, useState } from 'react';
import './SlideNav.css';

const SLIDE_COUNT = 10;
const SLIDE_NUMS = Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1);

export default function SlideNav() {
  const [visible, setVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.slides_container');
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const slideEls = SLIDE_NUMS.map(n => document.querySelector(`.slide${String(n).padStart(2, '0')}`)).filter(Boolean);
    if (!slideEls.length) return;

    const updateActive = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let best = 0;
      let minDist = Infinity;
      for (const [i, el] of slideEls.entries()) {
        const dist = Math.abs(window.scrollY + el.getBoundingClientRect().top + el.offsetHeight / 2 - mid);
        if (dist < minDist) {
          minDist = dist;
          best = i;
        }
      }
      setActiveSlide(best);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  const scrollToY = target => {
    const start = window.scrollY;
    const dist = Math.round(target) - start;
    if (!dist) return;
    const duration = 550;
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    let t0 = null;
    const step = ts => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const scrollToSlide = index => {
    const el = document.querySelector(`.slide${String(index + 1).padStart(2, '0')}`);
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
  };

  const handleUp = () => {
    if (activeSlide > 0) scrollToSlide(activeSlide - 1);
    else scrollToY(0);
  };

  const handleDown = () => {
    if (activeSlide < SLIDE_COUNT - 1) {
      scrollToSlide(activeSlide + 1);
    } else {
      const footer = document.querySelector('.footer_container');
      if (footer) scrollToY(footer.getBoundingClientRect().top + window.scrollY);
    }
  };

  return (
    <div className={`slide_nav${visible ? ' slide_nav_visible' : ''}`}>
      <button aria-label="Previous slide" className="slide_nav_arrow" onClick={handleUp} type="button">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <div className="slide_nav_track" style={{ '--progress': activeSlide / (SLIDE_COUNT - 1) }}>
        {SLIDE_NUMS.map(slideNum => (
          <button aria-label={`Go to slide ${slideNum}`} className={`slide_nav_dot${slideNum - 1 === activeSlide ? ' slide_nav_dot_active' : ''}`} key={slideNum} onClick={() => scrollToSlide(slideNum - 1)} type="button" />
        ))}
      </div>

      <button aria-label="Next slide" className="slide_nav_arrow slide_nav_arrow_down" onClick={handleDown} type="button">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
