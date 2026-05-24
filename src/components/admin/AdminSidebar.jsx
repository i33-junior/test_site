import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

const menuItems = [
  { id: 'hero', tKey: 'sidebar_hero', icon: 'ti-home' },
  { id: 'services', tKey: 'sidebar_services', icon: 'ti-wand' },
  { id: 'master', tKey: 'sidebar_master', icon: 'ti-user-star' },
  { id: 'gallery', tKey: 'sidebar_gallery', icon: 'ti-photo' },
  { id: 'pricing', tKey: 'sidebar_pricing', icon: 'ti-tag' },
  { id: 'about', tKey: 'sidebar_about', icon: 'ti-heart' },
  { id: 'testimonials', tKey: 'sidebar_testimonials', icon: 'ti-message-star' },
  { id: 'contact', tKey: 'sidebar_contact', icon: 'ti-phone' },
  { id: 'footer', tKey: 'sidebar_footer', icon: 'ti-layout-bottombar' },
  { id: 'meta', tKey: 'sidebar_meta', icon: 'ti-settings' },
  { id: 'account', tKey: 'sidebar_account', icon: 'ti-user-cog' },
];

const langFlags = { pl: 'PL', ru: 'RU', ua: 'UA' };

export default function AdminSidebar({ active, onSelect, isOpen }) {
  const { logout } = useAuth();
  const { lang, switchLang, t } = useLang();

  return (
    <aside className={`admin-sidebar${isOpen ? ' open' : ''}`}>
      <div className="admin-sidebar-logo">
        <span className="admin-sidebar-brand">Lady Glow</span>
        <span className="admin-sidebar-sub">{t('sidebar_admin')}</span>
      </div>
      <div className="admin-lang-switcher">
        {Object.entries(langFlags).map(([code, label]) => (
          <button
            key={code}
            className={`admin-lang-btn${lang === code ? ' active' : ''}`}
            onClick={() => switchLang(code)}
          >
            {label}
          </button>
        ))}
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`admin-sidebar-item${active === item.id ? ' active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <i className={`ti ${item.icon}`}></i>
            <span>{t(item.tKey)}</span>
          </button>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <a href="/" className="admin-sidebar-item" target="_blank" rel="noopener noreferrer">
          <i className="ti ti-external-link"></i><span>{t('sidebar_view_site')}</span>
        </a>
        <button className="admin-sidebar-item admin-logout" onClick={logout}>
          <i className="ti ti-logout"></i><span>{t('sidebar_logout')}</span>
        </button>
      </div>
    </aside>
  );
}
