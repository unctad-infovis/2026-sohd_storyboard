import ButtonShare from '@unctad-infovis/general-tools/components/ButtonShare.jsx';
import basePath from '@unctad-infovis/general-tools/helpers/BasePath.js';
import './Header.css';

export default function Header({ full_report_url, subtitle, title, url }) {
  function scrollToY() {
    const start = window.scrollY;
    const dist = Math.round(window.innerHeight) - start + 50;
    if (!dist) return;
    const duration = 1000;
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

  return (
    <div className="header_container" style={{ '--hero-bg-url': `url(${basePath()}assets/img/2026-sohd_storyboard_main.jpg)` }}>
      <div className="header_top">
        <a className="header_logo_link" href="https://unctad.org" rel="noopener" target="_blank">
          <img alt="UN Trade and Development" className="header_logo" src={`${basePath()}assets/img/2026-sohd_storyboard_unctad_logo_white.png`} />
        </a>
        <div className="header_hero">
          <ButtonShare url={url} defaultOpen position="static" iconBg="rgba(0,0,0,0.45)" iconColor="#fff" size={36} />
          <h1 className="header_title">{title}</h1>
          <p className="header_subtitle">{subtitle}</p>
          <a className="header_download_btn" href={full_report_url} rel="noopener" target="_blank">
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 3v12m-5-5 5 5 5-5M5 21h14" />
            </svg>
            Download the report (PDF)
          </a>
          <p className="header_date">June 2026</p>
        </div>
      </div>

      <div className="header_bottom">
        <button aria-label="Scroll down" className="header_scroll_btn" onClick={() => scrollToY()} type="button">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" className="scroll_down">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="hero-photo-grade" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1.00  0.00  0.00  0  0
                0.00  0.97  0.00  0  0
                0.00  0.00  1.13  0  0
                0     0     0     1  0
              "
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
