import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.r').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
