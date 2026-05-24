import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';

export default function PricingEditor() {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const { t } = useLang();

  const loadGroups = () => api.getPricingFull().then(data => {
    setGroups(data);
    if (activeGroup) {
      const g = data.find(gr => gr.id === activeGroup);
      if (g) setItems(g.items || []);
    }
  }).catch(console.error);

  useEffect(() => {
    loadGroups();
    api.getContent('pricing_section').then(setSectionData).catch(console.error);
  }, []);

  const selectGroup = (g) => {
    setActiveGroup(g.id);
    setItems(g.items || []);
    setEditingItem(null);
  };

  const saveGroup = async () => {
    setSaving(true);
    try {
      if (editingGroup.id) {
        await api.updatePricingGroup(editingGroup.id, editingGroup);
      } else {
        await api.createPricingGroup(editingGroup);
      }
      setEditingGroup(null);
      loadGroups();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const deleteGroup = async (id) => {
    if (!confirm(t('pricing_delete_cat'))) return;
    await api.deletePricingGroup(id);
    if (activeGroup === id) { setActiveGroup(null); setItems([]); }
    loadGroups();
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      if (editingItem.id) {
        await api.updatePricingItem(editingItem.id, editingItem);
      } else {
        await api.createPricingItem({ ...editingItem, group_id: activeGroup });
      }
      setEditingItem(null);
      loadGroups();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!confirm(t('pricing_delete_item'))) return;
    await api.deletePricingItem(id);
    loadGroups();
  };

  const saveSectionData = async () => {
    try {
      await api.updateContent('pricing_section', sectionData);
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{t('pricing_title')}</h2>
      </div>

      {sectionData && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3>{t('section_header')}</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">{t('field_title')}</label>
              <input className="admin-input" value={sectionData.title || ''} onChange={e => setSectionData({...sectionData, title: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">{t('field_accent')}</label>
              <input className="admin-input" value={sectionData.title_accent || ''} onChange={e => setSectionData({...sectionData, title_accent: e.target.value})} />
            </div>
          </div>
          <button className="admin-btn-primary" onClick={saveSectionData} style={{marginTop:12}}>{t('save_header')}</button>
        </div>
      )}

      <div className="admin-pricing-layout">
        <div className="admin-pricing-groups">
          <div className="admin-pricing-groups-header">
            <h3>{t('pricing_categories')}</h3>
            <button className="admin-btn-sm" onClick={() => setEditingGroup({ sort_order: groups.length + 1, icon: 'ti-sparkles', title: '', title_accent: '', subtitle: '', is_first_visit: 0 })}>
              <i className="ti ti-plus"></i>
            </button>
          </div>

          {editingGroup && (
            <div className="admin-card" style={{marginBottom:16}}>
              <div className="admin-field"><label className="admin-label">{t('field_icon')}</label><input className="admin-input" value={editingGroup.icon||''} onChange={e => setEditingGroup({...editingGroup, icon: e.target.value})} placeholder="ti-wand" /></div>
              <div className="admin-field"><label className="admin-label">{t('field_title')}</label><input className="admin-input" value={editingGroup.title||''} onChange={e => setEditingGroup({...editingGroup, title: e.target.value})} /></div>
              <div className="admin-field"><label className="admin-label">{t('field_accent')}</label><input className="admin-input" value={editingGroup.title_accent||''} onChange={e => setEditingGroup({...editingGroup, title_accent: e.target.value})} /></div>
              <div className="admin-field"><label className="admin-label">{t('field_subtitle')}</label><input className="admin-input" value={editingGroup.subtitle||''} onChange={e => setEditingGroup({...editingGroup, subtitle: e.target.value})} /></div>
              <div className="admin-actions">
                <button className="admin-btn-primary" onClick={saveGroup} disabled={saving}>{saving ? '...' : t('save')}</button>
                <button className="admin-btn-secondary" onClick={() => setEditingGroup(null)}>{t('cancel')}</button>
              </div>
            </div>
          )}

          {groups.map(g => (
            <div className={`admin-pricing-group-item${activeGroup === g.id ? ' active' : ''}`} key={g.id} onClick={() => selectGroup(g)}>
              <i className={`ti ${g.icon}`}></i>
              <div>
                <strong>{g.title} {g.title_accent}</strong>
                <small>{g.subtitle}</small>
              </div>
              <div className="admin-pricing-group-actions">
                <button className="admin-btn-icon" onClick={e => { e.stopPropagation(); setEditingGroup({...g}); }}><i className="ti ti-pencil"></i></button>
                <button className="admin-btn-icon admin-btn-danger" onClick={e => { e.stopPropagation(); deleteGroup(g.id); }}><i className="ti ti-trash"></i></button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-pricing-items">
          {activeGroup ? (
            <>
              <div className="admin-pricing-groups-header">
                <h3>{t('pricing_items')}</h3>
                <button className="admin-btn-sm" onClick={() => setEditingItem({ sort_order: items.length + 1, name: '', name_small: '', time: '', price: '', old_price: '', badge: '', is_highlighted: 0 })}>
                  <i className="ti ti-plus"></i> {t('add')}
                </button>
              </div>

              {editingItem && (
                <div className="admin-card" style={{marginBottom:16}}>
                  <div className="admin-grid-2">
                    <div className="admin-field"><label className="admin-label">{t('field_name')}</label><input className="admin-input" value={editingItem.name||''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                    <div className="admin-field"><label className="admin-label">{t('field_caption')}</label><input className="admin-input" value={editingItem.name_small||''} onChange={e => setEditingItem({...editingItem, name_small: e.target.value})} placeholder={t('field_optional')} /></div>
                    <div className="admin-field"><label className="admin-label">{t('field_time')}</label><input className="admin-input" value={editingItem.time||''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} /></div>
                    <div className="admin-field"><label className="admin-label">{t('field_price')}</label><input className="admin-input" value={editingItem.price||''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
                    <div className="admin-field"><label className="admin-label">{t('field_old_price')}</label><input className="admin-input" value={editingItem.old_price||''} onChange={e => setEditingItem({...editingItem, old_price: e.target.value})} placeholder={t('field_optional')} /></div>
                    <div className="admin-field"><label className="admin-label">{t('field_badge')}</label><input className="admin-input" value={editingItem.badge||''} onChange={e => setEditingItem({...editingItem, badge: e.target.value})} placeholder="-40%" /></div>
                  </div>
                  <div className="admin-actions">
                    <button className="admin-btn-primary" onClick={saveItem} disabled={saving}>{saving ? '...' : t('save')}</button>
                    <button className="admin-btn-secondary" onClick={() => setEditingItem(null)}>{t('cancel')}</button>
                  </div>
                </div>
              )}

              <div className="admin-list">
                {items.map(item => (
                  <div className="admin-list-item" key={item.id}>
                    <div className="admin-list-info">
                      <div>
                        <strong>{item.name}</strong>
                        {item.badge && <span className="admin-badge">{item.badge}</span>}
                        <span className="admin-list-sub">{item.time} · {item.price}{item.old_price ? ` (${item.old_price})` : ''}</span>
                      </div>
                    </div>
                    <div className="admin-list-actions">
                      <button className="admin-btn-sm" onClick={() => setEditingItem({...item})}><i className="ti ti-pencil"></i></button>
                      <button className="admin-btn-sm admin-btn-danger" onClick={() => deleteItem(item.id)}><i className="ti ti-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="admin-empty">{t('pricing_select_cat')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
