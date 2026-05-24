import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';

export default function TestimonialsEditor() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const { t } = useLang();

  const load = () => {
    api.getTestimonials().then(setItems).catch(console.error);
    api.getContent('testimonials_section').then(setSectionData).catch(console.error);
  };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api.updateTestimonial(editing.id, editing);
      } else {
        await api.createTestimonial(editing);
      }
      setEditing(null);
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('testimonials_delete'))) return;
    await api.deleteTestimonial(id);
    load();
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{t('testimonials_title')}</h2>
        <button className="admin-btn-primary" onClick={() => setEditing({ sort_order: items.length + 1, name: '', initials: '', service: '', text: '', rating: 5, meta: 'Potwierdzona klientka · Booksy' })}>
          <i className="ti ti-plus"></i> {t('testimonials_add')}
        </button>
      </div>

      {sectionData && (
        <div className="admin-card" style={{marginBottom:24}}>
          <h3>{t('section_header')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">{t('field_rating')}</label><input className="admin-input" value={sectionData.rating||''} onChange={e => setSectionData({...sectionData, rating: e.target.value})} /></div>
            <div className="admin-field"><label className="admin-label">Booksy URL</label><input className="admin-input" value={sectionData.booksy_url||''} onChange={e => setSectionData({...sectionData, booksy_url: e.target.value})} /></div>
          </div>
          <button className="admin-btn-primary" onClick={() => api.updateContent('testimonials_section', sectionData)} style={{marginTop:12}}>{t('save_header')}</button>
        </div>
      )}

      {editing ? (
        <div className="admin-card">
          <h3>{editing.id ? t('testimonials_edit') : t('testimonials_new')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">{t('field_name')}</label><input className="admin-input" value={editing.name||''} onChange={e => setEditing({...editing, name: e.target.value})} /></div>
            <div className="admin-field"><label className="admin-label">{t('field_initials')}</label><input className="admin-input" value={editing.initials||''} onChange={e => setEditing({...editing, initials: e.target.value})} placeholder="IR" /></div>
            <div className="admin-field"><label className="admin-label">{t('field_service')}</label><input className="admin-input" value={editing.service||''} onChange={e => setEditing({...editing, service: e.target.value})} /></div>
            <div className="admin-field"><label className="admin-label">{t('field_rating')}</label><input className="admin-input" type="number" min="1" max="5" value={editing.rating||5} onChange={e => setEditing({...editing, rating: +e.target.value})} /></div>
          </div>
          <div className="admin-field"><label className="admin-label">{t('field_text')}</label><textarea className="admin-textarea" value={editing.text||''} onChange={e => setEditing({...editing, text: e.target.value})} rows={4} /></div>
          <div className="admin-field"><label className="admin-label">{t('field_meta')}</label><input className="admin-input" value={editing.meta||''} onChange={e => setEditing({...editing, meta: e.target.value})} /></div>
          <div className="admin-actions">
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? '...' : t('save')}</button>
            <button className="admin-btn-secondary" onClick={() => setEditing(null)}>{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="admin-list">
          {items.map(t_item => (
            <div className="admin-list-item" key={t_item.id}>
              <div className="admin-list-info">
                <div className="admin-avatar">{t_item.initials}</div>
                <div>
                  <strong>{t_item.name}</strong>
                  <span className="admin-list-sub">{t_item.service} · {'★'.repeat(t_item.rating || 5)}</span>
                </div>
              </div>
              <div className="admin-list-actions">
                <button className="admin-btn-sm" onClick={() => setEditing({...t_item})}><i className="ti ti-pencil"></i></button>
                <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(t_item.id)}><i className="ti ti-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
