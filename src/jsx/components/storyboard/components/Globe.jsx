import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import * as topojson from 'topojson-client';
import { DOT_NAMES, LDC, SIDS, SMALL_DOTS } from '../../../data/countryGroups';

import './Globe.css';
import './Tooltip.css';

const AUTO_RESUME_MS = 1800;
const W = 600,
  H = 600;
const DOT_R = 3.6;
// Degenerate D3 clip paths span nearly the full globe diameter (~560 px).
// Valid features never exceed this threshold in either dimension.
const ARTIFACT_MAX_DIM = 500;

export default function Globe({ worldTopojson, worldBoundaries, worldWaters, isVisible = false }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const ttRef = useRef(null);

  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;
  const startAnim = useRef(null);
  const stopAnim = useRef(null);

  useEffect(() => {
    if (isVisible) startAnim.current?.();
    else stopAnim.current?.();
  }, [isVisible]);

  useEffect(() => {
    if (!worldTopojson || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const stage = stageRef.current;

    // HiDPI: scale canvas resolution while keeping logical W×H for all math
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ---- Projection ----
    const projection = d3
      .geoOrthographic()
      .scale(280)
      .translate([W / 2, H / 2])
      .clipAngle(89)
      .rotate([-20, -5, 0]);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    // ---- Colors ----
    const cs = getComputedStyle(document.documentElement);
    const blue = cs.getPropertyValue('--un-color-blue').trim();
    const blue_light = cs.getPropertyValue('--un-color-blue-light').trim();
    const blue_lightest = cs.getPropertyValue('--un-color-blue-lightest').trim();
    const yellow = cs.getPropertyValue('--un-color-yellow').trim();

    const OCEAN_ALPHA = 0.5; // ocean gradient opacity (0–1)
    const WATER_ALPHA = 0.5; // inland water bodies opacity (0–1)

    // Ocean radial gradient (matches SVG cx=34% cy=30% r=78% on 600×600)
    const oceanGrad = ctx.createRadialGradient(250, 250, 0, 300, 300, 280);
    oceanGrad.addColorStop(0, blue_lightest);
    oceanGrad.addColorStop(0.85, blue_lightest);
    oceanGrad.addColorStop(1, blue_light);

    // Diagonal stripe pattern for LDC+SIDS dual countries
    const stripeCanvas = document.createElement('canvas');
    stripeCanvas.width = 9;
    stripeCanvas.height = 9;
    const sc = stripeCanvas.getContext('2d');
    sc.fillStyle = blue;
    sc.fillRect(0, 0, 9, 9);
    sc.strokeStyle = yellow;
    sc.lineWidth = 4.5;
    sc.lineCap = 'square';
    sc.beginPath();
    sc.moveTo(0, 9);
    sc.lineTo(9, 0);
    sc.moveTo(-4.5, 4.5);
    sc.lineTo(4.5, -4.5);
    sc.moveTo(4.5, 13.5);
    sc.lineTo(13.5, 4.5);
    sc.stroke();
    const stripes = ctx.createPattern(stripeCanvas, 'repeat');

    // ---- Data prep ----
    const allFeats = topojson.feature(worldTopojson, worldTopojson.objects.BNDA).features;

    // 4 categories with pre-computed centroids. Centroid check skips
    // back-hemisphere features cheaply; bounds check (in render) catches
    // any degenerate D3 clip paths that slip through.
    const cats = [
      { feats: [], cents: [], fill: '#b7bdc8' }, // default
      { feats: [], cents: [], fill: blue }, // ldc
      { feats: [], cents: [], fill: yellow }, // sids
      { feats: [], cents: [], fill: stripes } // dual
    ];
    allFeats.forEach(f => {
      if (f.properties.stscod === 0) return;
      const iso = f.id;
      const idx = LDC.has(iso) && SIDS.has(iso) ? 3 : LDC.has(iso) ? 1 : SIDS.has(iso) ? 2 : 0;
      cats[idx].feats.push(f);
      cats[idx].cents.push(d3.geoCentroid(f));
    });

    const classifiedFeats = [...cats[1].feats, ...cats[2].feats, ...cats[3].feats];

    // ---- Geo data ----
    let waters = null;
    if (worldWaters) waters = topojson.feature(worldWaters, worldWaters.objects.WBYA);

    let bndlSolid = null,
      bndlDashed = null;
    if (worldBoundaries) {
      const bndl = topojson.feature(worldBoundaries, worldBoundaries.objects.BNDL);
      const features = bndl.features.filter(f => f.properties && f.properties.iso3cd !== 'ATA');
      bndlSolid = { type: 'FeatureCollection', features: features.filter(f => f.geometry && (f.properties.bdytyp === 0 || f.properties.bdytyp === 1)) };
      bndlDashed = { type: 'FeatureCollection', features: features.filter(f => f.geometry && f.properties.bdytyp !== 0 && f.properties.bdytyp !== 1) };
    }

    // ---- Render helpers ----
    function isPointVisible(ll) {
      const r = projection.rotate();
      const lambda = (-r[0] * Math.PI) / 180;
      const phi = (-r[1] * Math.PI) / 180;
      const lon = (ll[0] * Math.PI) / 180;
      const lat = (ll[1] * Math.PI) / 180;
      const cosDist = Math.sin(phi) * Math.sin(lat) + Math.cos(phi) * Math.cos(lat) * Math.cos(lon - lambda);
      return cosDist > 0;
    }

    function isBoundsOk(feature) {
      const [[x0, y0], [x1, y1]] = path.bounds(feature);
      return x1 - x0 < ARTIFACT_MAX_DIM && y1 - y0 < ARTIFACT_MAX_DIM;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      // 1. Ocean sphere with drop shadow
      ctx.save();
      ctx.globalAlpha = OCEAN_ALPHA;
      ctx.shadowColor = 'rgba(10, 30, 10, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 14;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 280, 0, 2 * Math.PI);
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.restore();

      // Clip all layers to the sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 280, 0, 2 * Math.PI);
      ctx.clip();

      // 2. Graticule
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 3. Countries — bounds check rejects degenerate D3 clip paths
      for (const cat of cats) {
        const safeFeats = cat.feats.filter(f => isBoundsOk(f));
        if (!safeFeats.length) continue;
        ctx.beginPath();
        path({ type: 'FeatureCollection', features: safeFeats });
        ctx.fillStyle = cat.fill;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // 4. Inland waters — bounds check
      if (waters && isBoundsOk(waters)) {
        ctx.save();
        ctx.globalAlpha = WATER_ALPHA;
        ctx.beginPath();
        path(waters);
        ctx.fillStyle = blue_lightest;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 0.3;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Borders — solid: bounds check rejects degenerate D3 clip paths
      if (bndlSolid) {
        const safeFeats = bndlSolid.features.filter(f => isBoundsOk(f));
        if (safeFeats.length) {
          ctx.beginPath();
          path({ type: 'FeatureCollection', features: safeFeats });
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 0.7;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }

      // 6. Borders — dashed: bounds check rejects degenerate D3 clip paths
      if (bndlDashed) {
        const safeFeats = bndlDashed.features.filter(f => isBoundsOk(f));
        if (safeFeats.length) {
          ctx.setLineDash([1.6, 1.6]);
          ctx.beginPath();
          path({ type: 'FeatureCollection', features: safeFeats });
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 0.7;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 7. Small-island dots — canvas arcs, not D3 paths, so no clip artifact risk
      for (let i = 0; i < SMALL_DOTS.length; i++) {
        const d = SMALL_DOTS[i];
        if (!isPointVisible(d.ll)) continue;
        const xy = projection(d.ll);
        if (!xy) continue;
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], DOT_R, 0, 2 * Math.PI);
        ctx.fillStyle = d.cls === 'dual' ? stripes : d.cls === 'sids' ? yellow : blue;
        ctx.fill();
        ctx.strokeStyle = d.cls === 'dual' ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.12)';
        ctx.lineWidth = d.cls === 'dual' ? 0.6 : 0.5;
        ctx.stroke();
      }

      ctx.restore(); // end sphere clip
    }

    render();

    // ---- Auto-rotation ----
    let rot = projection.rotate();
    let running = false;
    let dragging = false;
    let hovering = false; // paused while over LDC/SIDS country or dot
    let resumeAt = 0;
    let rafId = null;

    function frame(now) {
      if (!running) return;
      if (!dragging && !hovering && now >= resumeAt) {
        rot[0] = (rot[0] + 0.17) % 360;
        projection.rotate(rot);
        render();
      }
      rafId = requestAnimationFrame(frame);
    }

    // ---- Drag ----
    function pxToDeg(px) {
      const rect = canvas.getBoundingClientRect();
      return (px / rect.width) * (W / 280) * 90;
    }

    let pointerId = null;
    let dragStartX = 0;
    let dragStartRot = [0, 0, 0];

    function onPointerDown(e) {
      hovering = false;
      pointerId = e.pointerId;
      dragging = true;
      stage.classList.add('globe_stage_dragging');
      stage.setPointerCapture(pointerId);
      dragStartX = e.clientX;
      dragStartRot = projection.rotate().slice();
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      rot = [dragStartRot[0] + pxToDeg(e.clientX - dragStartX), dragStartRot[1], dragStartRot[2]];
      projection.rotate(rot);
      render();
    }

    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      dragging = false;
      pointerId = null;
      stage.classList.remove('globe_stage_dragging');
      resumeAt = performance.now() + AUTO_RESUME_MS;
      render();
    }

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // ---- Tooltip ----
    const tooltip = ttRef.current;

    function classifyIso(iso) {
      if (LDC.has(iso) && SIDS.has(iso)) return 'ldc+sids';
      if (LDC.has(iso)) return 'ldc';
      if (SIDS.has(iso)) return 'sids';
      return null;
    }

    function showTooltip(name, classification, clientX, clientY) {
      const ttName = tooltip.querySelector('.map_tooltip_name');
      const ttTag = tooltip.querySelector('.map_tooltip_tag');
      ttName.textContent = name;
      tooltip.classList.remove('map_tooltip_ldc', 'map_tooltip_sids', 'map_tooltip_dual');
      if (classification === 'ldc') {
        tooltip.classList.add('map_tooltip_ldc');
        ttTag.textContent = 'LDC';
      } else if (classification === 'sids') {
        tooltip.classList.add('map_tooltip_sids');
        ttTag.textContent = 'SIDS';
      } else if (classification === 'ldc+sids') {
        tooltip.classList.add('map_tooltip_dual');
        ttTag.textContent = 'LDC + SIDS';
      } else {
        ttTag.textContent = '';
      }
      const stageRect = stage.getBoundingClientRect();
      const x = clientX - stageRect.left;
      const halfW = tooltip.offsetWidth / 2;
      const pad = 8;
      const clampedX = Math.max(halfW + pad, Math.min(stageRect.width - halfW - pad, x));
      tooltip.style.left = `${clampedX}px`;
      tooltip.style.top = `${clientY - stageRect.top}px`;
      tooltip.style.setProperty('--arrow-offset', `${x - clampedX + halfW}px`);
      tooltip.classList.add('map_tooltip_visible');
    }
    function hideTooltip() {
      tooltip.classList.remove('map_tooltip_visible');
    }

    function startHover() {
      hovering = true;
    }

    function endHover() {
      if (!hovering) return;
      hovering = false;
      resumeAt = performance.now() + AUTO_RESUME_MS;
    }

    function onPointerMoveTooltip(e) {
      if (dragging) {
        hideTooltip();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (W / rect.width);
      const y = (e.clientY - rect.top) * (H / rect.height);

      // Dots: hit test against projected positions
      for (let i = 0; i < SMALL_DOTS.length; i++) {
        const d = SMALL_DOTS[i];
        if (!isPointVisible(d.ll)) continue;
        const xy = projection(d.ll);
        if (!xy) continue;
        const dx = x - xy[0],
          dy = y - xy[1];
        if (dx * dx + dy * dy <= (DOT_R * 2.5) ** 2) {
          startHover();
          showTooltip(DOT_NAMES[i], d.cls === 'dual' ? 'ldc+sids' : d.cls, e.clientX, e.clientY);
          return;
        }
      }

      // Countries: inverse projection + spherical point-in-polygon
      const dx = x - W / 2,
        dy = y - H / 2;
      if (dx * dx + dy * dy > 280 * 280) {
        endHover();
        hideTooltip();
        return;
      }
      const ll = projection.invert([x, y]);
      if (!ll) {
        endHover();
        hideTooltip();
        return;
      }
      const feature = classifiedFeats.find(f => d3.geoContains(f, ll));
      if (!feature) {
        endHover();
        hideTooltip();
        return;
      }
      startHover();
      showTooltip(feature.properties?.nam_en || feature.id, classifyIso(feature.id), e.clientX, e.clientY);
    }

    function onPointerLeave() {
      endHover();
      hideTooltip();
    }

    canvas.addEventListener('pointermove', onPointerMoveTooltip);
    canvas.addEventListener('pointerleave', onPointerLeave);

    // ---- Start / stop wired to visibility effect ----
    startAnim.current = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    };
    stopAnim.current = () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    if (isVisibleRef.current) {
      running = true;
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      startAnim.current = null;
      stopAnim.current = null;
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', endDrag);
      stage.removeEventListener('pointercancel', endDrag);
      canvas.removeEventListener('pointermove', onPointerMoveTooltip);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [worldTopojson, worldBoundaries, worldWaters]);

  return (
    <div className="globe_stage" ref={stageRef}>
      <canvas ref={canvasRef} className="globe_canvas" aria-label="Rotating world map highlighting Least Developed Countries and Small Island Developing States" />
      <div className="map_tooltip" ref={ttRef} aria-hidden="true">
        <div className="map_tooltip_line">
          <span className="map_tooltip_tag"></span>
          <span className="map_tooltip_name"></span>
        </div>
      </div>
    </div>
  );
}
