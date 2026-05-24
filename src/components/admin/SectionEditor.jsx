import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';
import { fieldHintsMap } from '../../i18n/translations';
import ImageUploader from './ImageUploader';

const textareaFields = ['bio1', 'bio2', 'quote', 'text1', 'text2', 'note', 'lead', 'description', 'full_description', 'site_description', 'rating_meta', 'tagline', 'subtitle', 'section_sub', 'form_sub', 'tagline_end'];
const imageFields = ['photo', 'image'];

const sectionLayouts = {
  hero: [
    { title: 'group_top_label', desc: 'group_top_label_desc', items: ['eyebrow'] },
    { title: 'group_hero_heading', desc: 'group_hero_heading_desc', items: [['line1', 'line1_accent'], ['line2', 'line2_accent'], ['line3', 'line3_accent']] },
    { title: 'group_hero_tagline', desc: 'group_hero_tagline_desc', items: ['tagline', 'tagline_script', 'tagline_end'] },
    { title: 'group_buttons', items: [['btn_primary', 'btn_secondary']] },
    { title: 'group_hero_sidebar', desc: 'group_hero_sidebar_desc', items: [['side_rating', 'side_label']] },
  ],
  master: [
    { title: 'group_section_header', desc: 'group_section_header_desc', items: ['eyebrow', ['section_title', 'section_title_accent'], 'section_sub'] },
    { title: 'group_master_person', items: ['badge', ['name', 'name_accent'], 'role', 'photo'] },
    { title: 'group_master_bio', desc: 'group_master_bio_desc', items: ['bio1', 'bio2', 'quote'] },
    { title: 'group_master_skills', items: ['skills'] },
  ],
  about: [
    { title: 'group_section_header', desc: 'group_section_header_desc', items: ['eyebrow', ['title', 'title_accent', 'title_end']] },
    { title: 'group_about_text', desc: 'group_about_text_desc', items: ['text1', 'text2'] },
    { title: 'group_about_stats', desc: 'group_about_stats_desc', items: ['__stats'] },
  ],
  contact: [
    { title: 'group_section_header', desc: 'group_section_header_desc', items: ['eyebrow', ['title', 'title_accent', 'title_end'], 'lead'] },
    { title: 'group_contact_info', items: ['address', 'address_note', 'phone', ['hours_weekday', 'hours_weekend']] },
    { title: 'group_contact_form', desc: 'group_contact_form_desc', items: [['form_title', 'form_title_accent'], 'form_sub', 'form_services'] },
  ],
  footer: [
    { title: 'group_footer_content', items: ['tagline'] },
    { title: 'group_footer_social', items: ['instagram', 'facebook', 'booksy'] },
    { title: 'group_footer_copyright', items: ['copyright'] },
  ],
  meta: [
    { title: 'group_meta_seo', desc: 'group_meta_seo_desc', items: ['site_title', 'site_description'] },
    { title: 'group_meta_brand', desc: 'group_meta_brand_desc', items: [['brand_name', 'brand_sub']] },
  ],
};

export default function SectionEditor({ section, title }) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { t, fieldLabel } = useLang();

  useEffect(() => {
    api.getContent(section).then(setData).catch(console.error);
  }, [section]);

  const handleChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleArrayChange = (key, index, value) => {
    setData(prev => {
      const arr = [...(prev[key] || [])];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key) => setData(prev => ({ ...prev, [key]: [...(prev[key] || []), ''] }));

  const removeArrayItem = (key, index) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const handleStatsChange = (index, field, value) => {
    setData(prev => {
      const stats = [...(prev.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateContent(section, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(t('upload_error') + ': ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderHint = (key) => {
    const hintKey = fieldHintsMap[key];
    if (!hintKey) return null;
    return <span className="admin-field-hint">{t(hintKey)}</span>;
  };

  const renderField = (key) => {
    const value = data[key];
    if (value === undefined || value === null) return null;

    if (Array.isArray(value)) {
      return (
        <div key={key} className="admin-field-group">
          <label className="admin-label">{fieldLabel(key)}</label>
          {value.map((item, i) => (
            <div key={i} className="admin-inline-group">
              <input className="admin-input" value={item} onChange={e => handleArrayChange(key, i, e.target.value)} />
              <button className="admin-btn-sm admin-btn-danger" onClick={() => removeArrayItem(key, i)} type="button"><i className="ti ti-trash"></i></button>
            </div>
          ))}
          <button className="admin-btn-sm" onClick={() => addArrayItem(key)} type="button"><i className="ti ti-plus"></i> {t('add')}</button>
        </div>
      );
    }

    if (imageFields.includes(key)) {
      return <ImageUploader key={key} label={fieldLabel(key)} value={value || ''} onChange={v => handleChange(key, v)} />;
    }

    if (textareaFields.includes(key)) {
      return (
        <div key={key} className="admin-field">
          <label className="admin-label">{fieldLabel(key)}</label>
          <textarea className="admin-textarea" value={value || ''} onChange={e => handleChange(key, e.target.value)} rows={3} />
          {renderHint(key)}
        </div>
      );
    }

    return (
      <div key={key} className="admin-field">
        <label className="admin-label">{fieldLabel(key)}</label>
        <input className="admin-input" value={value || ''} onChange={e => handleChange(key, e.target.value)} />
        {renderHint(key)}
      </div>
    );
  };

  const renderStats = () => {
    const stats = data.stats;
    if (!stats) return null;
    return (
      <div className="admin-field-group">
        {stats.map((stat, i) => (
          <div key={i} className="admin-inline-group">
            <input className="admin-input" placeholder={t('stats_value')} value={stat.num || ''} onChange={e => handleStatsChange(i, 'num', e.target.value)} />
            <input className="admin-input" placeholder={t('stats_desc')} value={stat.label || ''} onChange={e => handleStatsChange(i, 'label', e.target.value)} />
          </div>
        ))}
      </div>
    );
  };

  if (!data) return <div className="admin-loading">{t('loading')}</div>;

  const layout = sectionLayouts[section];

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{title}</h2>
        <button className={`admin-btn-primary${saved ? ' saved' : ''}`} onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : saved ? t('saved') : t('save')}
        </button>
      </div>

      {layout ? (
        <div className="admin-editor-body">
          {layout.map((group, gi) => (
            <div className="admin-card" key={gi}>
              <h3>{t(group.title)}</h3>
              {group.desc && <p className="admin-group-desc">{t(group.desc)}</p>}
              {group.items.map((item, ii) => {
                if (item === '__stats') return <div key={ii}>{renderStats()}</div>;
                if (Array.isArray(item)) {
                  return (
                    <div className="admin-field-row" key={ii}>
                      {item.map(key => renderField(key))}
                    </div>
                  );
                }
                return <div key={ii}>{renderField(item)}</div>;
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-editor-body">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'stats') return <div key={key}>{renderStats()}</div>;
            return <div key={key}>{renderField(key)}</div>;
          })}
        </div>
      )}
    </div>
  );
}
