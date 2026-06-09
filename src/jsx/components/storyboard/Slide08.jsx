import useIsVisible from '../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';
import RollingNumber from './../general/RollingNumber';

import './Slide08.css';

const LDC_VAL = 16.1;
const SIDS_VAL = 4.3;
const TOTAL_VAL = LDC_VAL + SIDS_VAL; // 20.4

export default function Slide08({ url }) {
  const [slideRef, inView] = useIsVisible(0.9);

  return (
    <div className="slide_container slide08">
      <div className="slide_content" ref={slideRef}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="#fff" iconHoverBg="#009edb" iconColor="#000" iconHoverColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3>
              <div>
                The cost of importing oil could rise by <span className="accent">$20 billion</span> per year.
              </div>
            </h3>
          </div>
          <h4>Change in the net oil import bill from a 50% price increase, assuming quantities remain unchanged at 2024 levels.</h4>
        </div>
        <div className="chart_container">
          <div className="total_container">
            <div className="total_pre_text">Increase</div>
            <div className="total_display">
              <span className="total_prefix">$</span>
              <span className="total_number">
                <RollingNumber target={TOTAL_VAL} decimals={1} inView={inView} duration={1400} />
              </span>
              <span className="total_suffix">billion / year</span>
            </div>
          </div>
          <div className="legend">
            <span className="legend_item legend_ldc">
              <span className="legend_swatch" />
              Least developed country
            </span>
            <span className="legend_item legend_sids">
              <span className="legend_swatch" />
              Small island developing State
            </span>
          </div>
          <div className="bar_container">
            <div className="stacked_bar" style={{ width: inView ? '100%' : '0%' }}>
              <div className="segment seg_ldc">
                <span className="seg_label" style={{ opacity: inView ? 1 : 0 }}>
                  ${LDC_VAL} bn
                </span>
              </div>
              <div className="segment seg_sids">
                <span className="seg_label" style={{ opacity: inView ? 1 : 0 }}>
                  ${SIDS_VAL} bn
                </span>
              </div>
            </div>
          </div>
          <div className="chart_meta">
            <div className="source">
              <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade.
            </div>
            <div className="note">
              <span className="label">Note:</span> Figures for 65 LDCs and SIDS that are net importers of crude or refined oil products, excluding Singapore.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
