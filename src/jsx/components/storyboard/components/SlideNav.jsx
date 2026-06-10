import { useEffect, useRef, useState } from 'react';
import './SlideNav.css';

const SLIDE_COUNT = 10;
const SLIDE_NUMS = Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1);

function scrollToY(target) {
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
}

function scrollToSlide(index) {
  const el = document.querySelector(`.slide${String(index + 1).padStart(2, '0')}`);
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

export default function SlideNav() {
  const [visible, setVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  activeSlideRef.current = activeSlide;

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
      const midY = window.scrollY + window.innerHeight / 2;
      const firstTop = slideEls[0].getBoundingClientRect().top + window.scrollY;
      const lastBottom = slideEls[slideEls.length - 1].getBoundingClientRect().bottom + window.scrollY;

      // -1 = header, SLIDE_COUNT = footer
      if (midY < firstTop) {
        setActiveSlide(-1);
        return;
      }
      if (midY > lastBottom) {
        setActiveSlide(SLIDE_COUNT);
        return;
      }

      let best = 0;
      let minDist = Infinity;
      for (const [i, el] of slideEls.entries()) {
        const dist = Math.abs(el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2 - midY);
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

  // goDown/goUp read from ref so the keyboard handler (registered once) always
  // gets the current slide index without needing to re-register on each scroll.
  const goDown = () => {
    const cur = activeSlideRef.current;
    if (cur < 0) {
      scrollToSlide(0);
      return;
    }
    if (cur < SLIDE_COUNT - 1) {
      scrollToSlide(cur + 1);
      return;
    }
    const footer = document.querySelector('.footer_container');
    if (footer) scrollToY(footer.getBoundingClientRect().top + window.scrollY);
  };

  const goUp = () => {
    const cur = activeSlideRef.current;
    if (cur >= SLIDE_COUNT) {
      scrollToSlide(SLIDE_COUNT - 1);
      return;
    }
    if (cur > 0) {
      scrollToSlide(cur - 1);
      return;
    }
    scrollToY(0);
  };

  const goDownRef = useRef(goDown);
  const goUpRef = useRef(goUp);
  goDownRef.current = goDown;
  goUpRef.current = goUp;

  useEffect(() => {
    const onKeyDown = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goDownRef.current();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goUpRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const progress = Math.max(0, Math.min(1, activeSlide / (SLIDE_COUNT - 1)));

  return (
    <div className={`slide_nav${visible ? ' slide_nav_visible' : ''}`}>
      <button aria-label="Previous slide" className="slide_nav_arrow" onClick={goUp} type="button">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <div className="slide_nav_track" style={{ '--progress': progress }}>
        {SLIDE_NUMS.map(slideNum => (
          <button aria-label={`Go to slide ${slideNum}`} className={`slide_nav_dot${slideNum - 1 === activeSlide ? ' slide_nav_dot_active' : ''}`} key={slideNum} onClick={() => scrollToSlide(slideNum - 1)} type="button" />
        ))}
      </div>

      <button aria-label="Next slide" className="slide_nav_arrow slide_nav_arrow_down" onClick={goDown} type="button">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
