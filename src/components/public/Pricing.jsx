import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function Pricing({ sectionData }) {
  const [groups, setGroups] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.getPricingFull().then(setGroups).catch(console.error);
  }, []);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  if (!sectionData) return null;

  return (
    <section className="section pricing" id="pricing">
      <div className="section-eyebrow"><div className="diamond"></div>{sectionData.eyebrow}<div className="diamond"></div></div>
      <h2 className="section-title reveal">{sectionData.title} <em>{sectionData.title_accent}</em></h2>
      <p className="section-sub reveal">{sectionData.subtitle}</p>

      <div className="pricing-wrap reveal">
        <div className="price-accordion">
          {groups.map(g => (
            <div className={`price-section${openId === g.id ? ' open' : ''}`} key={g.id}>
              <button className="price-head" onClick={() => toggle(g.id)}>
                <div className="price-head-left">
                  <div className="price-icon"><i className={`ti ${g.icon}`}></i></div>
                  <div className="price-head-text">
                    <h3><i className="ti ti-sparkles" style={{color:'var(--gold-1)', marginRight:8}}></i> {g.title} <em>{g.title_accent}</em></h3>
                    <div className="price-head-meta">{g.subtitle}</div>
                  </div>
                </div>
                <div className="price-toggle"><i className="ti ti-plus"></i></div>
              </button>
              <div className="price-body">
                <div className="price-inner">
                  <div className="price-list">
                    {(g.items || []).map(item => (
                      <div className="price-item" key={item.id}>
                        <div className="price-name">
                          {g.is_first_visit ? <i className="ti ti-sparkles" style={{color:'var(--gold-2)', marginRight:6}}></i> : null}
                          {item.name}
                          {item.name_small && <small>{item.name_small}</small>}
                          {item.badge && <span className="price-badge">{item.badge}</span>}
                        </div>
                        <div className="price-dots"></div>
                        <div className="price-time"><i className="ti ti-clock-hour-4"></i>{item.time}</div>
                        <div className="price-cost-row">
                          {item.old_price && <span className="price-cost-old">{item.old_price}</span>}
                          <span className="price-cost">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="price-note">
          <i className="ti ti-sparkles" style={{color:'var(--gold-1)', fontSize:18, marginRight:8, verticalAlign:'middle'}}></i>
          <span dangerouslySetInnerHTML={{ __html: sectionData.note }}></span>
        </div>
      </div>
    </section>
  );
}
