import React from 'react';

import './AnimatedText.css';

/**
 * AnimatedText
 *
 * Splits its children into individual word-spans with staggered animation delays.
 * Supports mixed children: plain text AND <span className="highlight"> elements.
 *
 * - Plain text nodes → each word gets its own animated span
 * - <span className="highlight"> → the entire span is treated as one animated unit;
 *   words inside it animate together (same delay), preserving the highlight style
 *
 * Props:
 *   children   — React children (text + elements)
 *   isVisible  — boolean, triggers the in-viewport CSS class
 *   baseDelay  — ms before the very first word animates (default 100)
 *   wordDelay  — ms between each successive word (default 60)
 *   className  — optional wrapper class
 */
const AnimatedText = ({ children, isVisible, baseDelay = 100, wordDelay = 60, className = '' }) => {
  // Flatten children into an array of "tokens":
  // { type: "word", text, wordIndex } or { type: "highlight", element, wordIndex }
  const tokens = [];
  let wordCounter = 0;

  const processChild = child => {
    // Plain string → split into words
    if (typeof child === 'string') {
      const words = child.split(/(\s+)/); // keep whitespace as separate tokens
      for (const part of words) {
        if (/^\s+$/.test(part)) {
          // pure whitespace — emit as-is (not animated)
          tokens.push({ type: 'space', text: part, wordIndex: wordCounter });
        } else if (part.length > 0) {
          tokens.push({ type: 'word', text: part, wordIndex: wordCounter });
          wordCounter++;
        }
      }
      return;
    }

    // React element — check if it's a highlight span
    if (React.isValidElement(child)) {
      const isHighlight = child.props?.className?.includes('highlight') || child.type === 'span';

      if (isHighlight) {
        // Treat the whole span as one animated unit
        tokens.push({ type: 'highlight', element: child, wordIndex: wordCounter });
        wordCounter++;
        return;
      }

      // Other elements: recurse into their children
      const nested = React.Children.toArray(child.props.children);
      nested.forEach(processChild);
      return;
    }
  };

  React.Children.toArray(children).forEach(processChild);

  // Merge punctuation-only tokens into the preceding word/highlight so they stay on the same line
  const merged = [];
  for (const token of tokens) {
    if (token.type === 'word' && /^[.,!?;:]+$/.test(token.text) && merged.length > 0) {
      const prev = [...merged].reverse().find(t => t.type !== 'space');
      if (prev?.type === 'word') {
        prev.text += token.text;
        continue;
      }
      if (prev?.type === 'highlight') {
        prev.suffix = (prev.suffix || '') + token.text;
        continue;
      }
    }
    merged.push(token);
  }

  return (
    <span className={`animated_text ${className}`}>
      {merged.map(token => {
        const delay = baseDelay + token.wordIndex * wordDelay;
        const style = { '--word-delay': `${delay}ms` };
        const visClass = isVisible ? 'word--visible' : '';

        if (token.type === 'space') {
          return (
            <span key={`${delay}space`} className="word-space">
              {' '}
            </span>
          );
        }

        if (token.type === 'word') {
          return (
            <span key={`${delay}word`} className={`word ${visClass}`} style={style}>
              {token.text}
            </span>
          );
        }

        if (token.type === 'highlight') {
          return (
            <span key={`${delay}highlight`} className={`word word--highlight-wrapper ${visClass}`} style={style}>
              {token.element}
              {token.suffix || ''}
            </span>
          );
        }

        return null;
      })}
    </span>
  );
};

export default AnimatedText;
