import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';

export default function AccountSettings() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwStatus, setPwStatus] = useState('idle');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    api.getProfile().then(p => setEmail(p.email || '')).catch(() => {});
  }, []);

  const saveEmail = async () => {
    setEmailStatus('saving');
    try {
      await api.updateProfile({ email });
      setEmailStatus('saved');
      setTimeout(() => setEmailStatus('idle'), 2000);
    } catch {
      setEmailStatus('idle');
    }
  };

  const changePw = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 6) { setPwError(t('password_too_short')); return; }
    if (newPw !== confirmPw) { setPwError(t('password_mismatch')); return; }
    setPwStatus('saving');
    try {
      await api.changePassword(oldPw, newPw);
      setPwStatus('saved');
      setOldPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwStatus('idle'), 2000);
    } catch (err) {
      setPwError(err.message);
      setPwStatus('idle');
    }
  };

  return (
    <div>
      <h2 className="admin-section-title">{t('settings_title')}</h2>

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>{t('recovery_email')}</h3>
        </div>
        <div className="admin-card-body">
          <p className="admin-group-desc">{t('recovery_email_hint')}</p>
          <div className="admin-field">
            <label className="admin-label">E-mail</label>
            <input className="admin-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@gmail.com" />
          </div>
          <button className="admin-btn admin-btn-primary" onClick={saveEmail}
            disabled={emailStatus === 'saving'}>
            {emailStatus === 'saved' ? `✓ ${t('saved')}` : t('save')}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>{t('change_password')}</h3>
        </div>
        <div className="admin-card-body">
          <form onSubmit={changePw}>
            <div className="admin-field">
              <label className="admin-label">{t('current_password')}</label>
              <input className="admin-input" type="password" value={oldPw}
                onChange={e => setOldPw(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('new_password')}</label>
              <input className="admin-input" type="password" value={newPw}
                onChange={e => setNewPw(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('confirm_password')}</label>
              <input className="admin-input" type="password" value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)} required />
            </div>
            {pwError && <div className="admin-error">{pwError}</div>}
            <button className="admin-btn admin-btn-primary" type="submit"
              disabled={pwStatus === 'saving'}>
              {pwStatus === 'saved' ? `✓ ${t('password_changed')}` : t('change_password')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
