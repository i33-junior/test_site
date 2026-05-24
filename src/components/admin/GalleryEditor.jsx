import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';
import ImageUploader from './ImageUploader';

export default function GalleryEditor() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const { t } = useLang();

  const load = () => {
    api.getGallery().then(setItems).catch(console.error);
    api.getContent('gallery_section').then(setSectionData).catch(console.error);
  };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api.updateGalleryItem(editing.id, editing);
      } else {
        await api.createGalleryItem(editing);
      }
      setEditing(null);
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('gallery_delete'))) return;
    await api.deleteGalleryItem(id);
    load();
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{t('gallery_title')}</h2>
        <button className="admin-btn-primary" onClick={() => setEditing({ sort_order: items.length + 1, image: '', caption: '' })}>
          <i className="ti ti-plus"></i> {t('gallery_add')}
        </button>
      </div>

      {sectionData && (
        <div className="admin-card" style={{marginBottom:24}}>
          <h3>{t('section_header')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">{t('field_title')}</label><input className="admin-input" value={sectionData.title||''} onChange={e => setSectionData({...sectionData, title: e.target.value})} /></div>
            <div className="admin-field"><label className="admin-label">{t('field_accent')}</label><input className="admin-input" value={sectionData.title_accent||''} onChange={e => setSectionData({...sectionData, title_accent: e.target.value})} /></div>
          </div>
          <button className="admin-btn-primary" onClick={() => api.updateContent('gallery_section', sectionData)} style={{marginTop:12}}>{t('save_header')}</button>
        </div>
      )}

      {editing ? (
        <div className="admin-card">
          <h3>{editing.id ? t('edit') : t('gallery_new')}</h3>
          <ImageUploader label={t('field_photo')} value={editing.image || ''} onChange={v => setEditing({...editing, image: v})} />
          <div className="admin-field">
            <label className="admin-label">{t('field_caption')}</label>
            <input className="admin-input" value={editing.caption || ''} onChange={e => setEditing({...editing, caption: e.target.value})} />
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('field_order')}</label>
            <input className="admin-input" type="number" value={editing.sort_order || 0} onChange={e => setEditing({...editing, sort_order: +e.target.value})} />
          </div>
          <div className="admin-actions">
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? '...' : t('save')}</button>
            <button className="admin-btn-secondary" onClick={() => setEditing(null)}>{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {items.map(item => (
            <div className="admin-gallery-item" key={item.id}>
              {item.image ? (
                <img src={item.image} alt={item.caption} />
              ) : (
                <div className="admin-gallery-placeholder">
                  <i className="ti ti-photo"></i>
                  <span>{t('gallery_no_photo')}</span>
                </div>
              )}
              <div className="admin-gallery-caption">{item.caption}</div>
              <div className="admin-gallery-actions">
                <button className="admin-btn-sm" onClick={() => setEditing({...item})}><i className="ti ti-pencil"></i></button>
                <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(item.id)}><i className="ti ti-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
