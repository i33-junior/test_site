import { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2400);
    document.body.style.overflow = 'hidden';
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hidden) document.body.style.overflow = 'auto';
  }, [hidden]);

  return (
    <div className={`preloader${hidden ? ' hidden' : ''}`} id="preloader">
      <div className="pl-wings">
        <div className="pl-spark"></div>
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6d57a"/>
              <stop offset="50%" stopColor="#d4a64a"/>
              <stop offset="100%" stopColor="#6b4a18"/>
            </linearGradient>
          </defs>
          <g className="wing-l">
            <path d="M118 78 Q90 70 60 50 Q40 38 18 28 Q40 50 50 70 Q35 60 18 58 Q40 70 55 80 Q40 78 28 82 Q60 88 90 86 Q108 84 118 80 Z" fill="url(#wingGrad)" opacity=".85"/>
          </g>
          <g className="wing-r">
            <path d="M122 78 Q150 70 180 50 Q200 38 222 28 Q200 50 190 70 Q205 60 222 58 Q200 70 185 80 Q200 78 212 82 Q180 88 150 86 Q132 84 122 80 Z" fill="url(#wingGrad)" opacity=".85"/>
          </g>
        </svg>
      </div>
      <div className="pl-name">Lady Glow</div>
      <div className="pl-sub">Laser &nbsp;·&nbsp; Body &nbsp;·&nbsp; Atelier</div>
      <div className="pl-progress"></div>
    </div>
  );
}
