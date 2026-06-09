import { CircleFlag } from 'react-circle-flags';
import useIsVisible from './../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';

import './Slide06.css';

const DATA = [
  { name: 'Seychelles', iso2: 'sc', value: 99.0, type: 'sids' },
  { name: 'Uganda', iso2: 'ug', value: 61.0, type: 'ldc' },
  { name: 'Mauritius', iso2: 'mu', value: 58.3, type: 'sids' },
  { name: 'United Republic of Tanzania', iso2: 'tz', value: 56.0, type: 'ldc' },
  { name: 'Zambia', iso2: 'zm', value: 44.7, type: 'ldc' },
  { name: 'Maldives', iso2: 'mv', value: 43.1, type: 'sids' },
  { name: 'Mauritania', iso2: 'mr', value: 43.0, type: 'ldc' },
  { name: 'Mozambique', iso2: 'mz', value: 35.5, type: 'ldc' },
  { name: 'Malawi', iso2: 'mw', value: 34.4, type: 'ldc' },
  { name: 'Senegal', iso2: 'sn', value: 14.6, type: 'ldc' },
  { name: 'Cabo Verde', iso2: 'cv', value: 12.7, type: 'sids' },
  { name: 'Togo', iso2: 'tg', value: 9.0, type: 'ldc' },
  { name: 'Benin', iso2: 'bj', value: 6.5, type: 'ldc' }
];

function BarRow({ name, iso2, value, type, index, inView }) {
  const barDelay = `${index * 60}ms`;
  const valDelay = `calc(${index * 60}ms + 0.85s)`;
  return (
    <div className="bar_row">
      <div className="country">
        <span className="country_name">{name}</span>
        <CircleFlag countryCode={iso2} height={26} />
      </div>
      <div className="bar_track">
        <div className={`bar bar_${type}`} style={{ width: inView ? `${value}%` : '0%', transition: `width 0.85s cubic-bezier(0.25, 0, 0, 1) ${barDelay}` }} />
      </div>
      <span className={`bar_value val_${type}`} style={{ opacity: inView ? 1 : 0, transition: inView ? `opacity 0.3s ease ${valDelay}` : 'none' }}>
        {value.toFixed(1)}%
      </span>
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
              <BarRow key={d.name} {...d} index={i} inView={isVisible} />
            ))}
          </div>
        </div>
        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade.
          </div>
          <div className="note">
            <span className="label">Note:</span> Seven least developed countries are also small island developing States; they are shown in the LDC aggregate. Hormuz region considered as Bahrain, Iran, Iraq, Kuwait, Qatar, Saudi Arabia and the United Arab Emirates. Net importers, excluding Singapore.
          </div>
        </div>
      </div>
    </div>
  );
}
