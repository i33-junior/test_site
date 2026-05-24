import { useEffect, useRef, useState } from 'react';
import { api } from '../../api';

export default function Testimonials({ sectionData }) {
  const [items, setItems] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    api.getTestimonials().then(setItems).catch(console.error);
  }, []);

  useEffect(() => {
    if (!items.length || !gridRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    gridRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!sectionData) return null;

  return (
    <section className="section testimonials" id="testimonials">
      <div className="section-eyebrow"><div className="diamond"></div>{sectionData.eyebrow}<div className="diamond"></div></div>
      <h2 className="section-title reveal">{sectionData.title} <em>{sectionData.title_accent}</em></h2>
      <p className="section-sub reveal">{sectionData.subtitle}</p>

      <div className="test-rating reveal">
        <div className="test-rating-stars">
          {[...Array(5)].map((_, i) => <i key={i} className="ti ti-star-filled"></i>)}
        </div>
        <div className="test-rating-num">{sectionData.rating}</div>
        <div className="test-rating-meta" dangerouslySetInnerHTML={{ __html: sectionData.rating_meta }}></div>
      </div>

      <div className="test-grid" ref={gridRef}>
        {items.map(t => (
          <div className="test-card reveal" key={t.id}>
            <div className="test-stars">
              {[...Array(t.rating || 5)].map((_, i) => <i key={i} className="ti ti-star-filled"></i>)}
            </div>
            <div className="test-service">{t.service}</div>
            <p className="test-text">{t.text}</p>
            <div className="test-author">
              <div className="test-avatar">{t.initials}</div>
              <div>
                <div className="test-name">{t.name}</div>
                <div className="test-meta">{t.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="test-cta reveal">
        <a href={sectionData.booksy_url} target="_blank" rel="noopener noreferrer">
          {sectionData.booksy_text} <i className="ti ti-arrow-right"></i>
        </a>
      </div>
    </section>
  );
}
