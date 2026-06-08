import useIsVisible from './../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';
import RollingNumber from './../general/RollingNumber';

import './Slide04.css';

const R = 84;
const CIRCUM = parseFloat((2 * Math.PI * R).toFixed(2)); // 527.79
const TARGET = 65;
const TOTAL = 75;
const TARGET_OFFSET = parseFloat((CIRCUM * (1 - TARGET / TOTAL)).toFixed(2)); // 70.37

export default function Slide04({ url }) {
  const [ref, isVisible] = useIsVisible(0.9);

  return (
    <div className="slide_container slide04">
      <div className="slide_content" ref={ref}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="rgba(0,0,0,0.45)" iconColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3>
              <div>
                Nearly all of them are <span className="accent">net oil import dependent</span>.
              </div>
            </h3>
          </div>
        </div>
        <div className="panels">
          {/* ── Left: radial chart ── */}
          <div className="panel">
            <div className="radial_wrap">
              <svg viewBox="0 0 200 200" className="radial_svg" aria-hidden="true">
                <circle className="track" cx="100" cy="100" r={R} fill="none" strokeWidth="14" />
                <circle className="fill" cx="100" cy="100" r={R} fill="none" strokeWidth="14" transform="rotate(-90 100 100)" strokeDasharray={CIRCUM} strokeDashoffset={isVisible ? TARGET_OFFSET : CIRCUM} />
              </svg>
              <div className="center">
                <span className="big_number">
                  <RollingNumber target={TARGET} inView={isVisible} duration={1200} />
                </span>
                <span className="economies">out of {TOTAL} economies</span>
              </div>
            </div>
            <p className="caption">
              depend on <strong>imported oil</strong>
            </p>
          </div>

          {/* ── Right: people stat ── */}
          <div className="panel">
            <svg className="person" viewBox="0 0 120 160" aria-hidden="true">
              <circle cx="60" cy="44" r="22" fill="currentColor" />
              <path d="M16 156 V112 a44 44 0 0 1 88 0 V156 z" fill="currentColor" />
            </svg>
            <p className="they">They are home to nearly</p>
            <p className="billion">1 billion</p>
            <p className="people">people</p>
          </div>
        </div>

        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade, and UNCTADStat.
          </div>
          <div>
            <span className="label">Note:</span> Figures correspond to the 65 net oil-importing vulnerable economies, excluding Singapore.
          </div>
        </div>
      </div>
    </div>
  );
}
