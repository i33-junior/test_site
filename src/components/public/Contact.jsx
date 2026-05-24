import { useState } from 'react';
import { api } from '../../api';

export default function Contact({ data }) {
  const [status, setStatus] = useState('idle');

  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const fd = new FormData(e.target);
      await api.submitContact({
        name: fd.get('name'),
        phone: fd.get('phone'),
        service: fd.get('service'),
        message: fd.get('msg') || ''
      });
      setStatus('sent');
      setTimeout(() => { e.target.reset(); setStatus('idle'); }, 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="contact-inner">
        <div className="contact-left reveal">
          <div className="section-eyebrow" style={{justifyContent:'flex-start'}}><div className="diamond"></div>{data.eyebrow}</div>
          <h2>{data.title} <em>{data.title_accent}</em> {data.title_end}</h2>
          <p className="lead">{data.lead}</p>

          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><i className="ti ti-map-pin"></i></div>
              <div>
                <div className="contact-label">Adres</div>
                <div className="contact-val">{data.address}<br/><span style={{fontSize:14, color:'var(--muted)'}}>{data.address_note}</span></div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="ti ti-phone"></i></div>
              <div>
                <div className="contact-label">Telefon</div>
                <div className="contact-val"><a href={`tel:${data.phone.replace(/\s/g, '')}`}>{data.phone}</a></div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="ti ti-clock-hour-4"></i></div>
              <div>
                <div className="contact-label">Godziny otwarcia</div>
                <div className="contact-val">{data.hours_weekday}<br/><span style={{fontSize:14, color:'var(--muted)'}}>{data.hours_weekend}</span></div>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form reveal" onSubmit={handleSubmit}>
          <div className="form-title">{data.form_title} <em>{data.form_title_accent}</em></div>
          <div className="form-sub">{data.form_sub}</div>

          <div className="form-field">
            <label>Imię i nazwisko</label>
            <input type="text" name="name" required placeholder="Twoje imię" />
          </div>
          <div className="form-field">
            <label>Telefon</label>
            <input type="tel" name="phone" required placeholder="+48 ___ ___ ___" />
          </div>
          <div className="form-field">
            <label>Wybierz zabieg</label>
            <select name="service" required>
              <option value="">— wybierz —</option>
              {(data.form_services || []).map((s, i) => <option key={i}>{s}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Wiadomość (opcjonalnie)</label>
            <textarea name="msg" placeholder="Preferowany termin lub dodatkowe pytania..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary form-submit"
            style={status === 'sent' ? { background: 'linear-gradient(135deg,#27d3c5,#0a8079)', color: '#0a0807' } : {}}
            disabled={status === 'sending'}
          >
            {status === 'idle' && <>Wyślij rezerwację <i className="ti ti-arrow-right arrow"></i></>}
            {status === 'sending' && 'Wysyłanie...'}
            {status === 'sent' && '✓ Dziękujemy! Oddzwonimy wkrótce.'}
            {status === 'error' && '✗ Błąd wysyłania. Spróbuj ponownie.'}
          </button>
        </form>
      </div>
    </section>
  );
}
