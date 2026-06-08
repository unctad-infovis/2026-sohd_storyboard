import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as topojson from 'topojson-client';
import loadFile from '../../helpers/LoadFile';
import useIsVisible from '../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';

import './components/Tooltip.css';
import './Slide09.css';

// Stagger order: ldc → dual → sids, value desc within each group
const STAGGER_MS = 60;
const GROUP_ORDER = { ldc: 0, dual: 1, sids: 2 };

// Change in net oil import bill from a 50% price increase, % of GDP
const DATA = [
  // LDC (20) — stagger first
  { iso: 'MRT', name: 'Mauritania', group: 'ldc', value: 7.3, ll: [-10.9, 21.0] },
  { iso: 'GMB', name: 'Gambia', group: 'ldc', value: 6.3, ll: [-15.4, 13.4] },
  { iso: 'BFA', name: 'Burkina Faso', group: 'ldc', value: 4.9, ll: [-1.6, 12.2] },
  { iso: 'LBR', name: 'Liberia', group: 'ldc', value: 4.8, ll: [-9.4, 6.4] },
  { iso: 'ZMB', name: 'Zambia', group: 'ldc', value: 4.3, ll: [27.8, -13.1] },
  { iso: 'LSO', name: 'Lesotho', group: 'ldc', value: 4.2, ll: [28.2, -29.6] },
  { iso: 'MLI', name: 'Mali', group: 'ldc', value: 3.8, ll: [-3.9, 17.6] },
  { iso: 'CAF', name: 'Central African Republic', group: 'ldc', value: 3.7, ll: [20.9, 6.6] },
  { iso: 'MMR', name: 'Myanmar', group: 'ldc', value: 3.4, ll: [95.9, 21.9] },
  { iso: 'KHM', name: 'Cambodia', group: 'ldc', value: 2.8, ll: [104.9, 12.5] },
  { iso: 'MOZ', name: 'Mozambique', group: 'ldc', value: 2.8, ll: [35.5, -18.6] },
  { iso: 'MWI', name: 'Malawi', group: 'ldc', value: 2.2, ll: [34.3, -13.3] },
  { iso: 'UGA', name: 'Uganda', group: 'ldc', value: 1.7, ll: [32.3, 1.4] },
  { iso: 'TZA', name: 'United Republic of Tanzania', group: 'ldc', value: 1.7, ll: [34.9, -6.4] },
  { iso: 'SEN', name: 'Senegal', group: 'ldc', value: 1.5, ll: [-14.5, 14.5] },
  { iso: 'LAO', name: "Lao People's Democratic Republic", group: 'ldc', value: 0.9, ll: [102.5, 18.0] },
  { iso: 'DJI', name: 'Djibouti', group: 'ldc', value: 0.8, ll: [42.5, 11.7] },
  { iso: 'BEN', name: 'Benin', group: 'ldc', value: 0.8, ll: [2.3, 9.3] },
  { iso: 'BGD', name: 'Bangladesh', group: 'ldc', value: 0.8, ll: [90.4, 23.7] },
  { iso: 'NPL', name: 'Nepal', group: 'ldc', value: 0.5, ll: [84.1, 28.4] },
  // Dual — both LDC and SIDS (2) — stagger second
  { iso: 'SLB', name: 'Solomon Islands', group: 'dual', value: 1.1, ll: [160.0, -9.7] },
  { iso: 'TUV', name: 'Tuvalu', group: 'dual', value: 1.0, ll: [179.2, -8.5] },
  // SIDS (21) — stagger third
  { iso: 'VUT', name: 'Vanuatu', group: 'sids', value: 5.8, ll: [167.8, -16.0] },
  { iso: 'MDV', name: 'Maldives', group: 'sids', value: 5.2, ll: [73.2, 3.2] },
  { iso: 'TON', name: 'Tonga', group: 'sids', value: 4.4, ll: [-175.2, -21.2] },
  { iso: 'MUS', name: 'Mauritius', group: 'sids', value: 4.2, ll: [57.6, -20.3] },
  { iso: 'FJI', name: 'Fiji', group: 'sids', value: 3.2, ll: [178.0, -17.7] },
  { iso: 'WSM', name: 'Samoa', group: 'sids', value: 3.0, ll: [-171.8, -13.8] },
  { iso: 'JAM', name: 'Jamaica', group: 'sids', value: 2.8, ll: [-77.3, 18.1] },
  { iso: 'LCA', name: 'Saint Lucia', group: 'sids', value: 2.6, ll: [-60.9, 13.9] },
  { iso: 'BLZ', name: 'Belize', group: 'sids', value: 2.5, ll: [-88.5, 17.2] },
  { iso: 'MHL', name: 'Marshall Islands', group: 'sids', value: 2.4, ll: [171.4, 7.1] },
  { iso: 'CPV', name: 'Cabo Verde', group: 'sids', value: 2.2, ll: [-23.6, 16.5] },
  { iso: 'SYC', name: 'Seychelles', group: 'sids', value: 2.0, ll: [55.5, -4.7] },
  { iso: 'BRB', name: 'Barbados', group: 'sids', value: 1.8, ll: [-59.5, 13.2] },
  { iso: 'KNA', name: 'Saint Kitts and Nevis', group: 'sids', value: 1.5, ll: [-62.7, 17.3] },
  { iso: 'DOM', name: 'Dominican Republic', group: 'sids', value: 1.5, ll: [-70.7, 19.0] },
  { iso: 'VCT', name: 'Saint Vincent and the Grenadines', group: 'sids', value: 1.3, ll: [-61.2, 13.2] },
  { iso: 'FSM', name: 'Micronesia (Federated States of)', group: 'sids', value: 1.2, ll: [158.2, 6.9] },
  { iso: 'ATG', name: 'Antigua and Barbuda', group: 'sids', value: 1.1, ll: [-61.8, 17.1] },
  { iso: 'PLW', name: 'Palau', group: 'sids', value: 0.9, ll: [134.6, 7.5] },
  { iso: 'NIU', name: 'Niue', group: 'sids', value: 0.8, ll: [-169.9, -19.1] },
  { iso: 'NRU', name: 'Nauru', group: 'sids', value: 0.6, ll: [166.9, -0.5] }
];

