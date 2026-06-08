import useIsVisible from '../../helpers/UseIsVisible';

import './Slide10.css';

const CARDS = [
  {
    id: 'cost',
    text: 'Higher oil prices raise freight and fuel costs, increasing the overall cost of goods.',
    title: 'Increased cost'
  },
  {
    id: 'inflation',
    text: 'Many vulnerable economies rely heavily on fuel imports, where oil price increases quickly raise the cost of living. Broader inflationary pressures may also affect net oil-exporters.',
    title: 'Broader inflation'
  },
  {
    id: 'fiscal',
    text: 'Oil price shocks increase fiscal pressure in net-importing vulnerable economies, forcing trade-offs between shielding households from price spikes and sustaining essential services and long-term investment, including for sustainable development.',
    title: 'Fiscal pressure'
  },
  {
    id: 'slowdown',
    text: 'Increased oil import bills can widen current account deficits and weaken exchange rates, triggering higher interest rates, tighter credit conditions, and slower economic growth, especially in economies with limited fiscal space.',
    title: 'Economic slowdown'
  }
];

export default function Slide10() {
  const [slideRef, inView] = useIsVisible(0.5);

  return (
    <div className="slide_container slide10">
      <div className="slide_content" ref={slideRef}>
        <div className="title_container with_arrow">
          <div className="with_arrow">
            <h3>
              <div>
                The shock does not end there. It has <span className="accent">broader implications</span>.
              </div>
            </h3>
          </div>
        </div>
        <div className="implication_grid">
          {CARDS.map((card, i) => (
            <div key={card.id} className={`implication_card implication_card_${i + 1}`} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.5s ease ${i * 120}ms, transform 1s cubic-bezier(0.25, 0, 0, 1) ${i * 120}ms` }}>
              <h4 className="implication_title">{card.title}</h4>
              <p className="implication_text">{card.text}</p>
            </div>
          ))}
        </div>
        <h3>
          <div>
            Without relief, these shocks will further entrench <span className="accent">structural vulnerabilities</span> in these economies.
          </div>
        </h3>
      </div>
    </div>
  );
}
