export default function Footer({ data, content }) {
  if (!data) return null;

  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo">{content?.meta?.brand_name || 'Lady Glow'}</div>
          <div className="tag">{content?.meta?.brand_sub || 'Laser & Body Atelier'}</div>
          <p>{data.tagline}</p>
          <div className="footer-socials">
            <a href={data.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-instagram"></i></a>
            <a href={data.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-facebook"></i></a>
            <a href={data.booksy} target="_blank" rel="noopener noreferrer" aria-label="Booksy"><i className="ti ti-calendar-heart"></i></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Zabiegi</h4>
          <ul>
            <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Geneo+</a></li>
            <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Endospheres</a></li>
            <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Depilacja laserowa</a></li>
            <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Peeling węglowy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Atelier</h4>
          <ul>
            <li><a href="#master" onClick={e => scrollTo(e, '#master')}>Specjalista</a></li>
            <li><a href="#gallery" onClick={e => scrollTo(e, '#gallery')}>Galeria</a></li>
            <li><a href="#pricing" onClick={e => scrollTo(e, '#pricing')}>Cennik</a></li>
            <li><a href="#contact" onClick={e => scrollTo(e, '#contact')}>Kontakt</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>{data.copyright}</div>
        <div>Stworzone z miłością do piękna <i className="ti ti-sparkles" style={{color:'var(--gold-1)', verticalAlign:'middle', marginLeft:4}}></i></div>
      </div>
    </footer>
  );
}
