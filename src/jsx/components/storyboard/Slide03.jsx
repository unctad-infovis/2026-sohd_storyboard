import { useEffect, useRef, useState } from 'react';
import ButtonShare from './../general/ButtonShare';
import Globe from './components/Globe';

import './Slide03.css';

export default function Slide03({ url }) {
  const [worldTopojson, setWorldTopojson] = useState(null);
  const [worldBoundaries, setWorldBoundaries] = useState(null);
  const [worldWaters, setWorldWaters] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    Promise.all([fetch('/assets/data/world_topojson.json').then(r => r.json()), fetch('/assets/data/world_boundaries.json').then(r => r.json()), fetch('/assets/data/world_waters.json').then(r => r.json())]).then(([topo, bounds, waters]) => {
      setWorldTopojson(topo);
      setWorldBoundaries(bounds);
      setWorldWaters(waters);
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="slide_container slide03">
      <div className="slide_content" ref={ref}>
        <div className="title_container">
          <div className="share_container">
            <ButtonShare url={url} defaultOpen position="static" iconBg="rgba(0,0,0,0.45)" iconColor="#fff" size={30} showLabel={false} />
          </div>
          <h3>
            <div>
              These shocks fall hardest on the <span className="accent accent_ldc">Least Developed Countries</span> and <span className="accent accent_sids">Small island developing States</span>.
            </div>
          </h3>
        </div>
        <div className="legend">
          <span className="legend_item legend_item_ldc">
            <span className="legend_dot"></span>Least developed countries
          </span>
          <span className="legend_item legend_item_sids">
            <span className="legend_dot"></span>Small island developing States
          </span>
          <span className="legend_item legend_item_dual">
            <span className="legend_dot"></span>Both
          </span>
        </div>

        {worldTopojson ? <Globe worldTopojson={worldTopojson} worldBoundaries={worldBoundaries} worldWaters={worldWaters} isVisible={isVisible} /> : <div className="globe_loading" />}

        <div className="chart_meta">
          <span className="label">Note:</span>{' '}
          <a href="https://unctad.org/map-disclaimer" target="_blank" rel="noopener">
            Map disclaimer
          </a>
        </div>
      </div>
    </div>
  );
}
