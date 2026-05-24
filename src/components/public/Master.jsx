export default function Master({ data }) {
  if (!data) return null;
  const skills = data.skills || [];

  return (
    <section className="section master" id="master">
      <div className="section-eyebrow"><div className="diamond"></div>{data.eyebrow}<div className="diamond"></div></div>
      <h2 className="section-title reveal">{data.section_title} <em>{data.section_title_accent}</em></h2>
      <p className="section-sub reveal">{data.section_sub}</p>

      <div className="master-grid">
        <div className="master-photo reveal">
          <div className="master-badge">{data.badge}</div>
          <div className="master-photo-frame"></div>
          <div className="master-photo-inner">
            {data.photo ? (
              <img src={data.photo} alt={`${data.name} ${data.name_accent}`} />
            ) : (
              <div className="master-photo-placeholder">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="35" r="16"/>
                  <path d="M22 88 Q22 60 50 60 Q78 60 78 88"/>
                </svg>
                <span>Foto wkrótce</span>
              </div>
            )}
          </div>
        </div>

        <div className="master-text reveal">
          <div className="section-eyebrow"><div className="diamond"></div>O specjaliście</div>
          <h2>{data.name} <em>{data.name_accent}</em></h2>
          <div className="master-role">{data.role}</div>
          <p dangerouslySetInnerHTML={{ __html: data.bio1 }}></p>
          <p dangerouslySetInnerHTML={{ __html: data.bio2 }}></p>
          <div className="master-quote">{data.quote}</div>
          <div className="master-skills">
            {skills.map((s, i) => (
              <div className="master-skill" key={i}><span className="master-skill-dot"></span>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
