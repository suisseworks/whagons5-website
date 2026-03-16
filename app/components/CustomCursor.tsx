'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const onEnter = () => cursor.classList.add('hover');
    const onLeave = () => cursor.classList.remove('hover');

    document.addEventListener('mousemove', onMouseMove);

    // Observe DOM for interactive elements (handles dynamic content)
    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, select, input, textarea, .ind-row');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return interactives;
    };

    let interactives = attachListeners();

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      // Clean up old listeners
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      interactives = attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Hide cursor on touch devices
    const onTouchStart = () => {
      cursor.style.display = 'none';
      document.body.style.cursor = 'auto';
    };
    window.addEventListener('touchstart', onTouchStart, { once: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      observer.disconnect();
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return (
    <div ref={cursorRef} id="cur">
      <svg
        className="wand-svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wand stick — diagonal line, bottom-left to upper-right */}
        <line
          x1="5"
          y1="23"
          x2="20"
          y2="8"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Wand tip highlight */}
        <line
          x1="18"
          y1="10"
          x2="21"
          y2="7"
          stroke="var(--red)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Sparkles at the tip */}
        <g className="wand-sparkles">
          {/* Main star */}
          <path
            d="M22 4L22.7 6.3L25 7L22.7 7.7L22 10L21.3 7.7L19 7L21.3 6.3L22 4Z"
            fill="var(--red)"
          />
          {/* Small accent sparkle */}
          <circle cx="26" cy="3" r="1" fill="var(--red)" opacity="0.6" />
          <circle cx="18" cy="2" r="0.7" fill="var(--red)" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
