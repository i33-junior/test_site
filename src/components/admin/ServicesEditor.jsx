import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';
import ImageUploader from './ImageUploader';

const emptyService = {
  sort_order: 0, number: '', eyebrow: '', name: '', name_accent: '',
  description: '', full_description: '', time: '', price: '',
  image: '', device_image: '', features: []
};

export default function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const [sectionSaving, setSectionSaving] = useState(false);
  const { t } = useLang();

  const load = () => {
    api.getServices().then(setServices).catch(console.error);
    api.getContent('services_section').then(setSectionData).catch(console.error);
  };

  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api.updateService(editing.id, editing);
      } else {
        await api.createService(editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(t('upload_error') + ': ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('services_delete_confirm'))) return;
    await api.deleteService(id);
    load();
  };

  const handleSectionSave = async () => {
    setSectionSaving(true);
    try {
      await api.updateContent('services_section', sectionData);
    } catch (err) {
      alert(t('upload_error') + ': ' + err.message);
    } finally {
      setSectionSaving(false);
    }
  };

  const updateField = (key, value) => setEditing(prev => ({ ...prev, [key]: value }));

  const updateFeature = (index, value) => {
    const features = [...(editing.features || [])];
    features[index] = value;
    setEditing(prev => ({ ...prev, features }));
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{t('services_title')}</h2>
        <button className="admin-btn-primary" onClick={() => setEditing({ ...emptyService, sort_order: services.length + 1, number: String(services.length + 1).padStart(2, '0') })}>
          <i className="ti ti-plus"></i> {t('services_add')}
        </button>
      </div>

      {sectionData && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3>{t('section_header')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Eyebrow</label>
              <input className="admin-input" value={sectionData.eyebrow || ''} onChange={e => setSectionData({ ...sectionData, eyebrow: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_title')}</label>
              <input className="admin-input" value={sectionData.title || ''} onChange={e => setSectionData({ ...sectionData, title: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_accent')}</label>
              <input className="admin-input" value={sectionData.title_accent || ''} onChange={e => setSectionData({ ...sectionData, title_accent: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_subtitle')}</label>
              <textarea className="admin-textarea" value={sectionData.subtitle || ''} onChange={e => setSectionData({ ...sectionData, subtitle: e.target.value })} rows={2} />
            </div>
          </div>
          <button className="admin-btn-primary" onClick={handleSectionSave} disabled={sectionSaving} style={{ marginTop: 12 }}>
            {sectionSaving ? t('saving') : t('save_header')}
          </button>
        </div>
      )}

      {editing ? (
        <div className="admin-card">
          <h3>{editing.id ? t('services_edit') : t('services_new')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">{t('field_number')}</label>
              <input className="admin-input" value={editing.number || ''} onChange={e => updateField('number', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_order')}</label>
              <input className="admin-input" type="number" value={editing.sort_order || 0} onChange={e => updateField('sort_order', +e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_eyebrow')}</label>
              <input className="admin-input" value={editing.eyebrow || ''} onChange={e => updateField('eyebrow', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_name')}</label>
              <input className="admin-input" value={editing.name || ''} onChange={e => updateField('name', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_name_accent')}</label>
              <input className="admin-input" value={editing.name_accent || ''} onChange={e => updateField('name_accent', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_time')}</label>
              <input className="admin-input" value={editing.time || ''} onChange={e => updateField('time', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_price')}</label>
              <input className="admin-input" value={editing.price || ''} onChange={e => updateField('price', e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('field_desc_short')}</label>
            <textarea className="admin-textarea" value={editing.description || ''} onChange={e => updateField('description', e.target.value)} rows={3} />
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('field_desc_full')}</label>
            <textarea className="admin-textarea" value={editing.full_description || ''} onChange={e => updateField('full_description', e.target.value)} rows={5} />
          </div>

          <div className="admin-grid-2">
            <ImageUploader label={t('field_photo_main')} value={editing.image || ''} onChange={v => updateField('image', v)} />
            <ImageUploader label={t('field_photo_device')} value={editing.device_image || ''} onChange={v => updateField('device_image', v)} />
          </div>

          <div className="admin-field-group">
            <label className="admin-label">{t('field_features')}</label>
            {(editing.features || []).map((f, i) => (
              <div key={i} className="admin-inline-group">
                <input className="admin-input" value={f} onChange={e => updateFeature(i, e.target.value)} />
                <button className="admin-btn-sm admin-btn-danger" onClick={() => {
                  const features = editing.features.filter((_, idx) => idx !== i);
                  updateField('features', features);
                }} type="button"><i className="ti ti-trash"></i></button>
              </div>
            ))}
            <button className="admin-btn-sm" onClick={() => updateField('features', [...(editing.features || []), ''])} type="button">
              <i className="ti ti-plus"></i> {t('field_add_feature')}
            </button>
          </div>

          <div className="admin-actions">
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
            <button className="admin-btn-secondary" onClick={() => setEditing(null)}>{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="admin-list">
          {services.map(s => (
            <div className="admin-list-item" key={s.id}>
              <div className="admin-list-info">
                <span className="admin-list-num">{s.number}</span>
                <div>
                  <strong>{s.name} {s.name_accent}</strong>
                  <span className="admin-list-sub">{s.eyebrow}</span>
                </div>
              </div>
              <div className="admin-list-actions">
                <button className="admin-btn-sm" onClick={() => setEditing({ ...s })}><i className="ti ti-pencil"></i> {t('edit')}</button>
                <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(s.id)}><i className="ti ti-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
