import { useEffect, useState, useRef } from 'react';
import { api } from '../../api';
import ServiceModal from './ServiceModal';

function ServicePlaceholder({ type }) {
  const placeholders = {
    'geneo': <svg viewBox="0 0 100 100"><circle cx="50" cy="42" r="20"/><path d="M30 75 Q50 60 70 75"/><circle cx="42" cy="40" r="1.5" fill="currentColor"/><circle cx="58" cy="40" r="1.5" fill="currentColor"/><path d="M42 50 Q50 56 58 50"/><path d="M75 25l4-4 M82 30l5 0 M75 36l4 4" strokeLinecap="round"/></svg>,
    'endo': <svg viewBox="0 0 100 100"><ellipse cx="50" cy="20" rx="6" ry="6"/><path d="M40 28 Q36 42 36 60 L36 82 M60 28 Q64 42 64 60 L64 82"/><path d="M50 28 L50 82"/><circle cx="85" cy="40" r="3"/><circle cx="80" cy="50" r="2"/><circle cx="85" cy="60" r="3"/></svg>,
    'laser': <svg viewBox="0 0 100 100"><path d="M38 20 Q36 50 38 75 Q40 85 42 90"/><path d="M62 20 Q64 50 62 75 Q60 85 58 90"/><path d="M80 30 L75 35 M85 42 L78 42 M80 54 L75 49" strokeLinecap="round"/><circle cx="85" cy="42" r="2" fill="currentColor" stroke="none"/></svg>,
    'carbon': <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="14" opacity=".5"/><circle cx="44" cy="46" r="1" fill="currentColor"/><circle cx="56" cy="46" r="1" fill="currentColor"/><circle cx="50" cy="52" r="1" fill="currentColor"/><path d="M78 30l4-4 M82 38l5 0 M78 46l4 4" strokeLinecap="round"/></svg>
  };
  return placeholders[type] || placeholders.geneo;
}

function DevicePlaceholder({ type }) {
  const placeholders = {
    'geneo': <svg viewBox="0 0 60 60"><circle cx="30" cy="22" r="10"/><path d="M30 32 L30 50"/><path d="M22 18 Q30 22 38 18" strokeLinecap="round"/><circle cx="30" cy="22" r="3" fill="currentColor" stroke="none"/></svg>,
    'endo': <svg viewBox="0 0 60 60"><rect x="15" y="20" width="30" height="20" rx="3"/><circle cx="22" cy="30" r="2.5"/><circle cx="30" cy="30" r="2.5"/><circle cx="38" cy="30" r="2.5"/><path d="M30 40 L30 50"/></svg>,
    'laser': <svg viewBox="0 0 60 60"><rect x="20" y="15" width="20" height="25" rx="3"/><path d="M25 40 L25 50 M35 40 L35 50"/><circle cx="30" cy="25" r="3" fill="currentColor" stroke="none" opacity=".6"/><path d="M30 12 L30 8 M22 14 L19 11 M38 14 L41 11" strokeLinecap="round"/></svg>,
    'carbon': <svg viewBox="0 0 60 60"><circle cx="30" cy="22" r="8"/><path d="M30 30 L30 48"/><path d="M22 22 L18 22 M38 22 L42 22" strokeLinecap="round"/><circle cx="30" cy="22" r="2" fill="currentColor" stroke="none"/></svg>
  };
  return placeholders[type] || placeholders.geneo;
}

const typeMap = ['geneo', 'endo', 'laser', 'carbon'];

export default function Services({ sectionData }) {
  const [services, setServices] = useState([]);
  const [modalService, setModalService] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    cardsRef.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [services]);

  if (!sectionData) return null;

  return (
    <section className="section services" id="services">
      <div className="section-eyebrow"><div className="diamond"></div>{sectionData.eyebrow}<div className="diamond"></div></div>
      <h2 className="section-title reveal">{sectionData.title} <em>{sectionData.title_accent}</em> {sectionData.title_end}</h2>
      <p className="section-sub reveal">{sectionData.subtitle}</p>

      <div className="services-grid">
        {services.map((s, i) => (
          <article className="service-card" key={s.id} ref={el => cardsRef.current[i] = el}>
            <div className="service-img">
              {s.image ? (
                <img src={s.image} alt={`${s.name} ${s.name_accent}`} />
              ) : (
                <div className="service-img-placeholder">
                  <ServicePlaceholder type={typeMap[i] || 'geneo'} />
                </div>
              )}
            </div>
            {s.device_image && (
              <div className="service-device">
                <img src={s.device_image} alt="" />
              </div>
            )}
            <div className="service-body">
              <span className="service-corner">{s.number}</span>
              <div className="service-eyebrow">{s.eyebrow}</div>
              <h3 className="service-name">{s.name} <em>{s.name_accent}</em></h3>
              <p className="service-desc">{s.description}</p>
              <div className="service-meta">
                <div className="service-meta-item"><i className="ti ti-clock-hour-4"></i>{s.time}</div>
                <div className="service-meta-item"><i className="ti ti-tag"></i>{s.price}</div>
              </div>
              <button className="service-link" onClick={() => setModalService(s)}>
                Dowiedz się więcej <i className="ti ti-arrow-right"></i>
              </button>
            </div>
          </article>
        ))}
      </div>

      {modalService && (
        <ServiceModal service={modalService} onClose={() => setModalService(null)} />
      )}
    </section>
  );
}
