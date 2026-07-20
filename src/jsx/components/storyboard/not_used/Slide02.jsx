import ButtonShare from '@unctad-infovis/general-tools/components/ButtonShare.jsx';
import loadFile from '@unctad-infovis/general-tools/helpers/LoadFile.js';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';
import { useEffect, useMemo, useState } from 'react';
import CSVtoJSON from './../../helpers/CsvToJson';
import LineChart from './components/LineChart';

import './Slide02.css';

// ── Config ───────────────────────────────────────────────────────────────────
const dateCol = 'date';

const series = {
  chart1: {
    annotation: 'more than 40%',
    col: 'crude',
    domain: [0, 160],
    margin: { top: 24, right: 32, bottom: 50, left: 45 },
    title_description: 'dollars per barrel',
    title_icon: 'Slide02IconCrudeOil.svg',
    title_text: 'Crude oil'
  },
  chart2: {
    annotation: 'more than 50%',
    col: 'gasoline',
    domain: [0, 1600],
    margin: { top: 24, right: 32, bottom: 50, left: 60 },
    title_description: 'dollars per metric tonne',
    title_icon: 'Slide02IconGasoline.svg',
    title_text: 'Gasoline'
  }
};

const annotationDate = new Date('2026-02-28'); // ← your event date
const annotationLabel = 'Military escalation'; // ← your event label

const chart1TicksY = [0, 40, 80, 120, 160]; // e.g. [60, 80, 100, 120] or null for auto
const chart2TicksY = [0, 400, 800, 1200, 1600];

const animationDuration = 2200; // ms — both charts draw simultaneously

// ── Data prep ────────────────────────────────────────────────────────────────

const prepseries = (rows, col) =>
  rows
    .map(row => ({
      date: new Date(row[dateCol]?.trim()),
      value: +row[col]
    }))
    .filter(d => d.date !== null && !Number.isNaN(d.value));

// ── Component ────────────────────────────────────────────────────────────────

const Slide02 = ({ url }) => {
  const [ref, isVisible] = useIsVisible(0.9);
  const [rawCsv, setRawCsv] = useState(null);

  useEffect(() => {
    loadFile('assets/data/2026-sohd_storyboard_slide02.csv')
      .then(r => r?.text())
      .then(text => {
        if (text) setRawCsv(text);
      });
  }, []);

  const { chart1, chart2 } = useMemo(() => {
    if (!rawCsv) return { chart1: [], chart2: [] };
    const rows = CSVtoJSON(rawCsv);
    return {
      chart1: prepseries(rows, series.chart1.col),
      chart2: prepseries(rows, series.chart2.col)
    };
  }, [rawCsv]);

  return (
    <div className="slide_container slide02">
      <div className="slide_content" ref={ref}>
        <div className="title_container with_arrow">
          <ButtonShare url={url} defaultOpen position="static" iconBg="#fff" iconHoverBg="#009edb" iconColor="#000" iconHoverColor="#fff" size={30} showLabel={false} />
          <div className="with_arrow">
            <h3>
              <div>
                Prices of oil and refined oil products have <span className="accent">skyrocketed</span>.
              </div>
            </h3>
          </div>
        </div>
        <div className="charts_container">
          {[
            { data: chart1, cfg: series.chart1, ticks: chart1TicksY },
            { data: chart2, cfg: series.chart2, ticks: chart2TicksY }
          ].map(({ data, cfg, ticks }, i) => (
            <div key={cfg.col} className={`chart_container chart_container_${i + 1}`}>
              <div className={`graph_title_container graph_title_container_${i + 1}`}>
                <div className="graph_title_content">
                  <h4>{cfg.title_text}</h4>
                  <h5>{cfg.title_description}</h5>
                </div>
              </div>
              <div className={`annotation_container annotation_container_${i + 1}`}>
                <div className="label">Increase by</div>
                <div className="value">{cfg.annotation}</div>
              </div>
              <div className="chart_content">
                <LineChart animDuration={animationDuration} annotationDate={annotationDate} annotationLabel={annotationLabel} data={data} isVisible={isVisible} domain={cfg.domain} margin={cfg.margin} xTicks={[new Date('2024-01-01'), new Date('2025-01-01'), new Date('2026-01-01')]} yLabel={false} yTicks={ticks} />
              </div>
            </div>
          ))}
        </div>
        <div className="chart_meta">
          <div className="source">
            <span className="label">Source:</span> UN Trade and Development (UNCTAD), based on LSEG Data & Analytics.
          </div>
          <div className="note">
            <span className="label">Note:</span> Price increases compare average prices for the period <span className="nowrap">1 January 2024</span> – <span className="nowrap">27 February 2026</span> with prices during the period following the military escalation, <span className="nowrap">28 February 2026</span> –{' '}
            <span className="nowrap">28 May 2026</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide02;
