import useIsVisible from './../../helpers/UseIsVisible';
import AnimatedText from './components/AnimatedText';

import './Slide01.css';

const Slide = () => {
  const [ref, isVisible] = useIsVisible(0.9);

  return (
    <div className="slide_container slide01">
      <div className="slide_content" ref={ref}>
        <h3>
          <AnimatedText isVisible={isVisible}>
            Disruptions in the Strait of Hormuz are sending shockwaves through the <span className="accent">global energy system</span>.
          </AnimatedText>
        </h3>
      </div>
    </div>
  );
};

export default Slide;
