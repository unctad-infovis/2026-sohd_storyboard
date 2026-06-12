import { COUNTRIES } from './../../data/countries';
import { LDC } from './../../data/countryGroups';
import useIsVisible from './../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';
import CircleFlag from './components/CircleFlag';

import './Slide06.css';

// Only slide-specific values — name, iso2, and type are looked up from COUNTRIES / LDC.
// Note: seven LDCs here are also SIDS; they are shown in the LDC aggregate (type always 'ldc' for dual-members).
const DATA = [
  { iso3: 'SYC', value: 99.0 },
  { iso3: 'UGA', value: 61.0 },
  { iso3: 'MUS', value: 58.3 },
  { iso3: 'TZA', value: 56.0 },
  { iso3: 'ZMB', value: 44.7 },
  { iso3: 'MDV', value: 43.1 },
  { iso3: 'MRT', value: 43.0 },
  { iso3: 'MOZ', value: 35.5 },
  { iso3: 'MWI', value: 34.4 },
  { iso3: 'SEN', value: 14.6 },
  { iso3: 'CPV', value: 12.7 },
  { iso3: 'TGO', value: 9.0 },
  { iso3: 'BEN', value: 6.5 }
];

function BarRow({ iso3, value, index, inView }) {
  const { name, iso2 } = COUNTRIES[iso3];
  const type = LDC.has(iso3) ? 'ldc' : 'sids';
  const barDelay = `${index * 60}ms`;
  const valDelay = `calc(${index * 60}ms + 0.85s)`;
  return (
    <div className="bar_row">
      <div className="country">
        <span className="country_name">{name}</span>
        <CircleFlag countryCode={iso2} height={26} />
      </div>
      <div className="bar_track">
        <div className={`bar_with_value bar_${type}`} style={{ width: inView ? `${value}%` : '0%', transition: `width 0.85s cubic-bezier(0.25, 0, 0, 1) ${barDelay}` }}>
          <div className={`bar bar_${type}`} />
          <span className={`bar_value val_${type}`} style={{ opacity: inView ? 1 : 0, transition: inView ? `opacity 0.3s ease ${valDelay}` : 'none' }}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Slide06({ url }) {
  const [ref, isVisible] = useIsVisible(0.9);

  return (
    <div className="slide_container slide06">
      <div className="slide_content" ref={ref}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="#fff" iconHoverBg="#009edb" iconColor="#000" iconHoverColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3>
              <div>
                Some of these economies rely heavily on imports from the <span className="accent">Hormuz region</span>.
              </div>
            </h3>
          </div>
          <h4>Share of oil imports sourced from the Hormuz region in 2024, per cent.</h4>
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
        <div className="chart_columns">
          <div className="chart_col">
            {DATA.map((d, i) => (
              <BarRow key={d.iso3} {...d} index={i} inView={isVisible} />
            ))}
          </div>
        </div>
        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade.
          </div>
          <div className="note">
            <span className="label">Note:</span> Countries sourcing more than 5% of their oil imports from the Hormuz region. Oil products refer to HS 2709 and 2710. Hormuz region considered as Bahrain, Iran, Iraq, Kuwait, Qatar, Saudi Arabia, and United Arab Emirates. Net importers excluding Singapore.
          </div>
        </div>
      </div>
    </div>
  );
}
