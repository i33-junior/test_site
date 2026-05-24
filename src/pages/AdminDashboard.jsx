import { useState } from 'react';
import { useLang } from '../context/LangContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import SectionEditor from '../components/admin/SectionEditor';
import ServicesEditor from '../components/admin/ServicesEditor';
import PricingEditor from '../components/admin/PricingEditor';
import GalleryEditor from '../components/admin/GalleryEditor';
import TestimonialsEditor from '../components/admin/TestimonialsEditor';
import AccountSettings from '../components/admin/AccountSettings';

const sectionTitleKeys = {
  hero: 'editor_hero',
  master: 'editor_master',
  about: 'editor_about',
  contact: 'editor_contact',
  footer: 'editor_footer',
  meta: 'editor_meta',
};

export default function AdminDashboard() {
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();

  const handleSelect = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  const renderEditor = () => {
    switch (active) {
      case 'services': return <ServicesEditor />;
      case 'pricing': return <PricingEditor />;
      case 'gallery': return <GalleryEditor />;
      case 'testimonials': return <TestimonialsEditor />;
      case 'account': return <AccountSettings />;
      default: return <SectionEditor section={active} title={t(sectionTitleKeys[active] || active)} />;
    }
  };

  return (
    <div className="admin-layout">
      <button className="admin-burger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`}></i>
      </button>
      <div className={`admin-sidebar-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <AdminSidebar active={active} onSelect={handleSelect} isOpen={menuOpen} />
      <main className="admin-main">
        {renderEditor()}
      </main>
    </div>
  );
}
