import { useEffect } from 'react';
import { useAllContent } from '../hooks/useContent';
import Preloader from '../components/public/Preloader';
import Particles from '../components/public/Particles';
import Nav from '../components/public/Nav';
import Hero from '../components/public/Hero';
import Services from '../components/public/Services';
import Master from '../components/public/Master';
import Gallery from '../components/public/Gallery';
import Pricing from '../components/public/Pricing';
import About from '../components/public/About';
import Testimonials from '../components/public/Testimonials';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';

export default function PublicSite() {
  const { data: content, loading } = useAllContent();

  useEffect(() => {
    if (!content) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [content, loading]);

  if (loading) return <Preloader />;

  return (
    <>
      <Preloader />
      <Particles />
      <Nav content={content} />
      <Hero data={content?.hero} />
      <div className="hero-socials-mobile">
        <a href="https://www.instagram.com/laserg_by_olena.ladna/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="ti ti-brand-instagram"></i></a>
        <a href="https://www.facebook.com/lena.ladnaya.5" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="ti ti-brand-facebook"></i></a>
        <a href="https://booksy.com/pl-pl/247066_ladyglow-by-elena-ladna_depilacja_23280_lodz" target="_blank" rel="noopener noreferrer" aria-label="Booksy"><i className="ti ti-calendar-heart"></i></a>
      </div>
      <Services sectionData={content?.services_section} />
      <Master data={content?.master} />
      <Gallery sectionData={content?.gallery_section} />
      <Pricing sectionData={content?.pricing_section} />
      <About data={content?.about} />
      <Testimonials sectionData={content?.testimonials_section} />
      <Contact data={content?.contact} />
      <Footer data={content?.footer} content={content} />
    </>
  );
}
