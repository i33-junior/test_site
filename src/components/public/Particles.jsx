import { useEffect, useRef } from 'react';

export default function Particles() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (12 + Math.random() * 14) + 's';
      p.style.animationDelay = Math.random() * 12 + 's';
      const s = 1 + Math.random() * 3;
      p.style.width = s + 'px';
      p.style.height = s + 'px';
      el.appendChild(p);
    }
  }, []);

  return <div className="particles" ref={ref}></div>;
}
