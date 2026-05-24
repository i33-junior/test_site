import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';

const langFlags = { pl: 'PL', ru: 'RU', ua: 'UA' };

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { lang, switchLang, t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-lang-switcher" style={{ position: 'absolute', top: 16, right: 16 }}>
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
        <div className="admin-login-logo">Lady Glow</div>
        <div className="admin-login-sub">{t('login_title')}</div>
        <form onSubmit={handleSubmit}>
          {error && <div className="admin-error">{error}</div>}
          <div className="admin-field">
            <label>{t('login_username')}</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="admin-field">
            <label>{t('login_password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? t('login_loading') : t('login_submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
