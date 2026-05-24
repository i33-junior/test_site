import { useEffect } from 'react';

export default function ServiceModal({ service, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!service) return null;
  const features = service.features || [];

  const scrollToContact = (e) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="ti ti-x"></i>
        </button>

        {service.image && (
          <div className="modal-image">
            <img src={service.image} alt={service.name} />
          </div>
        )}

        <div className="modal-body">
          <div className="modal-eyebrow">{service.eyebrow}</div>
          <h2 className="modal-title">{service.name} <em>{service.name_accent}</em></h2>

          <p className="modal-desc">{service.full_description || service.description}</p>

          {features.length > 0 && (
            <div className="modal-features">
              <h4>Zalety zabiegu</h4>
              <ul>
                {features.map((f, i) => (
                  <li key={i}><i className="ti ti-check"></i>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-meta">
            <div className="modal-meta-item">
              <i className="ti ti-clock-hour-4"></i>
              <span>{service.time}</span>
            </div>
            <div className="modal-meta-item">
              <i className="ti ti-tag"></i>
              <span>{service.price}</span>
            </div>
          </div>

          <a href="#contact" className="btn btn-primary modal-cta" onClick={scrollToContact}>
            Zarezerwuj wizytę <i className="ti ti-arrow-right arrow"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