const W = 960;
const H = 480;
const MAX_R = 24;
const MAX_VAL = DATA.reduce((m, d) => Math.max(m, d.value), 0);

function bubbleR(v) {
  return MAX_R * Math.sqrt(v / MAX_VAL);
}

export default function Slide09({ url }) {
  const [geoData, setGeoData] = useState(null);
  const [ref, isVisible] = useIsVisible(0.4);
  const [animating, setAnimating] = useState(false);
  const animStarted = useRef(false);
  const containerRef = useRef(null);
  const ttRef = useRef(null);

  useEffect(() => {
    Promise.all([loadFile('assets/data/world_topojson.json').then(r => r?.json()), loadFile('assets/data/world_boundaries.json').then(r => r?.json()), loadFile('assets/data/world_waters.json').then(r => r?.json())]).then(([topo, bounds, waters]) => {
      if (topo && bounds && waters) setGeoData({ topo, bounds, waters });
    });
  }, []);

  const computed = useMemo(() => {
    if (!geoData) return null;
    const { topo, bounds, waters } = geoData;

    const projection = d3.geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' });
    const pathGen = d3.geoPath(projection);
    const allFeats = topojson.feature(topo, topo.objects.BNDA).features;

    // Country fills
    const countryPaths = allFeats
      .filter(f => f.properties?.stscod !== 0)
      .map(f => {
        const d = pathGen(f);
        return d ? { id: f.id, d } : null;
      })
      .filter(Boolean);

    // Inland water bodies
    const waterFeature = topojson.feature(waters, waters.objects.WBYA);
    const waterPath = pathGen(waterFeature) || null;

    // Borders — same logic as Globe.jsx
    const bndl = topojson.feature(bounds, bounds.objects.BNDL);
    const bndlFeats = bndl.features.filter(f => f.properties && f.properties.iso3cd !== 'ATA');
    const solidFeats = bndlFeats.filter(f => f.geometry && (f.properties.bdytyp === 0 || f.properties.bdytyp === 1));
    const dashedFeats = bndlFeats.filter(f => f.geometry && f.properties.bdytyp !== 0 && f.properties.bdytyp !== 1);
    const solidBorderPath = solidFeats.length ? pathGen({ type: 'FeatureCollection', features: solidFeats }) : null;
    const dashedBorderPath = dashedFeats.length ? pathGen({ type: 'FeatureCollection', features: dashedFeats }) : null;

    // Bubbles — project from hardcoded ll
    const bubbles = DATA.map(item => {
      const xy = projection(item.ll);
      if (!xy) return null;
      return { ...item, x: xy[0], y: xy[1] };
    }).filter(Boolean);

    // Stagger: ldc → dual → sids, value desc within group
    const staggerSorted = [...bubbles].sort((a, b) => {
      const gDiff = GROUP_ORDER[a.group] - GROUP_ORDER[b.group];
      return gDiff !== 0 ? gDiff : b.value - a.value;
    });
    const staggerMap = new Map(staggerSorted.map((b, i) => [b.iso, i]));

    return { countryPaths, waterPath, solidBorderPath, dashedBorderPath, bubbles, staggerMap };
  }, [geoData]);

  // SVG DOM order: value desc so larger circles render behind smaller ones
  const sortedBubbles = useMemo(() => (computed ? [...computed.bubbles].sort((a, b) => b.value - a.value) : []), [computed]);

  // Fire only when slide is visible AND geo data is loaded.
  // Double-rAF: circles paint one frame at scale(0) before the transition starts,
  // fixing the race condition where isVisible is already true when data arrives.
  useEffect(() => {
    if (!isVisible || !computed || animStarted.current) return;
    animStarted.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
  }, [isVisible, computed]);

  function showTooltip(bubble, clientX, clientY) {
    const tt = ttRef.current;
    const container = containerRef.current;
    if (!tt || !container) return;
    const rect = container.getBoundingClientRect();
    tt.querySelector('.map_tooltip_name').textContent = bubble.name;
    tt.querySelector('.map_tooltip_value').textContent = `· ${bubble.value.toFixed(1)}% of GDP`;
    const tag = tt.querySelector('.map_tooltip_tag');
    tt.classList.remove('map_tooltip_ldc', 'map_tooltip_sids', 'map_tooltip_dual');
    tt.classList.add(`map_tooltip_${bubble.group}`);
    tag.textContent = bubble.group === 'dual' ? 'LDC + SIDS' : bubble.group.toUpperCase();
    const x = clientX - rect.left;
    const halfW = tt.offsetWidth / 2;
    const pad = 8;
    const clampedX = Math.max(halfW + pad, Math.min(rect.width - halfW - pad, x));
    tt.style.left = `${clampedX}px`;
    tt.style.top = `${clientY - rect.top}px`;
    tt.style.setProperty('--arrow-offset', `${x - clampedX + halfW}px`);
    tt.classList.add('map_tooltip_visible');
  }

  function hideTooltip() {
    ttRef.current?.classList.remove('map_tooltip_visible');
  }

  return (
    <div className="slide_container slide09">
      <div className="slide_content" ref={ref}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="rgba(0,0,0,0.45)" iconColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3>
              <div>
                This could cost some economies more than <span className="accent">5% of GDP</span>.
              </div>
            </h3>
          </div>
          <h4>Change in the net oil import bill from a 50% price increase, in per cent of GDP. Circle size is proportional to the impact.</h4>
        </div>
        <div className="legend">
          <span className="legend_item legend_item_ldc">
            <span className="legend_dot" />
            Least developed countries
          </span>
          <span className="legend_item legend_item_sids">
            <span className="legend_dot" />
            Small island developing States
          </span>
          <span className="legend_item legend_item_dual">
            <span className="legend_dot" />
            Both
          </span>
        </div>

        <div className="map_container" ref={containerRef}>
          <svg viewBox={`0 0 ${W} ${H}`} className="bubble_map" aria-label="Bubble map showing oil price impact as share of GDP for LDC and SIDS countries">
            <defs>
              {/* Diagonal stripe pattern — matches Globe.jsx canvas pattern exactly */}
              <pattern id="stripe_dual_09" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="var(--un-color-blue)" />
                <line x1="0" y1="18" x2="18" y2="0" stroke="var(--un-color-yellow)" strokeWidth="9" strokeLinecap="square" />
                <line x1="-9" y1="9" x2="9" y2="-9" stroke="var(--un-color-yellow)" strokeWidth="9" strokeLinecap="square" />
                <line x1="9" y1="27" x2="27" y2="9" stroke="var(--un-color-yellow)" strokeWidth="9" strokeLinecap="square" />
              </pattern>
            </defs>

            {/* 1. Country fills */}
            <g className="countries">
              {computed?.countryPaths?.map(({ _id, d }) => {
                return <path key={d} d={d} className="country_path" />;
              })}
            </g>

            {/* 2. Inland water bodies */}
            {computed?.waterPath && <path d={computed.waterPath} className="water_path" />}

            {/* 3. Borders — solid (international) */}
            {computed?.solidBorderPath && <path d={computed.solidBorderPath} className="border_solid" />}

            {/* 4. Borders — dashed (disputed / admin) */}
            {computed?.dashedBorderPath && <path d={computed.dashedBorderPath} className="border_dashed" />}

            {/* 5. Bubbles */}
            <g className="bubbles_layer">
              {sortedBubbles.map(b => {
                const r = bubbleR(b.value);
                const delay = (computed?.staggerMap.get(b.iso) ?? 0) * STAGGER_MS;
                return (
                  <g key={b.iso} transform={`translate(${b.x},${b.y})`}>
                    <circle
                      className={`bubble bubble_${b.group}`}
                      onPointerEnter={e => showTooltip(b, e.clientX, e.clientY)}
                      onPointerLeave={hideTooltip}
                      onPointerMove={e => showTooltip(b, e.clientX, e.clientY)}
                      r={r}
                      style={{ opacity: animating ? 1 : 0, transform: animating ? 'scale(1)' : 'scale(0)', transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, opacity 0.4s ease ${delay}ms` }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="map_tooltip" ref={ttRef} aria-hidden="true">
            <span className="map_tooltip_tag" />
            <span className="map_tooltip_name" />
            <span className="map_tooltip_value" />
          </div>
        </div>

        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade. Figures for LDCs and SIDS that are net importers of crude or refined oil products, excluding Singapore.
          </div>
          <div>
            Note:{' '}
            <a href="https://unctad.org/map-disclaimer" target="_blank" rel="noopener">
              Map disclaimer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
