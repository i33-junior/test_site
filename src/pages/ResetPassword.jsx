import { useState } from 'react';
import { api } from '../api';

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (token) return <ResetForm token={token} />;
  return <ForgotForm />;
}

function ForgotForm() {
  const [username, setUsername] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.forgotPassword(username).catch(() => {});
    setSent(true);
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">Lady Glow</div>
        <h2 style={{ color: 'var(--cream)', marginBottom: 8, fontSize: 20 }}>Odzyskiwanie hasła</h2>
        {sent ? (
          <p style={{ color: 'var(--gold-2)', textAlign: 'center', lineHeight: 1.6 }}>
            Jeśli konto istnieje i ma przypisany e-mail, link do zmiany hasła został wysłany.
            <br/><br/>
            <a href="/admin" style={{ color: 'var(--gold-1)' }}>← Powrót do logowania</a>
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <label>Login</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Twój login" required />
            </div>
            <button type="submit" className="admin-login-btn">Wyślij link resetujący</button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a href="/admin" style={{ color: 'var(--muted)', fontSize: 13 }}>← Powrót do logowania</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ResetForm({ token }) {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPw.length < 6) { setError('Hasło min. 6 znaków'); return; }
    if (newPw !== confirmPw) { setError('Hasła nie pasują'); return; }
    try {
      await api.resetPassword(token, newPw);
      setStatus('done');
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'done') {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-logo">Lady Glow</div>
          <p style={{ color: 'var(--gold-2)', textAlign: 'center', lineHeight: 1.6 }}>
            ✓ Hasło zostało zmienione!
            <br/><br/>
            <a href="/admin" style={{ color: 'var(--gold-1)' }}>Zaloguj się →</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">Lady Glow</div>
        <h2 style={{ color: 'var(--cream)', marginBottom: 8, fontSize: 20 }}>Nowe hasło</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label>Nowe hasło</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required />
          </div>
          <div className="admin-login-field">
            <label>Potwierdź hasło</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
          </div>
          {error && <div className="admin-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button type="submit" className="admin-login-btn">Ustaw nowe hasło</button>
        </form>
      </div>
    </div>
  );
}
