import useIsVisible from './../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';
import RollingNumber from './../general/RollingNumber';

import './Slide05.css';

const CRUDE_PCT = 2.2;
const REFINED_PCT = 97.8;
const MAX_ICON_H = 180; // px — refined icon at full height
// Area-proportional scaling: sqrt keeps both icons visible while conveying the ratio
const CRUDE_ICON_H = Math.round(MAX_ICON_H * Math.sqrt(CRUDE_PCT / REFINED_PCT));

export default function Slide05({ url }) {
  const [ref, isVisible] = useIsVisible(0.9);

  return (
    <div className="slide_container slide05">
      <div className="slide_content" ref={ref}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="#fff" iconHoverBg="#009edb" iconColor="#000" iconHoverColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3 className="arrow">
              <div>
                These economies mainly import <span className="accent">refined oil products</span>.
              </div>
            </h3>
          </div>
          <h4>Share of net imports of crude and refined oil in 2024</h4>
        </div>
        <div className="visualisation_container">
          <div className="panels">
            {/* ── Left: crude oil barrel (yellow, small) ── */}
            <div className="panel">
              <p className="pct pct_crude">
                <RollingNumber target={CRUDE_PCT} decimals={1} inView={isVisible} duration={1600} />%
              </p>
              <div className="svg_container">
                {/*<svg className="icon icon_crude" viewBox="0 0 49.65 56.46" aria-hidden="true" style={{ height: isVisible ? `${CRUDE_ICON_H}px` : '0px' }}>*/}
                <svg className="icon icon_crude" viewBox="0 0 49.65 56.46" aria-hidden="true" style={{ height: CRUDE_ICON_H, opacity: isVisible ? `1` : '0.1' }}>
                  <path fill="currentColor" d="M28.42,44.47c-2.11.26-4.41.39-6.73.39-3.18,0-10.87-.28-15.76-2.74v3.05l-.15.13c-.78.64-1.16,1.27-1.16,1.97,0,3.46,8.79,5.32,17.07,5.32,2.63,0,5.17-.18,7.45-.51-.72-1.5-1.1-3.17-1.1-4.93,0-.82.13-1.73.38-2.69" />
                  <path
                    fill="currentColor"
                    d="M21.68,5.35c8.14,0,13.81,1.78,13.81,3.38s-5.67,3.38-13.81,3.38-13.81-1.78-13.81-3.38,5.67-3.38,13.81-3.38M5.77,14.25c-.77.63-1.16,1.3-1.16,1.99,0,3.45,8.79,5.32,17.07,5.32s17.07-1.86,17.07-5.32c0-.7-.39-1.37-1.17-2l-.15-.12v-3.27l.15-.12c.77-.63,1.17-1.3,1.17-2,0-3.45-8.79-5.32-17.07-5.32S4.61,5.28,4.61,8.73c0,.69.39,1.36,1.16,1.99l.15.12v3.29l-.15.12Z"
                  />
                  <path fill="currentColor" d="M14.65,9.9c2.13,0,3.54-.71,3.54-1.17s-1.41-1.17-3.54-1.17-3.54.71-3.54,1.17,1.41,1.17,3.54,1.17" />
                  <path fill="currentColor" d="M37.44,28.1v-6.68c-4.89,2.47-12.58,2.74-15.76,2.74s-10.87-.28-15.76-2.74v13.42l-.15.11c-.76.62-1.16,1.29-1.16,1.99,0,3.46,8.79,5.32,17.07,5.32,2.69,0,5.32-.2,7.65-.56,2.06-5.16,5.99-10.84,7.47-12.91.18-.26.42-.51.65-.7" />
                  <path
                    fill="currentColor"
                    d="M40.39,52.64c-3.22,0-5.84-2.57-5.84-5.74,0-.61.51-1.11,1.13-1.11s1.13.5,1.13,1.11c0,1.94,1.61,3.51,3.58,3.51.62,0,1.13.5,1.13,1.11s-.51,1.11-1.13,1.11M41.39,30.31c-.28-.38-.73-.62-1.21-.62s-.93.23-1.21.62c-.85,1.18-8.27,11.64-8.27,16.85s4.25,9.3,9.48,9.3,9.48-4.17,9.48-9.3-7.42-15.67-8.27-16.85"
                  />
                </svg>
              </div>
              <p className="label">Crude oil</p>
            </div>

            {/* ── Right: gas station (blue, large) ── */}
            <div className="panel">
              <p className="pct pct_refined">
                <RollingNumber target={REFINED_PCT} decimals={1} inView={isVisible} duration={1600} />%
              </p>
              <div className="svg_container">
                {/*<svg className="icon icon_refined" viewBox="0 0 62.87 56.46" aria-hidden="true" style={{ height: isVisible ? `${MAX_ICON_H}px` : '0px' }}>*/}
                <svg className="icon icon_refined" viewBox="0 0 62.87 56.46" aria-hidden="true" style={{ height: MAX_ICON_H, opacity: isVisible ? `1` : '0.1' }}>
                  <path
                    fill="currentColor"
                    d="M19.55,7.96c-.64.18-1.09.85-1.08,1.52-.01,3.92,0,7.84,0,11.76.01.73.65,1.43,1.39,1.41,5.65.01,11.31-.03,16.96,0,.79-.01,1.43-.81,1.4-1.59-.01-3.86,0-7.72-.01-11.58.02-.84-.74-1.63-1.57-1.58-5.7.05-11.4-.04-17.09.05M12.71,5.81c.81-2.38,3.16-4.08,5.64-4.12,6.6-.02,13.2-.05,19.81-.03,1.83,0,3.64.84,4.8,2.3.95,1.11,1.43,2.56,1.45,4.02,0,6-.02,11.99,0,17.99,1.99-.37,4.15,1.21,4.23,3.3.02,4.31,0,8.62,0,12.92.04,1.31.31,2.67,1.08,3.76.87,1.29,2.56,1.99,4.07,1.6,1.35-.33,2.41-1.46,2.86-2.77.71-2.02.54-4.24.19-6.32-.65-3.24-1.84-6.34-2.45-9.58-.36-1.8-.53-3.64-.66-5.47-.71-.25-1.36-.74-1.67-1.46-.3-.58-.2-1.26-.21-1.89,0-2.54,0-5.07.01-7.61-1.73-1.71-3.46-3.43-5.16-5.17-.85-.82-.47-2.56.7-2.86.55-.21,1.17-.02,1.57.4,2.53,2.54,5.12,5.02,7.66,7.55.57.58,1.38,1.14,1.37,2.06.02,2.16-.02,4.31,0,6.47.02,1.15-.84,2.11-1.86,2.49,0,2.93.68,5.79,1.41,8.61,1,3.53,2.22,7.15,1.86,10.88-.12,1.93-.76,3.91-2.14,5.3-1.26,1.3-3.07,2.03-4.87,1.88-1.93-.08-3.71-1.24-4.75-2.86-1.03-1.5-1.39-3.36-1.38-5.17,0-4.19.03-8.39,0-12.58-.09-.89-1.09-1.13-1.83-1.1-.08,4.39-.03,8.77-.05,13.16.02,2.53-.05,5.06.02,7.59.47.02.94,0,1.42.04.65.08,1.16.73,1.13,1.39-.01,1.07.02,2.15,0,3.23-.02.64-.66,1.12-1.27,1.09-11.52-.01-23.04-.01-34.57,0-.45.02-.94-.1-1.23-.48-.28-.36-.21-.84-.22-1.26.02-.91-.04-1.83,0-2.74.02-.66.64-1.21,1.27-1.22.46-.02.92-.02,1.38-.04,0-13.3,0-26.61,0-39.92-.03-1.13,0-2.28.38-3.35"
                  />
                </svg>
              </div>
              <p className="label">Refined oil products</p>
            </div>
          </div>
          <div className="chart_meta">
            <div className="source">
              <div className="source">
                <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade.
              </div>
              <div className="note">
                <span className="label">Note:</span> Figures correspond to the 65 net oil-importing vulnerable economies, excluding Singapore.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
