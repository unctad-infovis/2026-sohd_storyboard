import useIsVisible from './../../helpers/UseIsVisible';
import AnimatedText from './components/AnimatedText';

import './Slide07.css';

const Slide = () => {
  const [ref, isVisible] = useIsVisible(0.9);

  return (
    <div className="slide_container slide07">
      <div className="slide_content" ref={ref}>
        <h3>
          <AnimatedText isVisible={isVisible}>
            But the shock goes beyond geographic proximity. <span className="accent">It travels far through prices.</span>
          </AnimatedText>
        </h3>
      </div>
    </div>
  );
};

export default Slide;
