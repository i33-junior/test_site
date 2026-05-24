import { useEffect, useState } from 'react';

export default function Nav({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = content?.meta;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? 'hidden' : 'auto';
  };

  const scrollTo = (e, id) => {
    e.preventDefault();
    closeMenu();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="nav-logo">
          {meta?.brand_name || 'Lady Glow'}
          <span>{meta?.brand_sub || 'Laser & Body Atelier'}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Zabiegi</a></li>
          <li><a href="#master" onClick={e => scrollTo(e, '#master')}>Specjalista</a></li>
          <li><a href="#gallery" onClick={e => scrollTo(e, '#gallery')}>Galeria</a></li>
          <li><a href="#pricing" onClick={e => scrollTo(e, '#pricing')}>Cennik</a></li>
          <li><a href="#testimonials" onClick={e => scrollTo(e, '#testimonials')}>Opinie</a></li>
          <li><a href="#contact" onClick={e => scrollTo(e, '#contact')}>Kontakt</a></li>
        </ul>
        <div className="nav-right">
          <div className="nav-socials">
            <a href="https://www.instagram.com/laserg_by_olena.ladna/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="ti ti-brand-instagram"></i></a>
            <a href="https://www.facebook.com/lena.ladnaya.5" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="ti ti-brand-facebook"></i></a>
          </div>
          <a href="#contact" className="nav-cta" onClick={e => scrollTo(e, '#contact')}>Umów wizytę</a>
        </div>
        <button className={`nav-burger${menuOpen ? ' open' : ''}`} aria-label="Menu" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><a href="#services" onClick={e => scrollTo(e, '#services')}>Zabiegi</a></li>
          <li><a href="#master" onClick={e => scrollTo(e, '#master')}>Specjalista</a></li>
          <li><a href="#gallery" onClick={e => scrollTo(e, '#gallery')}>Galeria</a></li>
          <li><a href="#pricing" onClick={e => scrollTo(e, '#pricing')}>Cennik</a></li>
          <li><a href="#testimonials" onClick={e => scrollTo(e, '#testimonials')}>Opinie</a></li>
          <li><a href="#contact" onClick={e => scrollTo(e, '#contact')}>Kontakt</a></li>
        </ul>
        <a href="#contact" className="mobile-menu-cta" onClick={e => scrollTo(e, '#contact')}>Umów wizytę</a>
        <div className="mobile-menu-info">
          {content?.contact?.address || 'Łódź, ul. Wigury 7/02'}
          <a href={`tel:${(content?.contact?.phone || '').replace(/\s/g, '')}`}>{content?.contact?.phone || '+48 884 904 792'}</a>
        </div>
      </div>
    </>
  );
}
