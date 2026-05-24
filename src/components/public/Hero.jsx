import { useEffect, useRef } from 'react';

const sparkles = [
  { cx:500, cy:580, r:2.5, c:'gold', d:0 },
  { cx:220, cy:140, r:3,   c:'gold', d:1.8 },
  { cx:380, cy:100, r:1.5, c:'gold', d:3.2 },
  { cx:540, cy:320, r:2,   c:'gold', d:0.6 },
  { cx:150, cy:640, r:1.8, c:'gold', d:2.4 },
  { cx:460, cy:460, r:2,   c:'gold', d:4.1 },
  { cx:300, cy:730, r:1.5, c:'gold', d:1.2 },
  { cx:120, cy:460, r:2,   c:'teal', d:0.4 },
  { cx:440, cy:230, r:2,   c:'teal', d:2.8 },
  { cx:530, cy:160, r:1.8, c:'teal', d:1.6 },
  { cx:350, cy:380, r:1.5, c:'teal', d:3.8 },
  { cx:80,  cy:340, r:2.5, c:'teal', d:0.9 },
  { cx:490, cy:110, r:1.2, c:'teal', d:4.4 },
  { cx:520, cy:400, r:1.8, c:'pink', d:0.3 },
  { cx:200, cy:310, r:2,   c:'pink', d:2.1 },
  { cx:380, cy:530, r:1.5, c:'pink', d:3.5 },
  { cx:100, cy:490, r:2,   c:'pink', d:1.4 },
  { cx:460, cy:660, r:1.2, c:'pink', d:4.0 },
  { cx:250, cy:200, r:2.5, c:'pink', d:2.6 },
  { cx:570, cy:500, r:1.5, c:'pink', d:0.7 },
];

export default function Hero({ data }) {
  const figRef = useRef(null);
  const curvesRef = useRef(null);

  useEffect(() => {
    const isMobile = () => window.innerWidth <= 980;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        if (figRef.current) {
          const xOffset = isMobile() ? 'translateX(-50%) ' : '';
          figRef.current.style.transform = `${xOffset}translateY(${y * 0.15}px)`;
        }
        if (curvesRef.current) curvesRef.current.style.transform = `translateY(${y * 0.08}px)`;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!data) return null;

  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-curves" ref={curvesRef}>
        <svg viewBox="0 0 1400 900" preserveAspectRatio="none">
          <path className="c-gold" d="M-100 600 Q 400 300, 800 500 T 1500 350"/>
          <path className="c-gold" d="M-100 700 Q 500 400, 900 600 T 1500 480" style={{opacity:.5}}/>
          <path className="c-teal" d="M1500 250 Q 1000 500, 700 350 T -100 450"/>
        </svg>
      </div>

      <div className="hero-figure" ref={figRef}>
        <svg className="hero-glow-lines" viewBox="0 0 600 800">
          <defs>
            <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g filter="url(#lineGlow)">
            {/* Gold lines */}
            <path className="hero-line hl-gold hl-1"  d="M 550 780 C 520 580, 500 400, 400 280 C 300 160, 180 120, 50 80"/>
            <path className="hero-line hl-gold hl-2"  d="M 580 620 C 540 460, 440 330, 340 250 C 240 170, 150 110, 30 50"/>
            <path className="hero-line hl-gold hl-3"  d="M 470 260 C 400 190, 310 150, 200 150"/>
            <path className="hero-line hl-gold hl-4"  d="M 400 800 C 460 640, 520 470, 460 330 C 400 190, 260 130, 120 100"/>
            {/* Teal lines */}
            <path className="hero-line hl-teal hl-5"  d="M 50 740 C 90 560, 190 400, 310 290 C 430 180, 530 160, 580 120"/>
            <path className="hero-line hl-teal hl-6"  d="M 30 580 C 70 420, 190 310, 310 230 C 430 150, 510 170, 570 250"/>
            <path className="hero-line hl-teal hl-7"  d="M 140 210 C 230 140, 350 120, 460 160"/>
            <path className="hero-line hl-teal hl-8"  d="M 80 800 C 120 640, 210 480, 330 360 C 450 240, 520 220, 570 170"/>
            {/* Pink lines */}
            <path className="hero-line hl-pink hl-9"  d="M 570 440 C 490 370, 380 320, 270 320 C 160 320, 90 370, 20 460"/>
            <path className="hero-line hl-pink hl-10" d="M 560 700 C 460 590, 340 530, 240 530 C 140 530, 70 580, 10 680"/>
            <path className="hero-line hl-pink hl-11" d="M 510 340 C 440 290, 350 270, 250 290"/>
          </g>

          <g filter="url(#sparkGlow)">
            {sparkles.map((s, i) => (
              <circle key={i} className={`hero-sparkle hs-${s.c}`} cx={s.cx} cy={s.cy} r={s.r} style={{ animationDelay: `${s.d}s` }}/>
            ))}
          </g>
        </svg>
        <img src="/img/hero-1.png" alt="Lady Glow" />
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">{data.eyebrow}</div>
        <h1>
          <span className="line"><span>{data.line1} <em className="gold">{data.line1_accent}</em>.</span></span>
          <span className="line"><span>{data.line2} <em className="teal">{data.line2_accent}</em>.</span></span>
          <span className="line"><span>{data.line3} <em className="gold">{data.line3_accent}</em>.</span></span>
        </h1>
        <p className="hero-tagline">
          {data.tagline} <span>{data.tagline_script}</span> {data.tagline_end}
        </p>
        <div className="hero-cta-row">
          <a href="#contact" className="btn btn-primary" onClick={e => scrollTo(e, '#contact')}>
            {data.btn_primary}
            <i className="ti ti-arrow-right arrow"></i>
          </a>
          <a href="#services" className="btn btn-ghost" onClick={e => scrollTo(e, '#services')}>
            {data.btn_secondary}
          </a>
        </div>
      </div>

      <div className="hero-side">
        <div className="hero-side-item"><i className="ti ti-star-filled" style={{marginRight:4}}></i> {data.side_rating}</div>
        <div className="hero-side-line"></div>
        <div className="hero-side-item">{data.side_label}</div>
      </div>

      <div className="scroll-hint">Scroll</div>
    </section>
  );
}
