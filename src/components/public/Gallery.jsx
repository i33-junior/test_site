import { useEffect, useState, useRef } from 'react';
import { api } from '../../api';

export default function Gallery({ sectionData }) {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const startXRef = useRef(0);

  useEffect(() => {
    api.getGallery().then(setItems).catch(console.error);
  }, []);

  const getVisible = () => {
    const w = window.innerWidth;
    if (w < 980) return 1;
    if (w < 1100) return 2;
    return 3;
  };

  const [visible, setVisible] = useState(getVisible());
  const maxIndex = Math.max(0, items.length - visible);

  useEffect(() => {
    const onResize = () => {
      const v = getVisible();
      setVisible(v);
      setCurrent(c => Math.min(c, Math.max(0, items.length - v)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [items.length]);

  const goTo = (i) => setCurrent(Math.max(0, Math.min(i, maxIndex)));

  useEffect(() => {
    if (!trackRef.current || !trackRef.current.children[0]) return;
    const slideW = trackRef.current.children[0].offsetWidth + 24;
    trackRef.current.style.transform = `translateX(${-current * slideW}px)`;
  }, [current, items]);

  if (!sectionData) return null;

  return (
    <section className="section gallery" id="gallery">
      <div className="section-eyebrow"><div className="diamond"></div>{sectionData.eyebrow}<div className="diamond"></div></div>
      <h2 className="section-title reveal">{sectionData.title} <em>{sectionData.title_accent}</em> {sectionData.title_end}</h2>
      <p className="section-sub reveal">{sectionData.subtitle}</p>

      <div className="gallery-wrap reveal">
        <div className="gallery-track-wrap">
          <div className="gallery-track" ref={trackRef}
            onTouchStart={e => { startXRef.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const dx = e.changedTouches[0].clientX - startXRef.current;
              if (dx > 50) goTo(current - 1);
              else if (dx < -50) goTo(current + 1);
            }}
          >
            {items.map((item) => (
              <div className="gallery-slide" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.caption} />
                ) : (
                  <div className="gallery-placeholder">
                    <svg viewBox="0 0 100 100"><rect x="15" y="20" width="70" height="55" rx="2"/><path d="M30 50 L42 38 L55 50 L70 35"/><circle cx="68" cy="32" r="3" fill="currentColor" stroke="none"/></svg>
                    <span>{item.caption}</span>
                  </div>
                )}
                <div className="gallery-caption">{item.caption}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-nav">
          <button className="gallery-btn" disabled={current === 0} onClick={() => goTo(current - 1)} aria-label="Poprzednie">
            <i className="ti ti-chevron-left"></i>
          </button>
          <div className="gallery-dots">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button key={i} className={`gallery-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Slajd ${i + 1}`}></button>
            ))}
          </div>
          <button className="gallery-btn" disabled={current >= maxIndex} onClick={() => goTo(current + 1)} aria-label="Następne">
            <i className="ti ti-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
