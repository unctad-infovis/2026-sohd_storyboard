import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as topojson from 'topojson-client';
import { COUNTRIES } from '../../data/countries';
import { getGroup } from '../../data/countryGroups';
import loadFile from '../../helpers/LoadFile';
import useIsVisible from '../../helpers/UseIsVisible';
import ButtonShare from './../general/ButtonShare';

import './components/Tooltip.css';
import './Slide09.css';

// Stagger order: ldc → dual → sids, value desc within each group
const STAGGER_MS = 60;
const GROUP_ORDER = { ldc: 0, dual: 1, sids: 2 };

// Only slide-specific values — name, group, and ll are looked up from COUNTRIES / getGroup.
const DATA = [
  // LDC (20)
  { iso3: 'MRT', value: 7.3 },
  { iso3: 'GMB', value: 6.3 },
  { iso3: 'BFA', value: 4.9 },
  { iso3: 'LBR', value: 4.8 },
  { iso3: 'ZMB', value: 4.3 },
  { iso3: 'LSO', value: 4.2 },
  { iso3: 'MLI', value: 3.8 },
  { iso3: 'CAF', value: 3.7 },
  { iso3: 'MMR', value: 3.4 },
  { iso3: 'KHM', value: 2.8 },
  { iso3: 'MOZ', value: 2.8 },
  { iso3: 'MWI', value: 2.2 },
  { iso3: 'UGA', value: 1.7 },
  { iso3: 'TZA', value: 1.7 },
  { iso3: 'SEN', value: 1.5 },
  { iso3: 'LAO', value: 0.9 },
  { iso3: 'DJI', value: 0.8 },
  { iso3: 'BEN', value: 0.8 },
  { iso3: 'BGD', value: 0.8 },
  { iso3: 'NPL', value: 0.5 },
  // Dual — both LDC and SIDS (2)
  { iso3: 'SLB', value: 1.1 },
  { iso3: 'TUV', value: 1.0 },
  // SIDS (21)
  { iso3: 'VUT', value: 5.8 },
  { iso3: 'MDV', value: 5.2 },
  { iso3: 'TON', value: 4.4 },
  { iso3: 'MUS', value: 4.2 },
  { iso3: 'FJI', value: 3.2 },
  { iso3: 'WSM', value: 3.0 },
  { iso3: 'JAM', value: 2.8 },
  { iso3: 'LCA', value: 2.6 },
  { iso3: 'BLZ', value: 2.5 },
  { iso3: 'MHL', value: 2.4 },
  { iso3: 'CPV', value: 2.2 },
  { iso3: 'SYC', value: 2.0 },
  { iso3: 'BRB', value: 1.8 },
  { iso3: 'KNA', value: 1.5 },
  { iso3: 'DOM', value: 1.5 },
  { iso3: 'VCT', value: 1.3 },
  { iso3: 'FSM', value: 1.2 },
  { iso3: 'ATG', value: 1.1 },
  { iso3: 'PLW', value: 0.9 },
  { iso3: 'NIU', value: 0.8 },
  { iso3: 'NRU', value: 0.6 }
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

    // Bubbles — project ll from the countries registry
    const bubbles = DATA.map(item => {
      const country = COUNTRIES[item.iso3];
      const xy = projection(country.ll);
      if (!xy) return null;
      return { iso: item.iso3, name: country.name, group: getGroup(item.iso3), value: item.value, x: xy[0], y: xy[1] };
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
    tt.querySelector('.map_tooltip_value').textContent = `${bubble.value.toFixed(1)}% of GDP`;
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
          <ButtonShare url={url} defaultOpen position="static" iconBg="#fff" iconHoverBg="#009edb" iconColor="#000" iconHoverColor="#fff" size={30} showLabel={false} />
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
            <div className="map_tooltip_line">
              <span className="map_tooltip_tag" />
              <span className="map_tooltip_name" />
            </div>
            <div className="map_tooltip_line">
              <span className="map_tooltip_value" />
            </div>
          </div>
        </div>
        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on UN Comtrade. Figures for LDCs and SIDS that are net importers of crude or refined oil products, excluding Singapore.
          </div>
          <div className="note">
            <span className="label">Note:</span>{' '}
            <a href="https://unctad.org/map-disclaimer" target="_blank" rel="noopener">
              Map disclaimer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
