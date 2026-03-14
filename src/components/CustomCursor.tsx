import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    if (!cur) return;

    const onMouseMove = (e: MouseEvent) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    };

    const onEnter = () => cur.classList.add('hover');
    const onLeave = () => cur.classList.remove('hover');

    document.addEventListener('mousemove', onMouseMove);

    const attachHoverListeners = () => {
      const els = document.querySelectorAll('a, button, select, input, .ind-row');
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return els;
    };

    // Attach initially and re-attach on DOM changes (for dynamically rendered content)
    let els = attachHoverListeners();

    const observer = new MutationObserver(() => {
      // Clean up old listeners
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      els = attachHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      observer.disconnect();
    };
  }, []);

  return <div id="cur" ref={curRef} />;
}
