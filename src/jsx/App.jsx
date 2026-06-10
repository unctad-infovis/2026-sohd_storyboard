import { useEffect, useRef } from 'react';

import Article from '../Article.mdx';

// Storyboard
import SlideNav from './components/storyboard/components/SlideNav.jsx';
import Footer from './components/storyboard/Footer.jsx';
import Header from './components/storyboard/Header.jsx';
import Slide01 from './components/storyboard/Slide01.jsx';
import Slide02 from './components/storyboard/Slide02.jsx';
import Slide03 from './components/storyboard/Slide03.jsx';
import Slide04 from './components/storyboard/Slide04.jsx';
import Slide05 from './components/storyboard/Slide05.jsx';
import Slide06 from './components/storyboard/Slide06.jsx';
import Slide07 from './components/storyboard/Slide07.jsx';
import Slide08 from './components/storyboard/Slide08.jsx';
import Slide09 from './components/storyboard/Slide09.jsx';
import Slide10 from './components/storyboard/Slide10.jsx';

import './../styles/styles.css';
import './components/storyboard/Slide.css';

const components = {
  Footer,
  Header,
  Slide01,
  Slide02,
  Slide03,
  Slide04,
  Slide05,
  Slide06,
  Slide07,
  Slide08,
  Slide09,
  Slide10,
  SlideNav
};

const App = ({ meta }) => {
  const appRef = useRef();

  useEffect(() => {
    const elements = appRef.current.querySelectorAll('.slide_content p, .slide_content ul, .slide_content ol, .slide_content h3, .slide_content blockquote');
    // Options for the observer (when the p tag is 50% in the viewport)
    const options = {
      threshold: 0.5 // Trigger when 50% of the paragraph is visible
    };
    // Callback function for when the intersection occurs
    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add the visible class when the element is in view
          entry.target.classList.add('visible');
        }
      });
    };
    // Create an IntersectionObserver instance with the callback and options
    const observer = new IntersectionObserver(observerCallback, options);
    // Observe each paragraph
    for (const el of elements) {
      observer.observe(el);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 500); // A short delay ensures the DOM is ready
  }, []);

  window.appRef = appRef;

  return (
    <div
      className="app"
      style={
        {
          // '--main-color': 'var(--un-color-green-dark)',
          // '--secondary-color': 'var(--un-color-green-text)'
        }
      }
      ref={appRef}
    >
      <Article components={components} meta={meta} />
    </div>
  );
};

export default App;
